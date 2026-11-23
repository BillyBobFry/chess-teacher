/**
 * Turn a lesson's measured facts into words.
 *
 * `facts()` is the structured payload an LLM is allowed to see (the server sends only
 * this). `templateExplanation()` always works, offline included, and is the fallback
 * whenever an LLM explanation isn't available or fails the guardrail.
 */

import { PIECE_NAMES, Position, parseSquare } from "./board.ts";
import { variationSan, uciParts } from "./game.ts";
import {
  CONSEQUENCE,
  MATE_FEATURE,
  lessonBestSan,
  lessonGap,
  lessonMoveNumber,
  lessonUserSan,
  type Lesson,
} from "./lessons.ts";
import { PRINCIPLES } from "./principles.ts";

const FEATURE_LABELS: Record<string, string> = {
  material: "material",
  development: "development",
  king_safety: "king safety",
  centre: "control of the centre",
  mobility: "piece activity",
  own_pawns: "your pawn structure",
  their_pawns: "your opponent's pawn weaknesses",
  passed_pawns: "passed pawns",
  outposts: "knight outposts",
  open_files: "rooks on open files",
  king_activity: "king activity",
  [MATE_FEATURE]: "king safety",
};

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
  lesson_type: string;
  what_happened_in_the_game: string;
  key_factor: string;
  before_your_move: string;
  end_of_your_line: string;
  end_of_better_line: string;
  lines_diverge_after_ply: number;
  pieces_left_undefended_by_your_move: string[];
  principle: { title: string; explanation: string };
}

export function facts(l: Lesson): LessonFacts {
  const p = PRINCIPLES[l.principle]!;
  const before = new Position(l.fenBefore);
  const to = uciParts(l.userMove).to;
  return {
    move_number: lessonMoveNumber(l),
    player_colour: l.userColour === "w" ? "white" : "black",
    you_played: lessonUserSan(l),
    better_was: lessonBestSan(l),
    your_line: lineSan(l, l.userLine),
    better_line: lineSan(l, l.bestLine),
    evaluation_cost_in_pawns: pyRound(lessonGap(l) / 100, 1),
    lesson_type:
      l.kind === CONSEQUENCE
        ? "something went wrong because of this move"
        : "a better opportunity was missed",
    what_happened_in_the_game: l.triggerText,
    key_factor: FEATURE_LABELS[l.feature]!,
    before_your_move: l.baselineDetail,
    end_of_your_line: l.userDetail,
    end_of_better_line: l.bestDetail,
    lines_diverge_after_ply: l.divergence + 1,
    pieces_left_undefended_by_your_move: [
      ...l.hangingAfter
        .filter((s) => s !== to)
        .map((s) => `${PIECE_NAMES[before.pieceAt(parseSquare(s))?.type ?? "p"]} on ${s}`),
      ...(l.hangingAfter.includes(to) ? [`the piece you moved, now on ${to}`] : []),
    ],
    principle: { title: p.title, explanation: p.text },
  };
}

export function hints(l: Lesson): string[] {
  const before = new Position(l.fenBefore);
  const { from, to } = uciParts(l.userMove);
  const piece = before.pieceAt(parseSquare(from))!;
  const castling = piece.type === "k" && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2;
  return [
    castling ? "It was when you castled." : `It was a ${PIECE_NAMES[piece.type]} move.`,
    `Look at move ${lessonMoveNumber(l)}, when you played ${lessonUserSan(l)}.`,
  ];
}

export function templateExplanation(l: Lesson): string {
  const p = PRINCIPLES[l.principle]!;
  const f = FEATURE_LABELS[l.feature]!;
  const userSan = lessonUserSan(l);
  const bestSan = lessonBestSan(l);
  const lines = [
    `On move ${lessonMoveNumber(l)} you played ${userSan}. ${bestSan} was better.`,
    "",
    `  What you played:  ${lineSan(l, l.userLine)}`,
    `  What was better:  ${lineSan(l, l.bestLine)}`,
    "",
  ];
  if (l.feature === MATE_FEATURE) {
    lines.push("After your move, your opponent had a forced checkmate.");
  } else if (l.kind === CONSEQUENCE) {
    lines.push(`The difference is ${f}. Before your move: ${l.baselineDetail}.`);
    lines.push(`After your line: ${l.userDetail}. After the better line: ${l.bestDetail}.`);
  } else {
    lines.push(`Your move wasn't a disaster, but ${bestSan} would have improved ${f}.`);
    lines.push(`After the better line: ${l.bestDetail}. After yours: ${l.userDetail}.`);
  }
  const undefended = facts(l).pieces_left_undefended_by_your_move;
  if (l.principle === "hanging" && undefended.length) {
    lines.push(`Your move left this undefended: ${undefended.join(", ")}.`);
  }
  lines.push("", `Principle: ${p.title}. ${p.text}`);
  return lines.join("\n");
}
