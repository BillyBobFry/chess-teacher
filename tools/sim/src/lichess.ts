/** Helpers for the scripts that read real Lichess games. */

import { Chess } from "chess.js";
import { MATE_SCORE } from "@chess-teacher/core";

/** Lichess's winning chances, 0–100, from centipawns for the side to move. */
export const winPct = (cp: number): number => {
  const c = Math.abs(cp) >= MATE_SCORE - 500 ? Math.sign(cp) * 1000 : Math.max(-1000, Math.min(1000, cp));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1);
};

/** A game's SAN movetext ("1. e4 e5 2. Nf3 ... 1-0") as UCI moves from the start position. */
export function sanToUci(movetext: string): string[] {
  const chess = new Chess();
  const out: string[] = [];
  for (const tok of movetext.split(" ")) {
    if (/^\d+\.$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok) || tok === "") continue;
    out.push(chess.move(tok).lan);
  }
  return out;
}
