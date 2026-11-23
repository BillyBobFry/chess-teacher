/** The classical-evaluation check on strategic lessons. */

import { describe, expect, it } from "vitest";
import {
  FEATURE_TERMS,
  classicalVerdict,
  lineEndFen,
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  type ClassicalEval,
  type EvalTrace,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import { configOf, loadGames } from "./fixtures.ts";

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

describe("verification in a game", () => {
  // The first recorded game with a strategic lesson, and the step that created it.
  const target = (() => {
    for (const { game } of loadGames()) {
      const lesson = game.lessons.find((l) => l.feature !== "material" && l.feature !== "mate");
      if (!lesson) continue;
      let ply = 0;
      const step = game.steps.findIndex((s) => {
        if (s.type === "startUserTurn") return false;
        const created = s.type === "userMove" && ply === lesson.ply;
        ply += 1;
        return created;
      });
      return { game, lesson, step };
    }
    throw new Error("no strategic lesson in the fixtures");
  })();

  async function stateBefore(): Promise<{
    state: SessionState;
    analyst: RecordedEngine;
    weak: RecordedEngine;
  }> {
    const g = target.game;
    const analyst = new RecordedEngine(g.engineCalls.analyst);
    const weak = new RecordedEngine(g.engineCalls.weak);
    let state = newSession({ userColour: g.userColour, config: configOf(g) });
    for (const step of g.steps.slice(0, target.step)) {
      if (step.type === "startUserTurn") state = (await startUserTurn(state, { analyst, weak })).state;
      else if (step.type === "userMove") state = (await userMove(state, step.move!, { analyst, weak })).state;
      else state = (await opponentMove(state, { analyst, weak })).state;
    }
    return { state, analyst, weak };
  }

  const bestEnd = lineEndFen(target.lesson.fenBefore as string, target.lesson.bestLine as string[]);
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
    const { state, analyst, weak } = await stateBefore();
    const r = await userMove(state, target.game.steps[target.step]!.move!, {
      analyst,
      weak,
      classical: classical(true),
    });
    const lesson = r.state.lessons.at(-1)!;
    expect(lesson.ply).toBe(target.lesson.ply);
    expect(lesson.verification).toMatch(/main reason/);
    expect(r.events.some((e) => e.kind === "created")).toBe(true);
  });

  it("drops the lesson when it doesn't", async () => {
    const { state, analyst, weak } = await stateBefore();
    const before = state.lessons.length;
    const r = await userMove(state, target.game.steps[target.step]!.move!, {
      analyst,
      weak,
      classical: classical(false),
    });
    expect(r.state.lessons.length).toBe(before);
    expect(r.state.unverified).toBe(1);
    expect(r.events.some((e) => e.kind === "created")).toBe(false);
  });
});
