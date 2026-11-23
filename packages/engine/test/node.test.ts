/** Integration test against a real Stockfish process (skipped if none is installed). */

import { describe, expect, it } from "vitest";
import { NodeUciEngine, findStockfish } from "../src/node.ts";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
let available = true;
try {
  findStockfish();
} catch {
  available = false;
}

describe.skipIf(!available)("NodeUciEngine", () => {
  it("analyses with MultiPV and plays moves", async () => {
    const engine = await NodeUciEngine.start();
    try {
      const cands = await engine.analyse(START, { depth: 8, multipv: 3 });
      expect(cands).toHaveLength(3);
      expect(new Set(cands.map((c) => c.move)).size).toBe(3);
      for (const c of cands) expect(c.pv[0]).toBe(c.move);
      expect(Math.abs(cands[0]!.score)).toBeLessThan(100);

      const mateIn1 = "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1";
      const [best] = await engine.analyse(mateIn1, { depth: 6, multipv: 1 });
      expect(best).toMatchObject({ move: "d1d8", score: 9999 });

      expect(await engine.play(START, { movetimeMs: 20 })).toMatch(/^[a-h][1-8][a-h][1-8]/);
    } finally {
      await engine.close();
    }
  });
});
