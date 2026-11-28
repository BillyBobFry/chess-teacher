/**
 * Maia-3 (CSSLab, github.com/CSSLab/maia3, AGPL-3.0): a network trained on Lichess games to
 * play the move a human of a given rating would play. It makes one prediction per move,
 * without searching. This file is the platform-independent half: turning a game into the
 * network's input, and its output into a move. Running the network is the caller's, through
 * `MaiaNetwork` (ONNX Runtime in a Web Worker on the web).
 *
 * The encoding mirrors maia3/dataset.py and maia3/uci.py; test/maia.test.ts checks it
 * against fixtures recorded from that code (tools/maia).
 */

import { Game, turnOf, type Candidate, type Engine } from "@chess-teacher/core";

/** Positions the network sees: the current one and up to seven before it. */
export const MAIA_HISTORY = 8;
const PLANES = 12;
/** Input features per square: 12 piece planes for each position in the history. */
export const MAIA_FEATURES = MAIA_HISTORY * PLANES;
/** Output size: every from-to square pair, then 8 × 8 × 4 promotions. */
export const MAIA_MOVES = 64 * 64 + 8 * 8 * 4;

const PIECES = "pnbrqk";
const PROMOTIONS = "qrbn";

export interface MaiaNetwork {
  /**
   * Move logits (`MAIA_MOVES` of them) for one position. `tokens` comes from
   * `encodeMaiaInput`: 64 squares × `MAIA_FEATURES`.
   */
  run(tokens: Float32Array, selfElo: number, oppoElo: number): Promise<Float32Array>;
  /** Stop the network. Its owner's call: engines at different ratings share one network. */
  close(): void;
}

/**
 * The network sees every position from the side to move's point of view: when Black is to
 * move the board is flipped top to bottom and the colours swapped, so "own pieces" are
 * always planes 0–5 and own pawns always move up the board.
 */
function addPosition(fen: string, out: Float32Array, frame: number): void {
  const [placement = "", turn] = fen.split(" ");
  const flip = turn === "b";
  let rank = 7;
  let file = 0;
  for (const ch of placement) {
    if (ch === "/") {
      rank -= 1;
      file = 0;
    } else if (ch >= "1" && ch <= "8") {
      file += Number(ch);
    } else {
      const lower = ch.toLowerCase();
      const own = (ch !== lower) !== flip;
      const square = (flip ? 7 - rank : rank) * 8 + file;
      out[square * MAIA_FEATURES + frame * PLANES + PIECES.indexOf(lower) + (own ? 0 : 6)] = 1;
      file += 1;
    }
  }
}

/**
 * The network's input for the last position in `positions` (FENs, oldest first). Uses the
 * last `MAIA_HISTORY` of them; a shorter history is padded at the front with its oldest
 * position, as Maia does early in a game.
 */
export function encodeMaiaInput(positions: readonly string[]): Float32Array {
  const recent = positions.slice(-MAIA_HISTORY);
  const oldest = recent[0];
  if (oldest === undefined) throw new Error("Maia needs at least one position");
  const frames = [...Array<string>(MAIA_HISTORY - recent.length).fill(oldest), ...recent];
  const out = new Float32Array(64 * MAIA_FEATURES);
  frames.forEach((fen, frame) => addPosition(fen, out, frame));
  return out;
}

/** Where a UCI move's logit is, from the side to move's (possibly flipped) point of view. */
export function maiaMoveIndex(uci: string, blackToMove: boolean): number {
  const square = (s: string): number => {
    const rank = Number(s[1]) - 1;
    return (blackToMove ? 7 - rank : rank) * 8 + (s.charCodeAt(0) - 97);
  };
  const from = square(uci.slice(0, 2));
  const to = square(uci.slice(2, 4));
  const promotion = uci[4];
  if (promotion === undefined) return from * 64 + to;
  return 64 * 64 + ((from % 8) * 8 + (to % 8)) * 4 + PROMOTIONS.indexOf(promotion);
}

/**
 * Pick a legal move from the network's logits. Temperature 1 samples from the network's
 * distribution, which is how Maia plays like a person, mistakes included; 0 always plays
 * its most likely move.
 */
export function chooseMaiaMove(
  logits: Float32Array,
  fen: string,
  temperature: number,
  random: () => number = Math.random,
): string {
  const blackToMove = turnOf(fen) === "b";
  const moves = new Game(fen).chess.moves({ verbose: true }).map((m) => m.lan);
  const scored = moves.map((move) => ({
    move,
    logit: logits[maiaMoveIndex(move, blackToMove)] ?? -Infinity,
  }));
  const best = scored.reduce((a, b) => (b.logit > a.logit ? b : a), scored[0] ?? { move: "", logit: 0 });
  if (!best.move) throw new Error(`No legal moves in ${fen}`);
  if (temperature <= 0) return best.move;

  const weights = scored.map((s) => Math.exp((s.logit - best.logit) / temperature));
  let r = random() * weights.reduce((a, b) => a + b, 0);
  for (const [i, w] of weights.entries()) {
    r -= w;
    if (r <= 0) return scored[i]?.move ?? best.move;
  }
  return best.move;
}

export class MaiaEngine implements Engine {
  constructor(
    private readonly network: MaiaNetwork,
    /** The rating Maia plays at, and assumes its opponent has (Lichess ratings). */
    private readonly rating: number,
    private readonly temperature: number,
  ) {}

  analyse(): Promise<Candidate[]> {
    return Promise.reject(new Error("Maia plays moves; it doesn't analyse positions"));
  }

  async play(fen: string, opts: { history: readonly string[] }): Promise<string> {
    const logits = await this.network.run(encodeMaiaInput([...opts.history, fen]), this.rating, this.rating);
    return chooseMaiaMove(logits, fen, this.temperature);
  }
}
