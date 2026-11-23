/**
 * Parsing Stockfish's `eval` breakdown (classical evaluation, Stockfish 11 and earlier):
 *
 *      Term    |    White    |    Black    |    Total
 *              |   MG    EG  |   MG    EG  |   MG    EG
 *     Material |  ----  ---- |  ----  ---- |  0.00  0.00
 *     Mobility | -0.28 -0.14 | -0.10  0.14 | -0.18 -0.28
 *   ...
 *   Total evaluation: -0.04 (white side)
 *
 * Totals are in pawns from White's point of view, split into middlegame (MG) and endgame
 * (EG) parts.
 */

import type { EvalTrace } from "@chess-teacher/core";

const ROW = /^\s*([A-Za-z][A-Za-z ]*?)\s*\|.*\|\s*(-?\d+\.\d+)\s+(-?\d+\.\d+)\s*$/;

export function parseEvalTrace(lines: string[]): EvalTrace | null {
  const terms: EvalTrace["terms"] = {};
  let total: number | null = null;
  for (const line of lines) {
    const m = line.match(ROW);
    if (m && m[1] !== "Total") terms[m[1]!.trim()] = { mg: Number(m[2]), eg: Number(m[3]) };
    const t = line.match(/^Total evaluation:\s*(-?\d+\.\d+)/);
    if (t) total = Number(t[1]);
  }
  if (total === null || Object.keys(terms).length === 0) return null; // e.g. "none (in check)"
  return { terms, total };
}
