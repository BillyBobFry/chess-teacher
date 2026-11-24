import { Game, fullmoveOf, type Lesson } from "@chess-teacher/core";
import type { Color, Move, PieceSymbol } from "chess.js";
import { m } from "../paraglide/messages.js";

/** Chess moves in running text, e.g. "Nd2", "11...Nh5", "12. Bc7", "exd4", "O-O", "e8=Q+". */
const MOVE =
  /(\d+\.(?:\.\.)?\s?)?(O-O(?:-O)?|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h]x[a-h][1-8]|[a-h][1-8])(=[QRBN])?[+#]?/g;

export type Segment = { text: string; move: boolean };

/** Split text into plain segments and chess moves (whole tokens only). */
export function splitMoves(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(MOVE)) {
    const i = match.index;
    const before = text[i - 1];
    const after = text[i + match[0].length];
    if ((before && /[A-Za-z0-9]/.test(before)) || (after && /[A-Za-z0-9]/.test(after))) continue;
    if (i > last) out.push({ text: text.slice(last, i), move: false });
    out.push({ text: match[0], move: true });
    last = i + match[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), move: false });
  return out;
}

const PIECE: Record<PieceSymbol, () => string> = {
  p: m.piece_pawn,
  n: m.piece_knight,
  b: m.piece_bishop,
  r: m.piece_rook,
  q: m.piece_queen,
  k: m.piece_king,
};

const COLOURED_PIECE: Record<Color, Record<PieceSymbol, () => string>> = {
  w: {
    p: m.piece_white_pawn,
    n: m.piece_white_knight,
    b: m.piece_white_bishop,
    r: m.piece_white_rook,
    q: m.piece_white_queen,
    k: m.piece_white_king,
  },
  b: {
    p: m.piece_black_pawn,
    n: m.piece_black_knight,
    b: m.piece_black_bishop,
    r: m.piece_black_rook,
    q: m.piece_black_queen,
    k: m.piece_black_king,
  },
};

/** A piece with its colour, in words: "white knight". */
export const pieceName = (piece: { color: Color; type: PieceSymbol }): string =>
  COLOURED_PIECE[piece.color][piece.type]();

/** A move in words, for screen readers (UX-106): "knight to f3", "pawn takes knight on d5, check". */
export function spokenMove(move: Move): string {
  const { to: square } = move;
  const piece = PIECE[move.piece]();
  const captured = move.captured && PIECE[move.captured]();
  const promoted = move.promotion && PIECE[move.promotion]();
  const words = move.isKingsideCastle()
    ? m.move_spoken_castle_kingside()
    : move.isQueensideCastle()
      ? m.move_spoken_castle_queenside()
      : promoted && captured
        ? m.move_spoken_capture_promotion({ captured, square, promoted })
        : promoted
          ? m.move_spoken_promotion({ square, promoted })
          : captured
            ? m.move_spoken_capture({ piece, captured, square })
            : m.move_spoken({ piece, square });
  if (move.san.endsWith("#")) return m.move_spoken_checkmate({ move: words });
  if (move.san.endsWith("+")) return m.move_spoken_check({ move: words });
  return words;
}

/** A line of UCI moves played out from a position. */
export function lineMoves(fen: string, line: string[]): Move[] {
  const game = new Game(fen);
  return line.map((uci) => game.push(uci));
}

/** A lesson's mistake and its better move, both from the position before them. */
export function lessonMoves(lesson: Lesson): { yours: Move | undefined; better: Move | undefined } {
  return {
    yours: lineMoves(lesson.fenBefore, [lesson.userMove])[0],
    better: lineMoves(lesson.fenBefore, [lesson.bestMove])[0],
  };
}

const withoutCheck = (san: string) => san.replace(/[+#]$/, "");

/**
 * The move a token from `splitMoves` names, if exactly one of `candidates` fits it ("12. Bc7"
 * by number, colour and move; "Nxg3" by move alone). Null when it is ambiguous, or a bare
 * square like "d4", which in prose is more often a square than a pawn move, unless it is one
 * of the `named` moves the text is about (a lesson's mistake and better move).
 */
export function findMove(token: string, candidates: Move[], named: Move[]): Move | null {
  const parts = /^(?:(\d+)\.(\.\.)?\s?)?(.+)$/.exec(token);
  if (!parts?.[3]) return null;
  const [, number, dots, san] = parts;
  if (number === undefined && /^[a-h][1-8][+#]?$/.test(san)) {
    return named.find((mv) => withoutCheck(mv.san) === withoutCheck(san)) ?? null;
  }
  const fits = candidates.filter(
    (mv) =>
      withoutCheck(mv.san) === withoutCheck(san) &&
      (number === undefined || (fullmoveOf(mv.before) === Number(number) && mv.color === (dots ? "b" : "w"))),
  );
  // Two lines can share a move from the same position: that's still one move.
  const distinct = new Map(fits.map((mv) => [`${mv.before} ${mv.lan}`, mv]));
  const [only, ...others] = distinct.values();
  return only && others.length === 0 ? only : null;
}
