/**
 * The HTTP API (Hono). Platform-independent: served by @hono/node-server locally and by a
 * Vercel Function in production. Everything lives under /api.
 */

import { CreateGameBody, FeedbackBody, SaveGameBody } from "@chess-teacher/contract";
import type {
  ConfigResponse,
  ExplanationResponse,
  GameRecord,
  GameSummary,
  MeResponse,
  PrincipleProgress,
  ProgressResponse,
} from "@chess-teacher/contract";
import { Game, facts, isPrincipleId, upgradeSession, type Lesson } from "@chess-teacher/core";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, lt, sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { createMiddleware } from "hono/factory";
import type { Auth } from "./auth.ts";
import type { Db } from "./db/client.ts";
import { explanations, games, lessonFeedback, usage } from "./db/schema.ts";
import type { Env } from "./env.ts";
import { PROMPT_VERSION, explainLesson, parseParts, type LlmClient } from "./explain.ts";

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

export function createApp(deps: AppDeps) {
  const { db, auth, env, llm } = deps;
  const now = deps.now ?? (() => new Date());
  const period = () => now().toISOString().slice(0, 7);

  const app = new Hono<Vars>().basePath("/api");

  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "internal error" }, 500);
  });

  app.get("/health", (c) => c.json({ ok: true }));

  app.get("/config", (c) => c.json<ConfigResponse>({ googleEnabled: !!env.google, llmEnabled: !!llm }));

  // Better Auth handles everything under /api/auth.
  app.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw));

  const requireUser = createMiddleware<Vars>(async (c, next) => {
    const s = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!s) return c.json({ error: "not signed in" }, 401);
    c.set("userId", s.user.id);
    c.set("user", { id: s.user.id, name: s.user.name, email: s.user.email });
    await next();
  });
  app.use("/me", requireUser);
  app.use("/me/*", requireUser);
  app.use("/games", requireUser);
  app.use("/games/*", requireUser);
  const limit = bodyLimit({ maxSize: 512 * 1024, onError: (c) => c.json({ error: "game too large" }, 413) });

  // ------------------------------------------------------------------ helpers

  async function usedThisMonth(userId: string): Promise<number> {
    const [row] = await db
      .select({ used: usage.explanationsUsed })
      .from(usage)
      .where(and(eq(usage.userId, userId), eq(usage.period, period())));
    return row?.used ?? 0;
  }

  const remaining = (used: number) => Math.max(0, env.explanationsPerMonth - used);

  /** Moves must be legal from the start position; the server can check that much. */
  function checkMoves(state: { startFen: string; moves: string[] }): string | null {
    try {
      new Game(state.startFen, state.moves);
      return null;
    } catch {
      return "the game contains an illegal move";
    }
  }

  const toRecord = (row: typeof games.$inferSelect): GameRecord => ({
    id: row.id,
    state: row.state as GameRecord["state"],
    stateVersion: row.stateVersion,
    opponentSkill: row.opponentSkill,
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
      explanations: {
        enabled: !!llm,
        used,
        limit: env.explanationsPerMonth,
        remaining: remaining(used),
      },
    });
  });

  /** Lessons by principle across the user's recent games (most common first). */
  app.get("/me/progress", async (c) => {
    const rows = await db
      .select({ state: games.state })
      .from(games)
      .where(eq(games.userId, c.get("userId")))
      .orderBy(desc(games.updatedAt))
      .limit(50);
    const byPrinciple = new Map<string, PrincipleProgress>();
    let lessons = 0;
    rows.forEach((row, gameIndex) => {
      const seenInGame = new Set<string>();
      for (const l of (row.state as { lessons: Lesson[] }).lessons ?? []) {
        if (l.status === "rewound" || !isPrincipleId(l.principle)) continue;
        lessons += 1;
        const p =
          byPrinciple.get(l.principle) ??
          ({
            id: l.principle,
            lessons: 0,
            foundYourself: 0,
            revealed: 0,
            fixed: 0,
            recentGames: 0,
          } satisfies PrincipleProgress);
        p.lessons += 1;
        if (l.status === "triggered" && l.foundCause !== null) p.revealed += 1;
        if (l.foundCause === true) p.foundYourself += 1;
        if (l.status === "fixed") p.fixed += 1;
        if (gameIndex < 5 && !seenInGame.has(l.principle)) {
          p.recentGames += 1;
          seenInGame.add(l.principle);
        }
        byPrinciple.set(l.principle, p);
      }
    });
    return c.json<ProgressResponse>({
      games: rows.length,
      lessons,
      principles: [...byPrinciple.values()].sort((a, b) => b.lessons - a.lessons),
    });
  });

  // ------------------------------------------------------------------ games

  app.get("/games", async (c) => {
    const activeOnly = c.req.query("status") === "active";
    const rows = await db
      .select()
      .from(games)
      .where(
        activeOnly
          ? and(eq(games.userId, c.get("userId")), eq(games.finished, false))
          : eq(games.userId, c.get("userId")),
      )
      .orderBy(desc(games.updatedAt))
      .limit(20);
    return c.json<GameSummary[]>(
      rows.map((r) => {
        const s = r.state as GameRecord["state"];
        return {
          id: r.id,
          userColour: s.userColour,
          moves: s.moves.length,
          finished: r.finished,
          updatedAt: r.updatedAt.toISOString(),
        };
      }),
    );
  });

  app.post("/games", limit, zValidator("json", CreateGameBody), async (c) => {
    const body = c.req.valid("json");
    const problem = checkMoves(body.state);
    if (problem) return c.json({ error: problem }, 400);
    const [row] = await db
      .insert(games)
      .values({
        userId: c.get("userId"),
        state: body.state,
        opponentSkill: body.opponentSkill,
        reveal: body.reveal,
        finished: body.finished,
      })
      .returning();
    return c.json<GameRecord>(toRecord(row!), 201);
  });

  app.get("/games/:id", async (c) => {
    const row = await ownGame(c.get("userId"), c.req.param("id"));
    return row ? c.json<GameRecord>(toRecord(row)) : c.json({ error: "not found" }, 404);
  });

  app.put("/games/:id", limit, zValidator("json", SaveGameBody), async (c) => {
    const body = c.req.valid("json");
    const userId = c.get("userId");
    const id = c.req.param("id");
    const problem = checkMoves(body.state);
    if (problem) return c.json({ error: problem }, 400);
    if (!/^[0-9a-f-]{36}$/.test(id)) return c.json({ error: "not found" }, 404);
    // Only saves based on the latest version succeed, so two devices can't overwrite each other.
    const [row] = await db
      .update(games)
      .set({
        state: body.state,
        reveal: body.reveal,
        finished: body.finished,
        opponentSkill: body.opponentSkill,
        stateVersion: sql`${games.stateVersion} + 1`,
        updatedAt: now(),
      })
      .where(and(eq(games.id, id), eq(games.userId, userId), eq(games.stateVersion, body.expectedVersion)))
      .returning({ stateVersion: games.stateVersion });
    if (row) return c.json({ stateVersion: row.stateVersion });
    const existing = await ownGame(userId, id);
    if (!existing) return c.json({ error: "not found" }, 404);
    return c.json({ error: "this game was changed elsewhere", stateVersion: existing.stateVersion }, 409);
  });

  // ------------------------------------------------------------------ explanations

  async function lessonOf(userId: string, gameId: string, lessonId: number) {
    const game = await ownGame(userId, gameId);
    if (!game) return null;
    const state = game.state as { lessons: Lesson[] };
    const lesson = state.lessons.find((l) => l.id === lessonId);
    return lesson ? { game, lesson } : null;
  }

  async function existing(gameId: string, lessonId: number) {
    const [row] = await db
      .select()
      .from(explanations)
      .where(and(eq(explanations.gameId, gameId), eq(explanations.lessonId, lessonId)));
    return row ?? null;
  }

  const respond = (row: typeof explanations.$inferSelect | null, used: number): ExplanationResponse => {
    if (!row) return { status: llm ? "pending" : "unavailable", remaining: remaining(used) };
    if (row.status === "ready") {
      const parts = parseParts(row.text);
      return parts
        ? { status: "ready", parts, remaining: remaining(used) }
        : { status: "ready", text: row.text ?? "", remaining: remaining(used) };
    }
    return { status: row.status as ExplanationResponse["status"], remaining: remaining(used) };
  };

  app.get("/games/:id/lessons/:lessonId/explanation", async (c) => {
    const userId = c.get("userId");
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json({ error: "not found" }, 404);
    const row = await existing(found.game.id, found.lesson.id);
    return c.json(respond(row, await usedThisMonth(userId)));
  });

  /** "Did this lesson make sense?" Rating again replaces the earlier rating. */
  app.put("/games/:id/lessons/:lessonId/feedback", zValidator("json", FeedbackBody), async (c) => {
    const userId = c.get("userId");
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json({ error: "not found" }, 404);
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
        feature: String(lesson.feature),
        principle: String(lesson.principle),
        kind: String(lesson.kind),
      })
      .onConflictDoUpdate({
        target: [lessonFeedback.gameId, lessonFeedback.lessonId],
        set: { rating, comment: comment ?? null, updatedAt: now() },
      });
    return c.json({ ok: true });
  });

  /**
   * Generate the explanation for a lesson in a saved game. The client calls this as soon
   * as the lesson is created, several moves before the reveal, so it's usually ready in time.
   * The facts come from the saved game, not from the request.
   */
  app.post("/games/:id/lessons/:lessonId/explanation", async (c) => {
    const userId = c.get("userId");
    const found = await lessonOf(userId, c.req.param("id"), Number(c.req.param("lessonId")));
    if (!found) return c.json({ error: "not found" }, 404);
    const { game, lesson } = found;
    let used = await usedThisMonth(userId);
    if (!llm) return c.json<ExplanationResponse>({ status: "unavailable", remaining: remaining(used) });

    const current = await existing(game.id, lesson.id);
    const stale =
      current?.status === "pending" && now().getTime() - current.updatedAt.getTime() > PENDING_TIMEOUT_MS;
    if (current && !stale) return c.json(respond(current, used));
    if (remaining(used) <= 0) return c.json<ExplanationResponse>({ status: "quota", remaining: 0 });

    let lessonFacts;
    try {
      lessonFacts = facts(lesson);
    } catch {
      return c.json({ error: "lesson is malformed" }, 400);
    }
    const factsHash = await sha256(JSON.stringify(lessonFacts) + PROMPT_VERSION);

    // Claim the work: insert a pending row, or take over a stale one.
    const claimed = current
      ? await db
          .update(explanations)
          .set({ status: "pending", updatedAt: now() })
          .where(
            and(
              eq(explanations.id, current.id),
              eq(explanations.status, "pending"),
              lt(explanations.updatedAt, new Date(now().getTime() - PENDING_TIMEOUT_MS)),
            ),
          )
          .returning({ id: explanations.id })
      : await db
          .insert(explanations)
          .values({
            userId,
            gameId: game.id,
            lessonId: lesson.id,
            status: "pending",
            promptVersion: PROMPT_VERSION,
            factsHash,
          })
          .onConflictDoNothing()
          .returning({ id: explanations.id });
    if (!claimed.length) return c.json(respond(await existing(game.id, lesson.id), used));
    const rowId = claimed[0]!.id;

    const result = await explainLesson(llm, env.llmModel, lessonFacts);
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
      // Only successful explanations count towards the user's allowance.
      await db
        .insert(usage)
        .values({ userId, period: period(), explanationsUsed: 1 })
        .onConflictDoUpdate({
          target: [usage.userId, usage.period],
          set: { explanationsUsed: sql`${usage.explanationsUsed} + 1` },
        });
      used += 1;
      return c.json<ExplanationResponse>({
        status: "ready",
        parts: result.parts!,
        remaining: remaining(used),
      });
    }
    return c.json<ExplanationResponse>({ status: result.status, remaining: remaining(used) });
  });

  return app;
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type App = ReturnType<typeof createApp>;
