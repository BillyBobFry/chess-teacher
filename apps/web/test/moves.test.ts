import { describe, expect, it } from "vitest";
import { splitMoves } from "../src/lib/moves.ts";

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
