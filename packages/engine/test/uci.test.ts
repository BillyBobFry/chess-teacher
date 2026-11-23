import { describe, expect, it } from "vitest";
import { AnalysisCollector, parseInfo, scoreValue } from "../src/uci.ts";

describe("parseInfo", () => {
  it("parses a MultiPV line with a centipawn score", () => {
    expect(
      parseInfo("info depth 12 seldepth 18 multipv 2 score cp -35 nodes 1000 nps 1 time 5 pv e7e5 g1f3 b8c6"),
    ).toEqual({ multipv: 2, depth: 12, score: { cp: -35 }, pv: ["e7e5", "g1f3", "b8c6"] });
  });

  it("parses mate scores and bounds", () => {
    expect(parseInfo("info depth 9 score mate -3 upperbound pv h7h6")).toEqual({
      multipv: 1,
      depth: 9,
      score: { mate: -3 },
      pv: ["h7h6"],
    });
  });

  it("ignores info strings", () => {
    expect(parseInfo("info string NNUE evaluation using nn-1234.nnue")).toBeNull();
  });
});

describe("scoreValue", () => {
  it("matches python-chess's mate_score convention", () => {
    expect(scoreValue({ cp: 42 })).toBe(42);
    expect(scoreValue({ mate: 3 })).toBe(9997);
    expect(scoreValue({ mate: -2 })).toBe(-9998);
  });
});

describe("AnalysisCollector", () => {
  it("keeps the latest info per line, merging lines without a pv", () => {
    const c = new AnalysisCollector();
    c.add("info depth 1 multipv 1 score cp 10 pv e2e4");
    c.add("info depth 1 multipv 2 score cp 5 pv d2d4");
    c.add("info depth 2 multipv 1 score cp 20 pv g1f3 g8f6");
    c.add("info depth 2 currmove e2e4 currmovenumber 1");
    expect(c.candidates()).toEqual([
      { move: "g1f3", score: 20, pv: ["g1f3", "g8f6"] },
      { move: "d2d4", score: 5, pv: ["d2d4"] },
    ]);
  });
});

describe("parseEvalTrace", () => {
  it("reads Stockfish 11's eval breakdown", async () => {
    const { parseEvalTrace } = await import("../src/eval-trace.ts");
    const trace = parseEvalTrace([
      "     Term    |    White    |    Black    |    Total   ",
      "             |   MG    EG  |   MG    EG  |   MG    EG ",
      " ------------+-------------+-------------+------------",
      "    Material |  ----  ---- |  ----  ---- |  0.00  0.00",
      "    Mobility | -0.28 -0.14 | -0.10  0.14 | -0.18 -0.28",
      " King safety |  0.55 -0.08 |  0.55 -0.08 |  0.00  0.00",
      "       Total |  ----  ---- |  ----  ---- | -0.13 -0.23",
      "",
      "Total evaluation: -0.04 (white side)",
    ]);
    expect(trace).toEqual({
      terms: {
        Material: { mg: 0, eg: 0 },
        Mobility: { mg: -0.18, eg: -0.28 },
        "King safety": { mg: 0, eg: 0 },
      },
      total: -0.04,
    });
    expect(parseEvalTrace(["Total evaluation: none (in check)"])).toBeNull();
  });
});
