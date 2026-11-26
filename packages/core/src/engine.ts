/** What the teaching core needs from a chess engine. Adapters live in @chess-teacher/engine. */

export const MATE_SCORE = 10_000;

/** A score at least this close to `MATE_SCORE` is a forced mate, not a material count. */
const MATE_BAND = 300;

/**
 * A score as a player would read it, from the side it's scored for: a forced mate in so many of
 * the mating side's moves (0: checkmate on the board), or how many pawns ahead (negative:
 * behind). What to say about it is the app's choice.
 */
export type Balance = { kind: "mate"; moves: number; winning: boolean } | { kind: "pawns"; pawns: number };

export function balanceOf(score: number): Balance {
  if (Math.abs(score) < MATE_SCORE - MATE_BAND) return { kind: "pawns", pawns: score / 100 };
  const plies = MATE_SCORE - Math.abs(score);
  return { kind: "mate", moves: Math.ceil(plies / 2), winning: score > 0 };
}

export interface Candidate {
  /** First move, in UCI notation (e.g. "e2e4", "e7e8q"). */
  move: string;
  /** Centipawns from the point of view of the side to move; mates are ±(MATE_SCORE − plies). */
  score: number;
  /** Principal variation in UCI, starting with `move`. */
  pv: string[];
}

export interface Engine {
  /** Analyse a position. Returns up to `multipv` candidates, best first. */
  analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]>;
  /**
   * Pick a move to play (respecting any strength limit the engine was created with).
   * `history` is the game's positions before `fen`, oldest first: a human-like engine (Maia)
   * reads the last few to see how the position came about; Stockfish ignores it.
   */
  play(fen: string, opts: { movetimeMs: number; history: readonly string[] }): Promise<string>;
}

/** The engines a game needs: full-strength analysis, and a weakened opponent. */
export interface Engines {
  analyst: Engine;
  weak: Engine;
  /** Optional second opinion on strategic lessons (see validate.ts). */
  classical?: ClassicalEval;
}

/** A classical evaluation broken down by term, in pawns from White's point of view. */
export interface EvalTrace {
  /** e.g. "Mobility" → { mg: -0.18, eg: -0.28 } */
  terms: Record<string, { mg: number; eg: number }>;
  total: number;
}

/**
 * An engine with a classical, term-by-term static evaluation (Stockfish 11 and earlier).
 * Used as a second opinion on *why* one line is better than another. Returns null when no
 * breakdown is available (e.g. the side to move is in check).
 */
export interface ClassicalEval {
  evalTrace(fen: string): Promise<EvalTrace | null>;
}
