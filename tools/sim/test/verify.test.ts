/**
 * The classical-evaluation check on strategic feature lessons. Games no longer run it: their
 * lessons come from `diagnose`, whose probes replace it.
 */

import { describe, expect, it } from "vitest";
import { classicalVerdict, type EvalTrace } from "@chess-teacher/core";

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
