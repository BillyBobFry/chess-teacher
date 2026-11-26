/**
 * A lesson's measured facts, as data.
 *
 * `facts()` is the structured payload an explanation is built from: the app renders it in
 * the player's language, and the server renders it for the LLM (the server sends only
 * this). Nothing here is a sentence.
 */

import { Position, parseSquare } from "./board.ts";
import { nullMoveFen, type Claim, type LineOutcome } from "./claims.ts";
import type { ConceptId, MistakeKind } from "./concepts.ts";
import { Game, sanOf, variationSan, uciParts } from "./game.ts";
import {
  lessonBestSan,
  lessonGap,
  lessonMove,
  lessonMoveNumber,
  lessonUserSan,
  type DiagnosedLesson,
  type FeatureLesson,
  type Lesson,
  type LessonFeature,
  type LessonKind,
} from "./lessons.ts";
import type { PrincipleId } from "./principles.ts";
import type { Detail, Hint, PieceOn, Trigger, Undefended } from "./text.ts";

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

export function facts(l: FeatureLesson): LessonFacts {
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

// --------------------------------------------------------------------------- diagnosed lessons

/** What a claim says, with moves in SAN and pieces named, ready to word. */
export type ClaimFact =
  /** The predicted punishment: the line from after the move, and what it wins. */
  | { kind: "punishment"; line: string; mates: boolean; wins: PieceOn | null }
  /** The better move's line, and what it wins. */
  | { kind: "missed_win"; line: string; mates: boolean; wins: PieceOn | null }
  /** What the opponent threatened before the move, and whether the move left it unanswered. */
  | { kind: "threat"; line: string; mates: boolean; wins: PieceOn | null; ignored: boolean }
  | { kind: "removed_defender"; defender: PieceOn; square: string }
  | { kind: "opened_line"; from: string; attacker: PieceOn; square: string }
  | { kind: "pinned_defender"; defender: PieceOn; square: string }
  | { kind: "pinned_target"; target: PieceOn; behind: PieceOn }
  /** More attackers than defenders on a square; `target` is the piece won there, if any. */
  | {
      kind: "outnumbered";
      target: PieceOn | null;
      side: "yours" | "theirs";
      square: string;
      attackers: number;
      defenders: number;
    }
  /** The opponent's reply attacks a piece, which has to move again. */
  | { kind: "chased"; move: string; target: PieceOn }
  /** The better move attacks a piece, gaining time. */
  | { kind: "gains_time"; move: string; target: PieceOn }
  | { kind: "one_move_threat"; target: PieceOn; reply: string }
  | { kind: "king_in_centre"; king: string }
  | { kind: "shelter_weakened"; pawn: string }
  | { kind: "perpetual" }
  | { kind: "back_rank"; king: string; square: string }
  | { kind: "passed_pawn"; side: "yours" | "theirs"; from: string; to: string }
  | { kind: "rook_seventh"; side: "yours" | "theirs"; square: string }
  | { kind: "pawn_break"; move: string; target: string }
  | { kind: "free_capture"; move: string; took: PieceOn }
  | { kind: "gave_up_king_defender"; piece: PieceOn }
  | { kind: "double_attack"; move: string; targets: PieceOn[] }
  | { kind: "pawn_grab"; square: string }
  | { kind: "neglected_development"; pawn: string; undeveloped: number };

/** A diagnosed lesson's facts: what the app words for the player and the server for the coach. */
export interface DiagnosisFacts {
  move_number: number;
  player_colour: "white" | "black";
  you_played: string;
  better_was: string;
  /** The position before the move (FEN). */
  position: string;
  your_line: string;
  better_line: string;
  mistake: MistakeKind;
  winning_chances_before: number;
  winning_chances_after: number;
  claims: ClaimFact[];
  concept: ConceptId | null;
  secondary_concept: ConceptId | null;
}

/** The piece on a square in the first of `fens` that has one there. */
function pieceIn(fens: string[], square: string): PieceOn {
  for (const fen of fens) {
    const p = new Position(fen).pieceAt(parseSquare(square));
    if (p) return { piece: p.type, square };
  }
  return { piece: "p", square };
}

const after = (fen: string, moves: string[]): string => new Game(fen, moves).fen;

/** Lines in claims are shown up to this many plies. */
const CLAIM_PLIES = 6;

/**
 * A line as the sentence about it needs it: up to `plies`, but always through the capture
 * that wins (the sentence names what it wins) and to the end of a mate.
 */
const shown = (o: LineOutcome, plies: number): string[] =>
  o.mates ? o.line : o.line.slice(0, Math.max(plies, (o.key?.index ?? -1) + 1));

function claimFact(l: DiagnosedLesson, c: Claim): ClaimFact | null {
  const before = l.fenBefore;
  const moved = after(before, [l.userMove]);
  const replied = l.userLine[1] ? after(moved, [l.userLine[1]]) : moved;
  const betterDone = after(before, [l.bestMove]);
  const wins = (o: LineOutcome): PieceOn | null =>
    o.key ? { piece: o.key.took, square: o.key.square } : null;
  switch (c.kind) {
    case "punishment":
      return {
        kind: "punishment",
        line: variationSan(moved, shown(c.outcome, CLAIM_PLIES)),
        mates: c.outcome.mates,
        wins: wins(c.outcome),
      };
    case "missed_win":
      return {
        kind: "missed_win",
        line: variationSan(before, shown(c.outcome, CLAIM_PLIES)),
        mates: c.outcome.mates,
        wins: wins(c.outcome),
      };
    case "threat": {
      const nm = nullMoveFen(before);
      // A threat that wins nothing outright reads as an ordinary move; it's worth saying only
      // when the move left it unanswered.
      if (!nm || (c.wins < 1 && !c.outcome.mates && !c.ignored)) return null;
      return {
        kind: "threat",
        line: variationSan(nm, shown(c.outcome, 4)),
        mates: c.outcome.mates,
        wins: wins(c.outcome),
        ignored: c.ignored,
      };
    }
    case "removed_defender":
      return { kind: "removed_defender", defender: pieceIn([before], c.defender), square: c.square };
    case "opened_line":
      return {
        kind: "opened_line",
        from: c.from,
        attacker: pieceIn([moved, before], c.attacker),
        square: c.square,
      };
    case "pinned_defender":
      return { kind: "pinned_defender", defender: pieceIn([moved, before], c.defender), square: c.square };
    case "pinned_target":
      return {
        kind: "pinned_target",
        target: pieceIn([moved, before], c.square),
        behind: pieceIn([moved, before], c.behind),
      };
    case "count": {
      if (c.attackers <= c.defenders) return null;
      // The piece is the one the line wins there: the user's when punished, theirs when missed.
      const won = l.claims.find(
        (x): x is Extract<Claim, { kind: "punishment" | "missed_win" }> =>
          (x.kind === "punishment" || x.kind === "missed_win") && x.outcome.key?.square === c.square,
      );
      const took = won?.outcome.key?.took;
      return {
        kind: "outnumbered",
        target: took ? { piece: took, square: c.square } : null,
        side: won?.kind === "missed_win" ? "theirs" : "yours",
        square: c.square,
        attackers: c.attackers,
        defenders: c.defenders,
      };
    }
    case "tempo":
      return c.by === "opponent"
        ? { kind: "chased", move: sanOf(moved, c.move), target: pieceIn([replied], c.target) }
        : { kind: "gains_time", move: sanOf(before, c.move), target: pieceIn([betterDone], c.target) };
    case "one_move_threat":
      return { kind: "one_move_threat", target: pieceIn([moved], c.target), reply: sanOf(moved, c.reply) };
    case "king_in_centre":
      return { kind: "king_in_centre", king: c.king };
    case "shelter_weakened":
      return { kind: "shelter_weakened", pawn: c.pawn };
    case "perpetual":
      return { kind: "perpetual" };
    case "back_rank":
      return { kind: "back_rank", king: c.king, square: c.by };
    case "passed_pawn":
      return { kind: "passed_pawn", side: c.side === "user" ? "yours" : "theirs", from: c.from, to: c.to };
    case "rook_seventh":
      return { kind: "rook_seventh", side: c.side === "user" ? "yours" : "theirs", square: c.square };
    case "pawn_break":
      return { kind: "pawn_break", move: sanOf(before, c.move), target: c.target };
    case "free_capture":
      return {
        kind: "free_capture",
        move: sanOf(before, l.bestMove),
        took: { piece: c.took, square: c.square },
      };
    case "gave_up_king_defender":
      return { kind: "gave_up_king_defender", piece: pieceIn([before], c.piece) };
    case "double_attack":
      return {
        kind: "double_attack",
        move: sanOf(before, c.move),
        targets: c.targets.map((t) => pieceIn([betterDone], t)),
      };
    case "pawn_grab":
      return { kind: "pawn_grab", square: c.square };
    case "neglected_development":
      return { kind: "neglected_development", pawn: c.pawn, undeveloped: c.undeveloped };
    case "best_line":
      return null;
  }
}

export function diagnosisFacts(l: DiagnosedLesson): DiagnosisFacts {
  return {
    move_number: lessonMoveNumber(l),
    player_colour: l.userColour === "w" ? "white" : "black",
    you_played: lessonUserSan(l),
    better_was: lessonBestSan(l),
    position: l.fenBefore,
    your_line: lineSan(l, l.userLine),
    better_line: lineSan(l, l.bestLine),
    mistake: l.mistake,
    winning_chances_before: Math.round(l.winBefore),
    winning_chances_after: Math.round(l.winAfter),
    claims: l.claims.map((c) => claimFact(l, c)).filter((c): c is ClaimFact => c !== null),
    concept: l.concept,
    secondary_concept: l.secondary,
  };
}
