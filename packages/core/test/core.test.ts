import { describe, expect, it } from "vitest";
import {
  Game,
  newSession,
  peekLesson,
  pyRound,
  settledBalance,
  spottedLesson,
  variationSan,
  type Lesson,
} from "../src/index.ts";

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

describe("spottedLesson", () => {
  const lesson = (id: number, gap: number, kind: Lesson["kind"] = "consequence"): Lesson =>
    ({ id, kind, status: "pending", bestScore: gap, userScore: 0 }) as Lesson;

  it("is the biggest pending consequence, in easy mode only", () => {
    const s = newSession({ userColour: "w", config: { easy: true } });
    s.lessons = [lesson(1, 100), lesson(2, 300), lesson(3, 500, "missed_chance")];
    expect(spottedLesson(s)?.id).toBe(2);
    expect(spottedLesson({ ...s, config: { ...s.config, easy: false } })).toBeNull();
    expect(spottedLesson({ ...s, config: { ...s.config, levelUp: false } })).toBeNull();
  });

  it("can be peeked at without changing the original state", () => {
    const s = newSession({ userColour: "w", config: { easy: true } });
    s.lessons = [lesson(1, 100)];
    const peeked = peekLesson(s, 1);
    expect(peeked.lessons[0]!.peeked).toBe(true);
    expect(s.lessons[0]!.peeked).toBeUndefined();
  });
});
