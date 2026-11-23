/**
 * A lesson's measured facts, as data.
 *
 * `facts()` is the structured payload an explanation is built from: the app renders it in
 * the player's language, and the server renders it for the LLM (the server sends only
 * this). Nothing here is a sentence.
 */

import { Position, parseSquare } from "./board.ts";
import { variationSan, uciParts } from "./game.ts";
import {
  lessonBestSan,
  lessonGap,
  lessonMove,
  lessonMoveNumber,
  lessonUserSan,
  type Lesson,
  type LessonFeature,
  type LessonKind,
} from "./lessons.ts";
import type { PrincipleId } from "./principles.ts";
import type { Detail, Hint, Trigger, Undefended } from "./text.ts";

/** Round like Python's round(x, digits): correctly rounded, ties to even. */
export function pyRound(x: number, digits: number): number {
  const exact = Math.abs(x).toPrecision(40); // the double's exact decimal expansion (enough digits)
  if (exact.includes("e")) return Math.round(x * 10 ** digits) / 10 ** digits;
  const [int, frac = ""] = exact.split(".");
  const padded = frac.padEnd(digits + 1, "0");
  const kept = BigInt(`${int}${padded.slice(0, digits)}`);
  const rest = padded.slice(digits);
  const half = rest[0]!;
  const tail = rest.slice(1).replace(/0+$/, "");
  let up = half > "5" || (half === "5" && tail.length > 0);
  if (half === "5" && tail.length === 0) up = kept % 2n === 1n;
  const scaled = kept + (up ? 1n : 0n);
  const value = Number(scaled) / 10 ** digits;
  return x < 0 && value !== 0 ? -value : value;
}

export const lineSan = (l: Lesson, line: string[]): string => variationSan(l.fenBefore, line);

export interface LessonFacts {
  move_number: number;
  player_colour: "white" | "black";
  you_played: string;
  better_was: string;
  your_line: string;
  better_line: string;
  evaluation_cost_in_pawns: number;
  lesson_type: LessonKind;
  what_happened_in_the_game: Trigger | null;
  key_factor: LessonFeature;
  before_your_move: Detail;
  end_of_your_line: Detail;
  end_of_better_line: Detail;
  lines_diverge_after_ply: number;
  /** Pieces left undefended, the piece that moved last. */
  pieces_left_undefended_by_your_move: Undefended[];
  principle: PrincipleId;
}

export function facts(l: Lesson): LessonFacts {
  const before = new Position(l.fenBefore);
  const { from, to } = uciParts(l.userMove);
  const pieceOn = (square: string) => before.pieceAt(parseSquare(square))?.type ?? "p";
  return {
    move_number: lessonMoveNumber(l),
    player_colour: l.userColour === "w" ? "white" : "black",
    you_played: lessonUserSan(l),
    better_was: lessonBestSan(l),
    your_line: lineSan(l, l.userLine),
    better_line: lineSan(l, l.bestLine),
    evaluation_cost_in_pawns: pyRound(lessonGap(l) / 100, 1),
    lesson_type: l.kind,
    what_happened_in_the_game: l.trigger,
    key_factor: l.feature,
    before_your_move: l.baselineDetail,
    end_of_your_line: l.userDetail,
    end_of_better_line: l.bestDetail,
    lines_diverge_after_ply: l.divergence + 1,
    pieces_left_undefended_by_your_move: [
      ...l.hangingAfter
        .filter((s) => s !== to)
        .map((square) => ({ piece: pieceOn(square), square, moved: false })),
      ...(l.hangingAfter.includes(to) ? [{ piece: pieceOn(from), square: to, moved: true }] : []),
    ],
    principle: l.principle,
  };
}

export function hints(l: Lesson): Hint[] {
  const before = new Position(l.fenBefore);
  const { from, to } = uciParts(l.userMove);
  const piece = before.pieceAt(parseSquare(from))?.type ?? "p";
  const castling = piece === "k" && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2;
  return [castling ? { kind: "castled" } : { kind: "piece", piece }, { kind: "move", move: lessonMove(l) }];
}
