/**
 * An engine that replays recorded output. Stockfish's results vary from run to run, so
 * tests replay what the Python prototype's engine actually returned; any difference in
 * lessons is then down to the teaching code, not the engine.
 */

import type { Candidate, Engine } from "@chess-teacher/core";

export type RecordedCall =
  | { op: "analyse"; fen: string; multipv: number; depth: number; result: Candidate[] }
  | { op: "play"; fen: string; movetimeMs: number; result: string };

export class RecordedEngine implements Engine {
  private readonly analyses = new Map<string, Candidate[][]>();
  private readonly plays = new Map<string, string[]>();

  constructor(
    calls: RecordedCall[],
    private readonly name = "engine",
  ) {
    for (const c of calls) {
      if (c.op === "analyse") push(this.analyses, `${c.fen}|${c.multipv}|${c.depth}`, c.result);
      else push(this.plays, c.fen, c.result);
    }
  }

  async analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]> {
    const key = `${fen}|${opts.multipv}|${opts.depth}`;
    const result = this.analyses.get(key)?.shift();
    if (!result) throw new Error(`${this.name}: no recorded analysis for ${key}`);
    return structuredCloneSafe(result);
  }

  async play(fen: string): Promise<string> {
    const result = this.plays.get(fen)?.shift();
    if (!result) throw new Error(`${this.name}: no recorded move for ${fen}`);
    return result;
  }

  /** Recorded calls that were never made (should be none after a faithful replay). */
  unused(): number {
    let n = 0;
    for (const v of this.analyses.values()) n += v.length;
    for (const v of this.plays.values()) n += v.length;
    return n;
  }
}

function push<T>(map: Map<string, T[]>, key: string, value: T): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

const structuredCloneSafe = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
