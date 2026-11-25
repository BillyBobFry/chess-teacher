/** The classical-evaluation check on strategic lessons. */

import { describe, expect, it } from "vitest";
import {
  FEATURE_TERMS,
  MATE_FEATURE,
  classicalVerdict,
  lineEndFen,
  userMove,
  type ClassicalEval,
  type Engines,
  type EvalTrace,
  type SessionState,
} from "@chess-teacher/core";
import { enginesFor, loadGames, startOf, step } from "./games.ts";

const MIDDLEGAME = "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 9";
const trace = (terms: Record<string, number>): EvalTrace => ({
  terms: Object.fromEntries(Object.entries(terms).map(([k, v]) => [k, { mg: v, eg: v }])),
  total: 0,
});
const zero = trace({ Mobility: 0, Rooks: 0, "King safety": 0, Pawns: 0 });

describe("classicalVerdict", () => {
  const verdict = (better: Record<string, number>, feature = "open_files" as const, colour = "w" as const) =>
    classicalVerdict(
      feature,
      colour,
      { fen: MIDDLEGAME, trace: zero },
      { fen: MIDDLEGAME, trace: trace(better) },
    );

  it("agrees when the feature's term is the main gain", () => {
    expect(verdict({ Rooks: 0.6, Mobility: 0.2 }).agrees).toBe(true);
  });

  it("rejects a feature whose term barely moves", () => {
    expect(verdict({ Rooks: 0.05, Mobility: 0.6 }).agrees).toBe(false);
  });

  it("rejects a feature dwarfed by another term", () => {
    const v = verdict({ "King safety": 2.2, Rooks: 0.3 });
    expect(v.agrees).toBe(false);
    expect(v.reason).toMatch(/dwarfs/);
  });

  it("reads gains from the user's side", () => {
    // Better for White is worse for Black.
    expect(verdict({ Rooks: 0.6 }, "open_files", "b" as never).agrees).toBe(false);
    expect(verdict({ Rooks: -0.6 }, "open_files", "b" as never).agrees).toBe(true);
  });

  it("can't verify king activity", () => {
    expect(verdict({ "King safety": 1 }, "king_activity" as never).agrees).toBe(false);
  });
});

// The first recorded strategic lesson, and the game and step that created it.
const target = await (async () => {
  for (const { game } of loadGames()) {
    const engines = enginesFor(game);
    let state = startOf(game);
    for (const [i, s] of game.steps.entries()) {
      const r = await step(state, s, engines);
      const created = r.events.find((e) => e.kind === "created");
      const lesson = created && r.state.lessons.find((l) => l.id === created.lessonId);
      if (s.type === "userMove" && lesson && lesson.feature !== "material" && lesson.feature !== MATE_FEATURE)
        return { game, lesson, step: i, move: s.move };
      state = r.state;
    }
  }
  throw new Error("no strategic lesson in the recorded games");
})();

describe("verification in a game", () => {
  async function stateBefore(): Promise<{ state: SessionState; engines: Engines }> {
    const engines = enginesFor(target.game);
    let state = startOf(target.game);
    for (const s of target.game.steps.slice(0, target.step)) state = (await step(state, s, engines)).state;
    return { state, engines };
  }

  const bestEnd = lineEndFen(target.lesson.fenBefore, target.lesson.bestLine);
  const terms = FEATURE_TERMS[target.lesson.feature as keyof typeof FEATURE_TERMS]!;
  const classical = (agree: boolean): ClassicalEval => ({
    // When agreeing: a clear gain on the lesson's own terms at the end of the better line
    // (from the user's side). When not: nothing changes anywhere.
    evalTrace: async (fen) => {
      const v = agree && fen === bestEnd ? (target.game.userColour === "w" ? 1 : -1) : 0;
      return trace(
        Object.fromEntries(
          ["Mobility", "Rooks", "King safety", "Pawns", ...terms].map((t) => [t, terms.includes(t) ? v : 0]),
        ),
      );
    },
  });

  it("keeps the lesson when the classical evaluation agrees", async () => {
    const { state, engines } = await stateBefore();
    const r = await userMove(state, target.move, { ...engines, classical: classical(true) });
    const lesson = r.state.lessons.at(-1)!;
    expect(lesson.ply).toBe(target.lesson.ply);
    expect(lesson.verification).toMatch(/main reason/);
    expect(r.events.some((e) => e.kind === "created")).toBe(true);
  });

  it("drops the lesson when it doesn't", async () => {
    const { state, engines } = await stateBefore();
    const before = state.lessons.length;
    const r = await userMove(state, target.move, { ...engines, classical: classical(false) });
    expect(r.state.lessons.length).toBe(before);
    expect(r.state.unverified).toBe(1);
    expect(r.events.some((e) => e.kind === "created")).toBe(false);
  });
});
