/**
 * The Maia encoding against fixtures recorded from Maia-3's own Python code
 * (tools/maia/record_encoding.py): if these drift, the network sees a different board from
 * the one it was trained on and plays nonsense without any error.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MAIA_MOVES, chooseMaiaMove, encodeMaiaInput, maiaMoveIndex } from "../src/maia.ts";

interface Case {
  name: string;
  positions: string[];
  nonzero: number[];
  moveIndex: Record<string, number>;
}

const cases = JSON.parse(
  readFileSync(new URL("./fixtures/maia-encoding.json", import.meta.url), "utf8"),
) as Case[];

describe("Maia encoding", () => {
  it.each(cases.map((c) => [c.name, c] as const))("encodes %s as Maia does", (_, c) => {
    const tokens = encodeMaiaInput(c.positions);
    const nonzero = [...tokens.keys()].filter((i) => tokens[i] !== 0);
    expect(nonzero).toEqual(c.nonzero);
    for (const [move, index] of Object.entries(c.moveIndex)) {
      expect([move, maiaMoveIndex(move, c.positions.at(-1)?.split(" ")[1] === "b")]).toEqual([move, index]);
    }
  });

  it("plays the legal move the network rates highest", () => {
    const c = cases.find((x) => x.name === "promotion for black");
    const fen = c?.positions.at(-1);
    if (!c || !fen) throw new Error("fixture missing");
    const logits = new Float32Array(MAIA_MOVES).fill(-5);
    // An illegal move rated higher still must not be played.
    logits[0] = 100;
    const promote = c.moveIndex["c2d1n"];
    if (promote === undefined) throw new Error("fixture missing c2d1n");
    logits[promote] = 10;
    expect(chooseMaiaMove(logits, fen, 0)).toBe("c2d1n");
    expect(chooseMaiaMove(logits, fen, 1, () => 0.5)).toBe("c2d1n");
  });
});
