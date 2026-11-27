/**
 * The HTTP API (Hono). Platform-independent: served by @hono/node-server locally and by a
 * Vercel Function in production. Everything lives under /api.
 */

import { CreateGameBody, ExplanationBody, FeedbackBody, SaveGameBody } from "@chess-teacher/contract";
import type {
  ApiError,
  ApiErrorCode,
  ConfigResponse,
  ExplanationResponse,
  GameRecord,
  GameSummary,
  MeResponse,
  PrincipleDetailResponse,
  ProgressResponse,
} from "@chess-teacher/contract";
import {
  Game,
  diagnosisFacts,
  facts,
  playedLine,
  upgradeSession,
  variationSan,
  type Lesson,
  type SavedSessionState,
} from "@chess-teacher/core";
import { baseLocale, isLocale } from "@chess-teacher/lesson-text";
import { zValidator as validator } from "@hono/zod-validator";
import { and, count, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { createMiddleware } from "hono/factory";
import type { Auth } from "./auth.ts";
import type { Db } from "./db/client.ts";
import { coachedGames, explanations, games, lessonFeedback } from "./db/schema.ts";
import { isPrinciple, principleDetailOf, progressOf, PROGRESS_GAMES, summaryOf } from "./progress.ts";
import type { Env } from "./env.ts";
import { PROMPT_VERSION, explainDiagnosis, explainLesson, parseParts, type LlmClient } from "./explain.ts";

export interface AppDeps {
  db: Db;
  auth: Auth;
  env: Env;
  /** null → AI explanations are off. */
  llm: LlmClient | null;
  now?: () => Date;
}

type Vars = { Variables: { userId: string; user: { id: string; name: string; email: string } } };

const PENDING_TIMEOUT_MS = 2 * 60 * 1000;
/**
 * Times one lesson's explanation may be written. The client tries three times on its own (a
 * request and two retries) and the player can ask for one more round; past that the facts
 * stand alone, so a lesson the coach keeps failing on can't keep spending.
 */
const MAX_ATTEMPTS = 6;
const FAILED = ["error", "rejected"];

/** Errors are codes; the client words them in the player's language. */
const failure = (error: ApiErrorCode, extra: Omit<ApiError, "error"> = {}): ApiError => ({ error, ...extra });

/** Request validation that answers with an error code, not Zod's English issues. */
const zValidator = <T extends Parameters<typeof validator>[1]>(target: "json", schema: T) =>
  validator(target, schema, (result, c) => {
    if (!result.success) return c.json(failure("invalid_request"), 400);
  });

export function createApp(deps: AppDeps) {
  const { db, auth, env, llm } = deps;
  const now = deps.now ?? (() => new Date());
  const period = () => now().toISOString().slice(0, 7);

  const app = new Hono<Vars>().basePath("/api");

  app.onError((err, c) => {
    console.error(err);
    return c.json(failure("internal"), 500);
  });

  app.get("/health", (c) => c.json({ ok: true }));

  app.get("/config", (c) => c.json<ConfigResponse>({ googleEnabled: !!env.google, llmEnabled: !!llm }));

  // Better Auth handles everything under /api/auth.
  app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));

  const requireUser = createMiddleware<Vars>(async (c, next) => {
    const s = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!s) return c.json(failure("not_signed_in"), 401);
    c.set("userId", s.user.id);
    c.set("user", { id: s.user.id, name: s.user.name, email: s.user.email });
    await next();
  });
  app.use("/me", requireUser);
  app.use("/me/*", requireUser);
  app.use("/games", requireUser);
  app.use("/games/*", requireUser);
  const limit = bodyLimit({ maxSize: 512 * 1024, onError: (c) => c.json(failure("game_too_large"), 413) });

  // ------------------------------------------------------------------ helpers

  /** Coached games this month. */
  async function usedThisMonth(userId: string): Promise<number> {
    const [row] = await db
      .select({ used: count() })
      .from(coachedGames)
      .where(and(eq(coachedGames.userId, userId), eq(coachedGames.period, period())));
    return row?.used ?? 0;
  }

  async function coachedThisMonth(userId: string, gameId: string): Promise<boolean> {
    const [row] = await db
      .select({ gameId: coachedGames.gameId })
      .from(coachedGames)
      .where(
        and(
          eq(coachedGames.userId, userId),
          eq(coachedGames.period, period()),
          eq(coachedGames.gameId, gameId),
        ),
      );
    return !!row;
  }

  const remaining = (used: number) => Math.max(0, env.coachedGamesPerMonth - used);

  /**
   * Moves must be legal from the start position, on every line; the server can check that much.
   * Each line has its own id, the line being played the latest, and every lesson is on one of them.
   */
  function checkGame(state: CreateGameBody["state"]): ApiErrorCode | null {
    const line = state.line ?? 0;
    const branches = state.branches ?? [];
    const ids = new Set([line, ...branches.map((b) => b.id)]);
    if (ids.size !== branches.length + 1 || branches.some((b) => b.id > line)) return "invalid_request";
    if (state.lessons.some((l) => l.line !== undefined && !ids.has(l.line))) return "invalid_request";
    try {
      for (const moves of [state.moves, ...branches.map((b) => b.moves)]) new Game(state.startFen, moves);
      return null;
    } catch {
      return "illegal_move";
    }
  }

  const toRecord = (row: typeof games.$inferSelect): GameRecord => ({
    id: row.id,
    state: row.state as GameRecord["state"],
    stateVersion: row.stateVersion,
    opponentRating: row.opponentRating,
    reveal: row.reveal as GameRecord["reveal"],
    finished: row.finished,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });

  async function ownGame(userId: string, id: string) {
    if (!/^[0-9a-f-]{36}$/.test(id)) return null;
    const [row] = await db
      .select()
      .from(games)
      .where(and(eq(games.id, id), eq(games.userId, userId)));
    return row ?? null;
  }

  // ------------------------------------------------------------------ me

  app.get("/me", async (c) => {
    const used = await usedThisMonth(c.get("userId"));
    return c.json<MeResponse>({
      user: c.get("user"),
      coachedGames: {
        enabled: !!llm,
        used,
        limit: env.coachedGamesPerMonth,
        remaining: remaining(used),
      },
    });
  });

  /** The user's recent games, newest first: the ones progress counts. */
  const recentGames = (userId: string) =>
    db
      .select()
      .from(games)
      .where(eq(games.userId, userId))
      .orderBy(desc(games.updatedAt))
      .limit(PROGRESS_GAMES);

  /** Lessons by principle or concept across the user's recent games (most common first). */
  app.get("/me/progress", async (c) =>
    c.json<ProgressResponse>(progressOf(await recentGames(c.get("userId")))),
  );

  /** One principle (`/features/:id` or `/diagnosis/:id`): its counts and the lessons behind them. */
  app.get("/me/progress/:source/:id", async (c) => {
    const { source, id } = c.req.param();
    if (!isPrinciple(source, id)) return c.json(failure("not_found"), 404);
    return c.json<PrincipleDetailResponse>(principleDetailOf(await recentGames(c.get("userId")), source, id));
  });

  // ------------------------------------------------------------------ games

  /** The user's latest games: `?status=active` for unfinished ones, `?status=finished` for done. */
  app.get("/games", async (c) => {
    const status = c.req.query("status");
    const userId = eq(games.userId, c.get("userId"));
    const rows = await db
      .select()
      .from(games)
      .where(
        status === "active"
          ? and(userId, eq(games.finished, false))
          : status === "finished"
            ? and(userId, eq(games.finished, true))
            : userId,
      )
      .orderBy(desc(games.updatedAt))
      .limit(20);
    return c.json<GameSummary[]>(rows.map(summaryOf));
  });

  app.post("/games", limit, zValidator("json", CreateGameBody), async (c) => {
    const body = c.req.valid("json");
    const problem = checkGame(body.state);
    if (problem) return c.json(failure(problem), 400);
    const [row] = await db
      .insert(games)
      .values({
        userId: c.get("userId"),
        state: body.state,
        opponentRating: body.opponentRating,
        reveal: body.reveal,
        finished: body.finished,
      })
      .returning();
    return c.json<GameRecord>(toRecord(row!), 201);
  });

  app.get("/games/:id", async (c) => {
    const row = await ownGame(c.get("userId"), c.req.param("id"));
    return row ? c.json<GameRecord>(toRecord(row)) : c.json(failure("not_found"), 404);
  });

  app.put("/games/:id", limit, zValidator("json", SaveGameBody), async (c) => {
    const body = c.req.valid("json");
    const userId = c.get("userId");
    const id = c.req.param("id");
    const problem = checkGame(body.state);
    if (problem) return c.json(failure(problem), 400);
    if (!/^[0-9a-f-]{36}$/.test(id)) return c.json(failure("not_found"), 404);
    // Only saves based on the latest version succeed, so two devices can't overwrite each other.
    const [row] = await db
      .update(games)
      .set({
        state: body.state,
        reveal: body.reveal,
        finished: body.finished,
        opponentRating: body.opponentRating,
        stateVersion: sql`${games.stateVersion} + 1`,
        updatedAt: now(),
      })
      .where(and(eq(games.id, id), eq(games.userId, userId), eq(games.stateVersion, body.expectedVersion)))
      .returning({ stateVersion: games.stateVersion });
    if (row) return c.json({ stateVersion: row.stateVersion });
    const existing = await ownGame(userId, id);
    if (!existing) return c.json(failure("not_found"), 404);
    return c.json(failure("conflict", { stateVersion: existing.stateVersion }), 409);
  });

  // ------------------------------------------------------------------ explanations

  async function lessonOf(userId: string, gameId: string, lessonId: number) {
    const game = await ownGame(userId, gameId);
    if (!game) return null;
    // Games saved by an older version hold lesson text in English; bring them up to date.
    const state = upgradeSession(game.state as SavedSessionState);
    const lesson = state.lessons.find((l: Lesson) => l.id === lessonId);
    return lesson ? { game, state, lesson } : null;
  }

  async function existing(gameId: string, lessonId: number) {
    const [row] = await db
      .select()
      .from(explanations)
      .where(and(eq(explanations.gameId, gameId), eq(explanations.lessonId, lessonId)));
    return row ?? null;
  }

  const respond = (row: typeof explanations.$inferSelect | null, used: number): ExplanationResponse => {
    if (!row) return { status: llm ? "pending" : "unavailable", coachedGamesRemaining: remaining(used) };
    if (row.status === "ready") {
      const parts = parseParts(row.text);
      return parts
        ? { status: "ready", parts, coachedGamesRemaining: remaining(used) }
        : { status: "ready", text: row.text ?? "", coachedGamesRemaining: remaining(used) };
    }
    const status = row.status as ExplanationResponse["status"];
    return FAILED.includes(status)
      ? { status, coachedGamesRemaining: remaining(used), canRetry: canRetry(row) }
      : { status, coachedGamesRemaining: remaining(used) };
  };

  const canRetry = (row: typeof explanations.$inferSelect) =>
    !!llm && FAILED.includes(row.status) && row.attempts < MAX_ATTEMPTS;

  app.get("/games/:id/lessons/:lessonId/explanation", async (c) => {
    const userId = c.get("userId");
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json(failure("not_found"), 404);
    const row = await existing(found.game.id, found.lesson.id);
    return c.json(respond(row, await usedThisMonth(userId)));
  });

  /** "Did this lesson make sense?" Rating again replaces the earlier rating. */
  app.put("/games/:id/lessons/:lessonId/feedback", zValidator("json", FeedbackBody), async (c) => {
    const userId = c.get("userId");
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json(failure("not_found"), 404);
    const { rating, comment } = c.req.valid("json");
    const { lesson } = found;
    await db
      .insert(lessonFeedback)
      .values({
        userId,
        gameId: found.game.id,
        lessonId: lesson.id,
        rating,
        comment: comment ?? null,
        feature: lesson.source === "features" ? String(lesson.feature) : `diagnosis:${lesson.mistake}`,
        principle: lesson.source === "features" ? String(lesson.principle) : String(lesson.concept),
        kind: String(lesson.kind),
      })
      .onConflictDoUpdate({
        target: [lessonFeedback.gameId, lessonFeedback.lessonId],
        set: { rating, comment: comment ?? null, updatedAt: now() },
      });
    return c.json({ ok: true });
  });

  /**
   * Generate the explanation for a lesson in a saved game. The client calls this when the
   * lesson is revealed, so the explanation can say what really happened after the move; it is
   * usually written while the player looks for the cause. The facts come from the saved game,
   * not from the request; the request only says which language to write in. An explanation is
   * written once, in the locale first asked for.
   */
  app.post("/games/:id/lessons/:lessonId/explanation", zValidator("json", ExplanationBody), async (c) => {
    const userId = c.get("userId");
    const requested = c.req.valid("json").locale;
    const locale = isLocale(requested) ? requested : baseLocale;
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json(failure("not_found"), 404);
    const { game, state, lesson } = found;
    let used = await usedThisMonth(userId);
    if (!llm)
      return c.json<ExplanationResponse>({ status: "unavailable", coachedGamesRemaining: remaining(used) });

    const current = await existing(game.id, lesson.id);
    const stale =
      current?.status === "pending" && now().getTime() - current.updatedAt.getTime() > PENDING_TIMEOUT_MS;
    if (current && !stale && !canRetry(current)) return c.json(respond(current, used));
    // A game already coached this month has paid for the rest of its explanations.
    if (remaining(used) <= 0 && !(await coachedThisMonth(userId, game.id))) {
      return c.json<ExplanationResponse>({ status: "quota", coachedGamesRemaining: 0 });
    }

    let lessonFacts;
    let soFar;
    try {
      lessonFacts = lesson.source === "features" ? facts(lesson) : diagnosisFacts(lesson);
      soFar = {
        movesPlayed: variationSan(lesson.fenBefore, playedLine(state, lesson)),
        trigger: lesson.trigger,
      };
    } catch {
      return c.json(failure("malformed_lesson"), 400);
    }
    const factsHash = await sha256(JSON.stringify([lessonFacts, soFar]) + PROMPT_VERSION + locale);

    // Claim the work: insert a pending row, or take over a stale or failed one.
    const claimed = current
      ? await db
          .update(explanations)
          .set({
            status: "pending",
            locale,
            factsHash,
            attempts: sql`${explanations.attempts} + 1`,
            updatedAt: now(),
          })
          .where(
            and(
              eq(explanations.id, current.id),
              or(
                and(
                  eq(explanations.status, "pending"),
                  lt(explanations.updatedAt, new Date(now().getTime() - PENDING_TIMEOUT_MS)),
                ),
                and(inArray(explanations.status, FAILED), lt(explanations.attempts, MAX_ATTEMPTS)),
              ),
            ),
          )
          .returning({ id: explanations.id, attempts: explanations.attempts })
      : await db
          .insert(explanations)
          .values({
            userId,
            gameId: game.id,
            lessonId: lesson.id,
            status: "pending",
            promptVersion: PROMPT_VERSION,
            factsHash,
            locale,
          })
          .onConflictDoNothing()
          .returning({ id: explanations.id, attempts: explanations.attempts });
    const [claim] = claimed;
    if (!claim) return c.json(respond(await existing(game.id, lesson.id), used));
    const rowId = claim.id;

    const result =
      lesson.source === "features"
        ? await explainLesson(llm, env.llmModel, facts(lesson), soFar, locale)
        : await explainDiagnosis(llm, env.llmModel, diagnosisFacts(lesson), soFar, locale);
    await db
      .update(explanations)
      .set({
        status: result.status,
        model: result.model,
        text: result.text ?? null,
        inputTokens: result.inputTokens ?? null,
        outputTokens: result.outputTokens ?? null,
        costUsd: result.costUsd ?? null,
        error: result.error ?? null,
        updatedAt: now(),
      })
      .where(eq(explanations.id, rowId));

    if (result.status === "ready") {
      // Only a successful explanation makes the game coached, and only its first one this
      // month uses up the allowance.
      const counted = await db
        .insert(coachedGames)
        .values({ userId, period: period(), gameId: game.id })
        .onConflictDoNothing()
        .returning({ gameId: coachedGames.gameId });
      used += counted.length;
      return c.json<ExplanationResponse>({
        status: "ready",
        parts: result.parts!,
        coachedGamesRemaining: remaining(used),
      });
    }
    return c.json<ExplanationResponse>({
      status: result.status,
      coachedGamesRemaining: remaining(used),
      canRetry: claim.attempts < MAX_ATTEMPTS,
    });
  });

  return app;
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type App = ReturnType<typeof createApp>;
