/**
 * API integration tests: real Hono app, real Better Auth, real Postgres (PGlite in memory),
 * fake LLM client. Game states with real lessons come from a recorded game (tools/sim/games).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  Game,
  Position,
  STANDARD_START,
  detectMistake,
  diagnosisFacts,
  newSession,
  opponentMove,
  playedLine,
  plyOf,
  squareName,
  startUserTurn,
  userMove,
  type DiagnosedLesson,
  type Engines,
  type FeatureLesson,
  type Lesson,
  type SessionState,
  type TeachingConfig,
} from "@chess-teacher/core";
import { RecordedEngine, type RecordedCall } from "@chess-teacher/engine";
import { readEnv } from "../src/env.ts";
import type { LlmClient } from "../src/explain.ts";
import { createServer } from "../src/server.ts";

const ORIGIN = "http://localhost:5173";
const EN_GB = { locale: "en-GB" };

/** A game state with several lessons, from a recorded game. */
async function stateWithLessons(): Promise<SessionState> {
  const fx = JSON.parse(
    readFileSync(join(import.meta.dirname, "../../../tools/sim/games/game-01.json"), "utf8"),
  ) as {
    userColour: "w" | "b";
    config: TeachingConfig;
    steps: { type: string; move?: string }[];
    engineCalls: { analyst: RecordedCall[]; weak: RecordedCall[] };
  };
  const engines: Engines = {
    analyst: new RecordedEngine(fx.engineCalls.analyst),
    weak: new RecordedEngine(fx.engineCalls.weak),
  };
  let s = newSession({ userColour: fx.userColour, config: fx.config });
  for (const step of fx.steps) {
    if (step.type === "startUserTurn") s = (await startUserTurn(s, engines)).state;
    else if (step.type === "userMove") s = (await userMove(s, step.move!, engines)).state;
    else s = (await opponentMove(s, engines)).state;
  }
  return s;
}
const recorded = await stateWithLessons();

/** Recorded games come from `diagnose`, so every lesson in them is a diagnosed lesson. */
function diagnosed(l: Lesson): DiagnosedLesson {
  if (l.source !== "diagnosis") throw new Error(`lesson ${l.id} is not a diagnosed lesson`);
  return l;
}

/** Squares of the first recorded lesson's position, with or without a piece on them. */
function squaresOfFirstLesson(occupied: boolean): string[] {
  const l = diagnosed(recorded.lessons[0]!);
  const pos = new Position(l.fenBefore);
  const out: string[] = [];
  for (let s = 0; s < 64; s++) if ((pos.pieceAt(s) !== null) === occupied) out.push(squareName(s));
  return out;
}

const occupiedSquare = (): string => squaresOfFirstLesson(true)[0]!;

/** An empty square the first recorded lesson's facts never mention. */
function squareNobodyMentions(): string {
  const said = JSON.stringify(diagnosisFacts(diagnosed(recorded.lessons[0]!)));
  const square = squaresOfFirstLesson(false).find((s) => !said.includes(s));
  if (!square) throw new Error("every empty square is mentioned");
  return square;
}

/** A lesson as games saved before diagnosis made them: 1. e4 e5 2. Ba6, and the knight takes. */
function featureLesson(): FeatureLesson {
  const before = new Game(STANDARD_START, ["e2e4", "e7e5"]);
  const l = detectMistake(
    1,
    0,
    before.fen,
    "f1a6",
    new Game(STANDARD_START, ["e2e4", "e7e5", "f1a6"]),
    [{ move: "g1f3", score: 40, pv: ["g1f3", "b8c6", "f1c4"] }],
    [{ move: "b8a6", score: 320, pv: ["b8a6", "g1f3", "d7d6"] }],
    DEFAULT_CONFIG,
  );
  if (!l) throw new Error("expected a lesson for 2. Ba6");
  return l;
}

/** A fake LLM that answers with whatever text the test sets. */
function fakeLlm() {
  const fake = {
    calls: 0,
    parts: {
      headline: "Your move left a weakness",
      what_it_allowed: "It let your opponent improve.",
      why_better: "The better move kept things solid.",
    },
    beta: {
      messages: {
        create: async () => {
          fake.calls += 1;
          return {
            content: [{ type: "text", text: JSON.stringify(fake.parts) }],
            stop_reason: "end_turn",
            model: "claude-opus-5-5",
            usage: { input_tokens: 400, output_tokens: 150 },
          };
        },
      },
    },
  };
  return fake;
}

async function setup(opts: { llm?: LlmClient | null; perMonth?: number } = {}) {
  const env = {
    ...readEnv({ FREE_COACHED_GAMES_PER_MONTH: String(opts.perMonth ?? 30) }),
    authUrl: ORIGIN,
    trustedOrigins: [ORIGIN],
  };
  const server = await createServer({
    env,
    llm: opts.llm === undefined ? fakeLlm() : opts.llm,
    migrate: true,
  });
  const call = (path: string, init: RequestInit & { cookie?: string; json?: unknown } = {}) => {
    const headers = new Headers(init.headers);
    headers.set("origin", ORIGIN);
    if (init.cookie) headers.set("cookie", init.cookie);
    if (init.json !== undefined) headers.set("content-type", "application/json");
    return server.app.request(`http://localhost${path}`, {
      ...init,
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });
  };
  const signUp = async (email: string) => {
    const res = await call("/api/auth/sign-up/email", {
      method: "POST",
      json: { email, password: "correct horse battery", name: email.split("@")[0] },
    });
    expect(res.status).toBe(200);
    return res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
  };
  return { server, call, signUp };
}

const newGameBody = (state: SessionState = newSession({ userColour: "w" })) => ({
  state,
  opponentRating: 1100,
  reveal: null,
  finished: false,
});

describe("auth", () => {
  it("rejects requests without a session", async () => {
    const { call } = await setup();
    expect((await call("/api/me")).status).toBe(401);
    expect((await call("/api/games")).status).toBe(401);
  });

  it("signs up with email and password, and reports the allowance", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("ada@example.com");
    const me = await (await call("/api/me", { cookie })).json();
    expect(me.user.email).toBe("ada@example.com");
    expect(me.coachedGames).toEqual({ enabled: true, used: 0, limit: 30, remaining: 30 });
  });

  it("signs in again with the same password", async () => {
    const { call, signUp } = await setup();
    await signUp("bob@example.com");
    const res = await call("/api/auth/sign-in/email", {
      method: "POST",
      json: { email: "bob@example.com", password: "correct horse battery" },
    });
    expect(res.status).toBe(200);
    const bad = await call("/api/auth/sign-in/email", {
      method: "POST",
      json: { email: "bob@example.com", password: "wrong password!" },
    });
    expect(bad.status).toBe(401);
  });

  it("reports whether Google and AI explanations are available", async () => {
    const { call } = await setup({ llm: null });
    expect(await (await call("/api/config")).json()).toEqual({ googleEnabled: false, llmEnabled: false });
  });
});

describe("games", () => {
  it("creates, loads, lists and saves a game with version checks", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("cara@example.com");
    const created = await (await call("/api/games", { method: "POST", cookie, json: newGameBody() })).json();
    expect(created.stateVersion).toBe(1);

    const state = { ...created.state, moves: ["e2e4"] };
    const saved = await call(`/api/games/${created.id}`, {
      method: "PUT",
      cookie,
      json: { ...newGameBody(state), expectedVersion: 1 },
    });
    expect(await saved.json()).toEqual({ stateVersion: 2 });

    // A save based on the old version is refused: another device got there first.
    const stale = await call(`/api/games/${created.id}`, {
      method: "PUT",
      cookie,
      json: { ...newGameBody(state), expectedVersion: 1 },
    });
    expect(stale.status).toBe(409);
    expect((await stale.json()).stateVersion).toBe(2);

    const loaded = await (await call(`/api/games/${created.id}`, { cookie })).json();
    expect(loaded.state.moves).toEqual(["e2e4"]);
    const list = await (await call("/api/games?status=active", { cookie })).json();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: created.id, moves: 1, finished: false });
  });

  it("rejects games with illegal moves", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("dan@example.com");
    const state = { ...newSession({ userColour: "w" }), moves: ["e2e5"] };
    expect((await call("/api/games", { method: "POST", cookie, json: newGameBody(state) })).status).toBe(400);
  });

  it("rejects games with malformed scores or resignation", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("erin@example.com");
    for (const bad of [{ resigned: "yes" }, { scores: ["x"] }]) {
      const json = { ...newGameBody(), state: { ...newSession({ userColour: "w" }), ...bad } };
      expect((await call("/api/games", { method: "POST", cookie, json })).status).toBe(400);
    }
  });

  it("checks the moves of every line left behind, and that each lesson is on a line", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("fay@example.com");
    const base = { ...newSession({ userColour: "w" }), line: 1, moves: ["d2d4"] };
    const post = (state: object) =>
      call("/api/games", { method: "POST", cookie, json: newGameBody(state as SessionState) });
    expect((await post({ ...base, branches: [{ id: 0, moves: ["e2e4", "e7e5"] }] })).status).toBe(201);
    expect(await (await post({ ...base, branches: [{ id: 0, moves: ["e2e5"] }] })).json()).toEqual({
      error: "illegal_move",
    });
    // Two lines with one id, a line left behind after the one being played, and a lesson on a
    // line the game doesn't have.
    expect((await post({ ...base, branches: [{ id: 1, moves: ["e2e4"] }] })).status).toBe(400);
    expect((await post({ ...base, branches: [{ id: 2, moves: ["e2e4"] }] })).status).toBe(400);
    const lesson = { ...recorded.lessons[0], line: 7 };
    expect((await post({ ...base, lessons: [lesson] })).status).toBe(400);
  });

  it("lists finished games with their outcome and lessons", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("gus@example.com");
    await call("/api/games", { method: "POST", cookie, json: newGameBody() });
    const finished = { ...newGameBody({ ...recorded, resigned: true }), finished: true };
    const done = await (await call("/api/games", { method: "POST", cookie, json: finished })).json();
    const list = await (await call("/api/games?status=finished", { cookie })).json();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({
      id: done.id,
      finished: true,
      outcome: "lost",
      lessons: recorded.lessons.filter((l) => l.status !== "rewound").length,
    });
  });

  it("keeps each user's games private", async () => {
    const { call, signUp } = await setup();
    const alice = await signUp("alice@example.com");
    const eve = await signUp("eve@example.com");
    const created = await (
      await call("/api/games", { method: "POST", cookie: alice, json: newGameBody() })
    ).json();
    expect((await call(`/api/games/${created.id}`, { cookie: eve })).status).toBe(404);
    expect(
      (
        await call(`/api/games/${created.id}`, {
          method: "PUT",
          cookie: eve,
          json: { ...newGameBody(), expectedVersion: 1 },
        })
      ).status,
    ).toBe(404);
  });
});

describe("explanations", () => {
  const lessonIds = recorded.lessons.map((l) => l.id);

  it("generates once, caches, and counts against the allowance", async () => {
    const llm = fakeLlm();
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("eli@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const url = `/api/games/${game.id}/lessons/${lessonIds[0]}/explanation`;

    expect(await (await call(url, { cookie })).json()).toMatchObject({ status: "pending" });
    const first = await (await call(url, { method: "POST", cookie, json: EN_GB })).json();
    expect(first).toEqual({ status: "ready", parts: llm.parts, coachedGamesRemaining: 29 });
    const again = await (await call(url, { method: "POST", cookie, json: EN_GB })).json();
    expect(again).toEqual({ status: "ready", parts: llm.parts, coachedGamesRemaining: 29 });
    expect(llm.calls).toBe(1);
    expect(await (await call(url, { cookie })).json()).toMatchObject({ status: "ready" });
  });

  it("rejects explanations that mention squares not in the facts, without charging", async () => {
    const llm = fakeLlm();
    llm.parts = { ...llm.parts, why_better: `The knight on ${squareNobodyMentions()} was the problem.` };
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("fay@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const res = await (
      await call(`/api/games/${game.id}/lessons/${lessonIds[0]}/explanation`, {
        method: "POST",
        cookie,
        json: EN_GB,
      })
    ).json();
    expect(res).toEqual({ status: "rejected", coachedGamesRemaining: 30 });
  });

  it("lets the coach name a square a piece stands on", async () => {
    const llm = fakeLlm();
    llm.parts = { ...llm.parts, why_better: `The piece on ${occupiedSquare()} was the problem.` };
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("fen@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const res = await (
      await call(`/api/games/${game.id}/lessons/${lessonIds[0]}/explanation`, {
        method: "POST",
        cookie,
        json: EN_GB,
      })
    ).json();
    expect(res.status).toBe("ready");
  });

  it("counts each coached game once, and stops new games at the monthly allowance", async () => {
    const llm = fakeLlm();
    const { call, signUp } = await setup({ llm, perMonth: 1 });
    const cookie = await signUp("gus@example.com");
    const newGame = async () =>
      (await (await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })).json()).id;
    const post = (gameId: string, id: number) =>
      Promise.resolve(
        call(`/api/games/${gameId}/lessons/${id}/explanation`, { method: "POST", cookie, json: EN_GB }),
      ).then((r) => r.json());
    const first = await newGame();
    expect(await post(first, lessonIds[0]!)).toEqual({
      status: "ready",
      parts: llm.parts,
      coachedGamesRemaining: 0,
    });
    expect(await post(first, lessonIds[1]!)).toEqual({
      status: "ready",
      parts: llm.parts,
      coachedGamesRemaining: 0,
    });
    expect(await post(await newGame(), lessonIds[0]!)).toEqual({ status: "quota", coachedGamesRemaining: 0 });
    const me = await (await call("/api/me", { cookie })).json();
    expect(me.coachedGames).toEqual({ enabled: true, used: 1, limit: 1, remaining: 0 });
  });

  it("says AI explanations are unavailable without an API key", async () => {
    const { call, signUp } = await setup({ llm: null });
    const cookie = await signUp("hal@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const res = await (
      await call(`/api/games/${game.id}/lessons/${lessonIds[0]}/explanation`, {
        method: "POST",
        cookie,
        json: EN_GB,
      })
    ).json();
    expect(res.status).toBe("unavailable");
  });

  it("404s for lessons that don't exist", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("ivy@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    expect(
      (await call(`/api/games/${game.id}/lessons/999/explanation`, { method: "POST", cookie, json: EN_GB }))
        .status,
    ).toBe(404);
  });
});

beforeEach(() => {
  expect(recorded.lessons.length).toBeGreaterThan(1);
});

describe("trusted origins", () => {
  const signUpFrom = async (env: ReturnType<typeof readEnv>, origin: string) => {
    const server = await createServer({ env, llm: null, migrate: true });
    const res = await server.app.request("http://localhost:5178/api/auth/sign-up/email", {
      method: "POST",
      // Better Auth checks the origin when cookies are present (CSRF protection), as they are
      // when a browser already has a session cookie for localhost from another port.
      headers: { "content-type": "application/json", origin, cookie: "better-auth.session_token=stale" },
      body: JSON.stringify({ email: "port@example.com", password: "correct horse battery", name: "Port" }),
    });
    return res.status;
  };

  it("locally, accepts the web dev server on any localhost port", async () => {
    expect(await signUpFrom(readEnv({}), "http://localhost:5178")).toBe(200);
    expect(await signUpFrom(readEnv({}), "http://127.0.0.1:4000")).toBe(200);
  });

  it("locally, still rejects other sites", async () => {
    expect(await signUpFrom(readEnv({}), "https://evil.example")).toBe(403);
    expect(await signUpFrom(readEnv({}), "http://localhost.evil.example:5178")).toBe(403);
  });

  it("in production, only trusts the configured URL", async () => {
    const prod = readEnv({
      VERCEL: "1",
      VERCEL_ENV: "production",
      BETTER_AUTH_URL: "https://chess.example.com",
      BETTER_AUTH_SECRET: "a-long-production-secret-for-tests-0123456789",
    });
    expect(prod.local).toBe(false);
    expect(await signUpFrom(prod, "http://localhost:5178")).toBe(403);
  });
});

describe("lesson feedback", () => {
  it("records a rating, replaces it on re-rating, and 404s for other users", async () => {
    const { server, call, signUp } = await setup({ llm: null });
    const cookie = await signUp("rita@example.com");
    const other = await signUp("otto@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const url = `/api/games/${game.id}/lessons/${recorded.lessons[0]!.id}/feedback`;

    expect(
      (await call(url, { method: "PUT", cookie, json: { rating: -1, comment: "unclear" } })).status,
    ).toBe(200);
    expect((await call(url, { method: "PUT", cookie, json: { rating: 1 } })).status).toBe(200);
    expect((await call(url, { method: "PUT", cookie, json: { rating: 5 } })).status).toBe(400);
    expect((await call(url, { method: "PUT", cookie: other, json: { rating: 1 } })).status).toBe(404);

    const { lessonFeedback } = await import("../src/db/schema.ts");
    const rows = await server.db.select().from(lessonFeedback);
    expect(rows).toHaveLength(1);
    const lesson = diagnosed(recorded.lessons[0]!);
    expect(rows[0]).toMatchObject({ rating: 1, comment: null, feature: `diagnosis:${lesson.mistake}` });
  });
});

describe("progress", () => {
  it("counts lessons by concept across the user's games", async () => {
    const { call, signUp } = await setup({ llm: null });
    const cookie = await signUp("pia@example.com");
    expect(await (await call("/api/me/progress", { cookie })).json()).toEqual({
      games: 0,
      lessons: 0,
      principles: [],
    });

    // Lessons with a concept are counted under it; the first such lesson is found once.
    const index = recorded.lessons.findIndex((l) => diagnosed(l).concept !== null);
    const concept = diagnosed(recorded.lessons[index]!).concept;
    const found = structuredClone(recorded);
    found.lessons[index]!.status = "triggered";
    found.lessons[index]!.foundCause = true;
    await call("/api/games", { method: "POST", cookie, json: newGameBody(found) });
    await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) });

    const progress = await (await call("/api/me/progress", { cookie })).json();
    expect(progress.games).toBe(2);
    const counted = recorded.lessons.filter(
      (l) => l.status !== "rewound" && diagnosed(l).concept !== null,
    ).length;
    expect(progress.lessons).toBe(2 * counted);
    const first = progress.principles.find(
      (p: { kind: string; id: string }) => p.kind === "concept" && p.id === concept,
    );
    expect(first.foundYourself).toBeGreaterThanOrEqual(1);
    expect(first.recentGames).toBe(2);
    expect((await call("/api/me/progress")).status).toBe(401);
  });
});

describe("a principle's lessons", () => {
  const counted = recorded.lessons.filter((l) => l.status !== "rewound");
  const withConcept = counted.filter((l) => diagnosed(l).concept !== null);
  const first = withConcept[0];
  if (!first) throw new Error("the recorded game has no lesson with a concept");
  const concept = diagnosed(first).concept;
  const onConcept = counted.filter((l) => diagnosed(l).concept === concept);

  it("lists each game's lessons on it, with its counts as on the progress page", async () => {
    const { call, signUp } = await setup({ llm: null });
    const cookie = await signUp("ida@example.com");
    const finished = { ...newGameBody({ ...recorded, resigned: true }), finished: true };
    const game = await (await call("/api/games", { method: "POST", cookie, json: finished })).json();

    const detail = await (await call(`/api/me/progress/concept/${concept}`, { cookie })).json();
    const progress = await (await call("/api/me/progress", { cookie })).json();
    expect(detail.games).toBe(1);
    expect(detail.progress).toEqual(
      progress.principles.find((p: { kind: string; id: string }) => p.kind === "concept" && p.id === concept),
    );
    expect(detail.occurrences).toHaveLength(1);
    expect(detail.occurrences[0].game).toMatchObject({ id: game.id, finished: true, outcome: "lost" });
    expect(detail.occurrences[0].lessons).toEqual(
      onConcept.map((l) => ({
        lesson: expect.objectContaining({ id: l.id, concept }),
        played: playedLine(recorded, l),
        onGameLine: true,
      })),
    );
  });

  it("marks a lesson in an earlier try", async () => {
    const { call, signUp } = await setup({ llm: null });
    const cookie = await signUp("jo@example.com");
    // The player went back to just before a later lesson on another concept: what they played
    // first, from there on, is an earlier try. Lessons before it are on the line the game ended on.
    const later = withConcept.filter((l) => diagnosed(l).concept !== concept && l.ply > first.ply).at(-1);
    if (!later) throw new Error("the recorded game has no later lesson on another concept");
    const branched: SessionState = {
      ...recorded,
      moves: recorded.moves.slice(0, later.ply - plyOf(recorded.startFen)),
      lessons: recorded.lessons.map((l) => ({ ...l, line: 0 })),
      line: 1,
      branches: [{ id: 0, moves: recorded.moves, scores: recorded.scores }],
    };
    await call("/api/games", { method: "POST", cookie, json: newGameBody(branched) });

    const flags = async (c: string | null) => {
      const detail = await (await call(`/api/me/progress/concept/${c}`, { cookie })).json();
      const lessons: { lesson: { id: number }; onGameLine: boolean }[] = detail.occurrences[0].lessons;
      return lessons.map((l) => [l.lesson.id, l.onGameLine]);
    };
    const expected = (c: string | null) =>
      counted.filter((l) => diagnosed(l).concept === c).map((l) => [l.id, l.ply < later.ply]);
    // `first` is before where they went back, on the game's line; `later` is in the earlier try.
    expect(await flags(concept)).toEqual(expected(concept));
    expect(await flags(diagnosed(later).concept)).toEqual(expected(diagnosed(later).concept));
  });

  it("is only there for a principle or concept the core knows, and only signed in", async () => {
    const { call, signUp } = await setup({ llm: null });
    const cookie = await signUp("kit@example.com");
    expect((await call("/api/me/progress/concept/not_a_concept", { cookie })).status).toBe(404);
    expect((await call(`/api/me/progress/principle/${concept}`, { cookie })).status).toBe(404);
    expect((await call(`/api/me/progress/concept/${concept}`)).status).toBe(401);
  });
});

describe("AI prompt facts", () => {
  it("gives the moves really played apart from the engine's predictions", async () => {
    const { diagnosisPromptFacts, DIAGNOSIS_PROMPT } = await import("../src/explain.ts");
    const { diagnosisFacts } = await import("@chess-teacher/core");
    const f = diagnosisPromptFacts(diagnosisFacts(diagnosed(recorded.lessons[0]!)), {
      movesPlayed: "15. e4 dxe4 16. fxe4",
      trigger: { kind: "losing_material" },
    });
    expect(f).toMatchObject({
      moves_played_in_the_game: "15. e4 dxe4 16. fxe4",
      what_happened_in_the_game: "You're about to lose material.",
    });
    expect(f).toHaveProperty("predicted_continuation_after_your_move");
    expect(f).not.toHaveProperty("your_line");
    expect(DIAGNOSIS_PROMPT).toMatch(/has NOT happened/);
  });

  it("words the verified facts and the concepts in en-GB from the catalogue", async () => {
    const { diagnosisPromptFacts } = await import("../src/explain.ts");
    const { diagnosisFacts } = await import("@chess-teacher/core");
    const f = diagnosisPromptFacts(diagnosisFacts(diagnosed(recorded.lessons[0]!)), {
      movesPlayed: "",
      trigger: null,
    });
    for (const value of [...f.verified_facts, ...f.concepts.map((c) => c.name)]) {
      expect(typeof value).toBe("string");
      expect(value).not.toBe("");
    }
  });

  it("still words the facts of a lesson saved before diagnosis", async () => {
    const { promptFacts } = await import("../src/explain.ts");
    const { facts } = await import("@chess-teacher/core");
    const f = promptFacts(facts(featureLesson()), { movesPlayed: "", trigger: null });
    for (const value of [f.key_factor, f.before_your_move, f.end_of_your_line, f.principle.title]) {
      expect(typeof value).toBe("string");
      expect(value).not.toBe("");
    }
  });
});

describe("explanation language", () => {
  const capture = () => {
    const llm = fakeLlm();
    const seen: { system?: string } = {};
    const create = llm.beta.messages.create;
    llm.beta.messages.create = async (b?: unknown) => {
      Object.assign(seen, b);
      return create();
    };
    return { llm, seen };
  };

  it("asks the model to write in the player's locale", async () => {
    const { llm, seen } = capture();
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("una@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const url = `/api/games/${game.id}/lessons/${recorded.lessons[0]!.id}/explanation`;
    await call(url, { method: "POST", cookie, json: { locale: "en-US" } });
    expect(seen.system).toMatch(/American English \(en-US\)/);
  });

  it("tells the model the moves really played since the lesson's move", async () => {
    const { llm, seen } = capture();
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("ola@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const lesson = recorded.lessons[0]!;
    await call(`/api/games/${game.id}/lessons/${lesson.id}/explanation`, {
      method: "POST",
      cookie,
      json: EN_GB,
    });
    const { playedLine, variationSan } = await import("@chess-teacher/core");
    const played = variationSan(lesson.fenBefore, playedLine(recorded, lesson));
    const sent = (seen as { messages?: { content: string }[] }).messages?.[0]?.content ?? "";
    expect(JSON.parse(sent.replace(/^[^{]*/, ""))).toMatchObject({ moves_played_in_the_game: played });
  });

  it("falls back to en-GB for a locale we don't ship", async () => {
    const { llm, seen } = capture();
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("vic@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const url = `/api/games/${game.id}/lessons/${recorded.lessons[0]!.id}/explanation`;
    await call(url, { method: "POST", cookie, json: { locale: "tlh" } });
    expect(seen.system).toMatch(/British English \(en-GB\)/);
  });

  it("explains lessons from games saved before lesson text was data", async () => {
    const llm = fakeLlm();
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("wes@example.com");
    // Version 1 kept details and triggers as English text, and lessons didn't say their source.
    const { trigger, ...lesson } = featureLesson();
    const v1 = {
      ...newSession({ userColour: "w" }),
      moves: ["e2e4", "e7e5", "f1a6", "b8a6"],
      version: 1,
      lessons: [
        {
          ...lesson,
          source: undefined,
          baselineDetail: "material balance +0",
          userDetail: "material balance -3",
          bestDetail: "material balance +0",
          triggerText: trigger ? "You've lost a bishop: you're 3 pawns worse off than before." : "",
        },
      ],
    };
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(v1 as never) })
    ).json();
    const res = await (
      await call(`/api/games/${game.id}/lessons/${lesson.id}/explanation`, {
        method: "POST",
        cookie,
        json: EN_GB,
      })
    ).json();
    expect(res.status).toBe("ready");
  });
});

describe("errors", () => {
  it("are codes, for the client to word in the player's language", async () => {
    const { call, signUp } = await setup();
    const cookie = await signUp("xan@example.com");
    expect(await (await call("/api/me")).json()).toEqual({ error: "not_signed_in" });
    const illegal = { ...newSession({ userColour: "w" }), moves: ["e2e5"] };
    expect(
      await (await call("/api/games", { method: "POST", cookie, json: newGameBody(illegal) })).json(),
    ).toEqual({ error: "illegal_move" });
    expect(
      await (await call("/api/games", { method: "POST", cookie, json: { nonsense: true } })).json(),
    ).toEqual({
      error: "invalid_request",
    });
    expect(await (await call("/api/games/00000000-0000-0000-0000-000000000000", { cookie })).json()).toEqual({
      error: "not_found",
    });
  });
});

describe("structured explanations", () => {
  it("treats a reply that isn't the three-part JSON as an error, and doesn't charge", async () => {
    const llm = fakeLlm();
    (llm as unknown as { parts: unknown }).parts = "just a paragraph";
    const { call, signUp } = await setup({ llm });
    const cookie = await signUp("sal@example.com");
    const game = await (
      await call("/api/games", { method: "POST", cookie, json: newGameBody(recorded) })
    ).json();
    const res = await (
      await call(`/api/games/${game.id}/lessons/${recorded.lessons[0]!.id}/explanation`, {
        method: "POST",
        cookie,
        json: EN_GB,
      })
    ).json();
    expect(res).toEqual({ status: "error", coachedGamesRemaining: 30 });
  });

  it("asks the API for the three-part structure", async () => {
    let body: { output_config?: { format?: { type: string } } } = {};
    const llm = fakeLlm();
    const create = llm.beta.messages.create;
    llm.beta.messages.create = async (b?: unknown) => {
      body = b as typeof body;
      return create();
    };
    const { explainDiagnosis } = await import("../src/explain.ts");
    const { diagnosisFacts } = await import("@chess-teacher/core");
    const r = await explainDiagnosis(
      llm as never,
      "claude-opus-5-5",
      diagnosisFacts(diagnosed(recorded.lessons[0]!)),
      { movesPlayed: "", trigger: null },
      "en-GB",
    );
    expect(body.output_config?.format?.type).toBe("json_schema");
    expect(r.parts?.headline).toBe("Your move left a weakness");
  });
});
