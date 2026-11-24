import { describe, expect, it } from "vitest";
import {
  Game,
  MATE_SCORE,
  gameOutcome,
  newSession,
  opponentMove,
  pyRound,
  resign,
  settledBalance,
  upgradeSession,
  variationSan,
  type Engine,
  type SavedSessionState,
} from "../src/index.ts";

/** 1. f3 e5 2. g4 Qh4#: Black mates. */
const FOOLS_MATE = ["f2f3", "e7e5", "g2g4", "d8h4"];

describe("pyRound", () => {
  it("rounds like Python's round(), including ties to even", () => {
    expect(pyRound(1.25, 1)).toBe(1.2); // exact tie → even
    expect(pyRound(0.75, 1)).toBe(0.8); // exact tie → even
    expect(pyRound(1.35, 1)).toBe(1.4); // 1.35 is stored slightly above
    expect(pyRound(1.15, 1)).toBe(1.1); // 1.15 is stored slightly below
    expect(pyRound(2.675, 2)).toBe(2.67);
    expect(pyRound(3.1, 1)).toBe(3.1);
  });
});

describe("Game", () => {
  it("ends on fivefold repetition, not threefold", () => {
    const shuffle = ["g1f3", "g8f6", "f3g1", "f6g8"];
    const game = new Game();
    for (let i = 0; i < 2; i++) for (const m of shuffle) game.push(m);
    expect(game.isGameOver()).toBe(false); // threefold: claimable, not automatic
    for (let i = 0; i < 2; i++) for (const m of shuffle) game.push(m);
    expect(game.isGameOver()).toBe(true);
  });
});

describe("variationSan", () => {
  it("formats lines like python-chess", () => {
    const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(variationSan(start, ["e2e4", "e7e5", "g1f3"])).toBe("1. e4 e5 2. Nf3");
    const afterE4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
    expect(variationSan(afterE4, ["e7e5", "g1f3"])).toBe("1...e5 2. Nf3");
  });
});

describe("settledBalance", () => {
  it("resolves a pending recapture", () => {
    // 1. e4 d5 2. exd5: white is a pawn up for a moment, but Qxd5 recaptures.
    const fen = "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2";
    expect(settledBalance(fen, "w")).toBe(0);
    expect(settledBalance(fen, "b")).toBe(0);
  });
});

describe("newSession", () => {
  it("produces plain JSON state", () => {
    const s = newSession({ userColour: "w" });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});

describe("resign", () => {
  it("finishes the game as resigned", () => {
    const s = resign({ ...newSession({ userColour: "w" }), moves: ["e2e4", "e7e5"] });
    expect(s.resigned).toBe(true);
    expect(s.lessons.filter((l) => l.status === "pending")).toEqual([]);
  });

  it("keeps the real result of a game already over by the rules", () => {
    const s = resign({ ...newSession({ userColour: "w" }), moves: FOOLS_MATE });
    expect(s.resigned).toBe(false);
    expect(gameOutcome(s)).toBe("lost");
  });
});

describe("gameOutcome", () => {
  it("reads checkmate from the user's side", () => {
    const mated = { ...newSession({ userColour: "w" }), moves: FOOLS_MATE };
    expect(gameOutcome(mated)).toBe("lost");
    expect(gameOutcome({ ...mated, userColour: "b" })).toBe("won");
  });

  it("counts resigning as a loss, and an unrecorded early stop as ended", () => {
    const early = { ...newSession({ userColour: "w" }), moves: ["e2e4"] };
    expect(gameOutcome(resign(early))).toBe("lost");
    expect(gameOutcome(early)).toBe("ended");
  });
});

describe("opponentMove", () => {
  it("scores the opponent's checkmate as lost, without asking the engine", async () => {
    const engine: Engine = {
      analyse: () => Promise.reject(new Error("a finished game needs no analysis")),
      play: () => Promise.resolve("d8h4"),
    };
    const s = { ...newSession({ userColour: "w" }), moves: FOOLS_MATE.slice(0, 3) };
    const r = await opponentMove(s, { analyst: engine, weak: engine });
    expect(r.state.scores[3]).toBe(-MATE_SCORE);
  });
});

describe("upgradeSession", () => {
  it("gives a version 2 save no evaluations and no resignation", () => {
    const saved: SavedSessionState = { ...newSession({ userColour: "b" }), version: 2, moves: ["e2e4"] };
    delete saved.scores;
    delete saved.resigned;
    const upgraded = upgradeSession(saved);
    expect(upgraded.scores).toEqual([]);
    expect(upgraded.resigned).toBe(false);
    expect(upgraded.version).toBe(3);
  });

  it("drops scores for moves the save no longer has", () => {
    const saved: SavedSessionState = {
      ...newSession({ userColour: "w" }),
      moves: ["e2e4"],
      scores: [20, -15, 30],
    };
    expect(upgradeSession(saved).scores).toEqual([20]);
  });
});
