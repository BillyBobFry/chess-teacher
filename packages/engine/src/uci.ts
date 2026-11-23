/**
 * Parsing for the UCI protocol's `info` lines. Platform-independent: used by the Node
 * process adapter now, and by the Web Worker adapter (Stockfish WASM) in the browser later.
 */

import { MATE_SCORE, type Candidate } from "@chess-teacher/core";

export type UciScore = { cp: number } | { mate: number };

export interface InfoLine {
  multipv: number;
  depth?: number;
  score?: UciScore;
  pv?: string[];
}

/** Parse an `info ...` line. Returns null for lines that aren't search info (e.g. `info string`). */
export function parseInfo(line: string): InfoLine | null {
  const tokens = line.trim().split(/\s+/);
  if (tokens[0] !== "info" || tokens[1] === "string") return null;
  const info: InfoLine = { multipv: 1 };
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "multipv") info.multipv = Number(tokens[++i]);
    else if (t === "depth") info.depth = Number(tokens[++i]);
    else if (t === "score") {
      const kind = tokens[++i];
      const value = Number(tokens[++i]);
      info.score = kind === "mate" ? { mate: value } : { cp: value };
      if (tokens[i + 1] === "lowerbound" || tokens[i + 1] === "upperbound") i++;
    } else if (t === "pv") {
      info.pv = tokens.slice(i + 1);
      break;
    }
  }
  return info;
}

/**
 * A score as one number, from the side to move's point of view (python-chess's
 * `score(mate_score=10000)`): mate in n → 10000 − n, mated in n → −10000 + n.
 */
export function scoreValue(score: UciScore): number {
  if ("cp" in score) return Math.max(-MATE_SCORE, Math.min(MATE_SCORE, score.cp));
  const n = score.mate;
  const v = n > 0 ? MATE_SCORE - n : -MATE_SCORE - n;
  return Math.max(-MATE_SCORE, Math.min(MATE_SCORE, v));
}

/** Collects the latest info for each MultiPV line during a search. */
export class AnalysisCollector {
  private readonly lines = new Map<number, InfoLine>();

  add(line: string): void {
    const info = parseInfo(line);
    if (!info) return;
    // Merge, like python-chess: a later line without a score/pv keeps the earlier ones.
    const prev = this.lines.get(info.multipv) ?? { multipv: info.multipv };
    this.lines.set(info.multipv, {
      ...prev,
      ...Object.fromEntries(Object.entries(info).filter(([, v]) => v !== undefined)),
    } as InfoLine);
  }

  /** Candidates in MultiPV order, skipping lines without a score or PV. */
  candidates(): Candidate[] {
    return [...this.lines.values()]
      .sort((a, b) => a.multipv - b.multipv)
      .filter((l) => l.score && l.pv && l.pv.length > 0)
      .map((l) => ({ move: l.pv![0]!, score: scoreValue(l.score!), pv: l.pv! }));
  }
}
