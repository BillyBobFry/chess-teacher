import { describe, expect, it } from "vitest";
import { findMove, lineMoves, placeMoves, splitMoves } from "../src/lib/moves.ts";

const moves = (text: string) =>
  splitMoves(text)
    .filter((s) => s.move)
    .map((s) => s.text);

describe("splitMoves", () => {
  it("picks out moves in a coach's explanation", () => {
    expect(
      moves(
        "On move 11 you played exd4, about 4 pawns worse than Nd2. After 11...Nh5, in the line 12. Bc7 Nxg3 13. Bxb6 Nxh1, your piece on d4 is undefended. O-O and e8=Q+ too.",
      ),
    ).toEqual(["exd4", "Nd2", "11...Nh5", "12. Bc7", "Nxg3", "13. Bxb6", "Nxh1", "d4", "O-O", "e8=Q+"]);
  });

  it("leaves ordinary words and numbers alone", () => {
    expect(moves("A pawn, 5 pawns down, Bach, a1b2, h9, Queen's side")).toEqual([]);
  });

  it("keeps all the text", () => {
    const text = "Nd2 was better than exd4.";
    expect(
      splitMoves(text)
        .map((s) => s.text)
        .join(""),
    ).toBe(text);
  });
});

describe("findMove", () => {
  const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  // Two lines from the start: 1. e4 e5 2. Nf3, and 1. d4 d5 2. Nf3 Nc6.
  const lines = [
    ...lineMoves(start, ["e2e4", "e7e5", "g1f3"]),
    ...lineMoves(start, ["d2d4", "d7d5", "g1f3", "b8c6"]),
  ];
  const found = (token: string) => findMove(token, lines, [])?.lan ?? null;

  it("finds a move by its number, colour and notation", () => {
    expect(found("1...e5")).toBe("e7e5");
    expect(found("1... e5")).toBe("e7e5");
    expect(found("1. d4")).toBe("d2d4");
  });

  it("finds a move named without a number when only one fits", () => {
    expect(found("Nc6")).toBe("b8c6");
    expect(found("Nc6+")).toBe("b8c6");
  });

  it("takes a bare square as a move only when it is one the text is about", () => {
    const e4 = lines[0]!;
    expect(findMove("e4", lines, [e4])?.lan).toBe("e2e4");
    expect(findMove("d4", lines, [e4])).toBeNull();
  });

  it("finds nothing when unsure", () => {
    expect(found("e4")).toBeNull(); // a bare square
    expect(found("2. Nf3")).toBeNull(); // the same move from two different positions
    expect(found("1. e5")).toBeNull(); // the wrong colour
    expect(found("Nc3")).toBeNull(); // in neither line
  });
});

describe("placeMoves", () => {
  const start = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const lines = [
    ...lineMoves(start, ["e2e4", "e7e5", "g1f3", "b8c6", "f1b5"]),
    ...lineMoves(start, ["d2d4", "d7d5"]),
  ];
  /** Each part as the text it covers, with a line's moves in long notation. */
  const parts = (text: string) =>
    placeMoves(text, lines, []).map((p) =>
      p.kind === "moves"
        ? { text: p.segments.map((s) => s.text).join(""), moves: p.moves.map((mv) => mv.lan) }
        : { [p.kind]: p.text },
    );

  it("joins moves written one after another into one line", () => {
    expect(parts("The engine expects 1...e5 2. Nf3 Nc6 3. Bb5, pinning nothing.")).toEqual([
      { text: "The engine expects " },
      { text: "1...e5 2. Nf3 Nc6 3. Bb5", moves: ["e7e5", "g1f3", "b8c6", "f1b5"] },
      { text: ", pinning nothing." },
    ]);
  });

  it("places a move that only its line makes certain", () => {
    // On its own a bare "d5" is taken as a square; straight after 1. d4 in a line it is 1...d5.
    expect(parts("1. d4 d5")).toEqual([{ text: "1. d4 d5", moves: ["d2d4", "d7d5"] }]);
  });

  it("keeps moves apart when something other than spaces is between them", () => {
    expect(parts("1...e5, then 2. Nf3")).toEqual([
      { text: "1...e5", moves: ["e7e5"] },
      { text: ", then " },
      { text: "2. Nf3", moves: ["g1f3"] },
    ]);
  });

  it("ends a line at a move that doesn't follow on from it", () => {
    expect(parts("1. e4 1. d4 Qh5")).toEqual([
      { text: "1. e4", moves: ["e2e4"] },
      { text: " " },
      { text: "1. d4", moves: ["d2d4"] },
      { text: " " },
      { unplaced: "Qh5" },
    ]);
  });
});
