/** What the teaching core needs from a chess engine. Adapters live in @chess-teacher/engine. */

export const MATE_SCORE = 10_000;

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
  /** Pick a move to play (respecting any strength limit the engine was created with). */
  play(fen: string, opts: { movetimeMs: number }): Promise<string>;
}

/** The two engines a game needs: full-strength analysis, and a weakened opponent. */
export interface Engines {
  analyst: Engine;
  weak: Engine;
}
