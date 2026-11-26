/**
 * What the core says, as data. The core never writes a sentence: it returns these ids and
 * values, and each app renders them in the player's language (apps/web through its message
 * catalogue). Squares are names ("e4"), pieces are types ("n"), numbers are numbers.
 */

import type { Colour, PieceType } from "./board.ts";
import type { FeatureName } from "./features.ts";

/** A move as the player saw it: "12. Nf3" for white, "12... Nf6" for black. */
export interface MoveRef {
  moveNumber: number;
  colour: Colour;
  san: string;
}

export interface PieceOn {
  piece: PieceType;
  square: string;
}

export interface PieceCount {
  piece: PieceType;
  count: number;
}

/** What a feature measured in one position, from the measured player's point of view. */
export type Detail =
  | { kind: "material"; balance: number }
  | { kind: "opening_over" }
  /** Minor pieces still on their starting squares (none: all developed). */
  | { kind: "undeveloped"; pieces: PieceOn[] }
  | { kind: "queen_gone" }
  | { kind: "king_shelter"; shield: number; attacks: number }
  | { kind: "centre"; mine: number; theirs: number }
  | { kind: "mobility"; mine: number; theirs: number }
  /** Pawn weaknesses of the measured player ("own") or of their opponent ("theirs"). */
  | { kind: "pawns"; side: "own" | "theirs"; isolated: string[]; doubledFiles: string[]; backward: string[] }
  | { kind: "passed_pawns"; mine: string[]; theirs: string[] }
  | { kind: "outposts"; mine: string[]; theirs: string[] }
  | { kind: "open_files"; mine: string[]; theirs: string[] }
  | { kind: "not_endgame" }
  | { kind: "king_activity"; mine: string; mineSteps: number; theirs: string; theirsSteps: number }
  /** For lessons about getting mated. */
  | { kind: "checkmated" }
  | { kind: "no_mate" }
  /** Nothing to say (a king is missing, or the baseline of a mate lesson). */
  | { kind: "none" };

/** What happened in the game when a lesson was triggered. */
export type Trigger =
  | { kind: "checkmated" }
  | { kind: "losing_material" }
  /** Pieces lost and taken since the mistake, the net loss in pawns, and whether more will fall. */
  | { kind: "lost_material"; lost: PieceCount[]; taken: PieceCount[]; net: number; more: boolean }
  /** A strategic factor got worse; `detail` is what it measures now. */
  | { kind: "feature"; feature: FeatureName; detail: Detail }
  | { kind: "chance_gone" }
  /** The opponent carried out the threat the user's move left unanswered. */
  | { kind: "threat_played"; move: MoveRef }
  /** The opponent attacked one of the user's pieces, which has to move again. */
  | { kind: "piece_chased"; move: MoveRef; target: PieceOn }
  /** The opponent checked the user's king while it was still in the centre. */
  | { kind: "king_checked"; move: MoveRef }
  /** The opponent's passed pawn moved on. */
  | { kind: "pawn_advanced"; move: MoveRef }
  /** The opponent's rook reached the user's second rank. */
  | { kind: "rook_invaded"; square: string }
  /** No single event shows the mistake; the opponent's reply is the moment to look. */
  | { kind: "replied"; move: MoveRef }
  /** Games saved before triggers were data, where the position can't be rebuilt (it was rewound). */
  | { kind: "legacy"; text: string };

/** "Find the cause" hints, in the order they're given. */
export type Hint =
  { kind: "castled" } | { kind: "piece"; piece: PieceType } | { kind: "move"; move: MoveRef };

/** A piece the user's move left undefended. `moved` is the piece that just moved. */
export interface Undefended extends PieceOn {
  moved: boolean;
}
