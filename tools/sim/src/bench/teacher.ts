/**
 * What a teacher returns for one benchmark item, whatever its implementation. The scorer
 * only reads this, so the current core and any redesign are graded the same way.
 */

export interface TeacherOutput {
  /** Did the teacher make a lesson from this move? */
  flagged: boolean;
  /** The move the lesson says was better (UCI). */
  better?: string;
  /** "small" when the lesson tells the player the move wasn't serious. */
  severity?: "small" | "normal";
  /** The teacher's own concept ids, main first (mapped to the benchmark vocabulary by the scorer). */
  concepts: string[];
  /** Moves the lesson states as part of its reason (UCI), not just recites in a line. */
  namedMoves: string[];
  /** Squares the lesson names as lost, attacked or won. */
  namedSquares: string[];
  /** What the lesson says is won or lost: piece letters, or "mate". */
  namedWins: string[];
  /** Tactical motifs the lesson names (Lichess tag names: fork, pin, backRankMate...). */
  motifs: string[];
  /** The text a player would see without the LLM. */
  text: string;
}

export interface BenchItemInput {
  id: string;
  fen: string;
  moves_before: string[];
  played: string;
  mover: "w" | "b";
}

export interface Teacher {
  name: string;
  teach(item: BenchItemInput): Promise<TeacherOutput>;
  close(): Promise<void>;
}
