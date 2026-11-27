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

/** A token from `splitMoves` in parts: "12...Nf6" is move 12, Black, "Nf6". */
function parseToken(token: string): { number?: number; black: boolean; san: string } | null {
  const parts = /^(?:(\d+)\.(\.\.)?\s?)?(.+)$/.exec(token);
  if (!parts?.[3]) return null;
  const [, number, dots, san] = parts;
  return { number: number === undefined ? undefined : Number(number), black: !!dots, san };
}

const fitsToken = (mv: Move, token: NonNullable<ReturnType<typeof parseToken>>) =>
  withoutCheck(mv.san) === withoutCheck(token.san) &&
  (token.number === undefined ||
    (fullmoveOf(mv.before) === token.number && mv.color === (token.black ? "b" : "w")));

/**
 * The move a token from `splitMoves` names, if exactly one of `candidates` fits it ("12. Bc7"
 * by number, colour and move; "Nxg3" by move alone). Null when it is ambiguous, or a bare
 * square like "d4", which in prose is more often a square than a pawn move, unless it is one
 * of the `named` moves the text is about (a lesson's mistake and better move).
 */
export function findMove(token: string, candidates: Move[], named: Move[]): Move | null {
  const parsed = parseToken(token);
  if (!parsed) return null;
  if (parsed.number === undefined && /^[a-h][1-8][+#]?$/.test(parsed.san)) {
    return named.find((mv) => withoutCheck(mv.san) === withoutCheck(parsed.san)) ?? null;
  }
  const fits = candidates.filter((mv) => fitsToken(mv, parsed));
  // Two lines can share a move from the same position: that's still one move.
  const distinct = new Map(fits.map((mv) => [`${mv.before} ${mv.lan}`, mv]));
  const [only, ...others] = distinct.values();
  return only && others.length === 0 ? only : null;
}

/**
 * Text with its chess moves placed. `moves` is one move, or a line written out in full
 * ("9...Bxg3 10. dxc6 Bxf2+"): moves with only spaces between them, each played from where the
 * one before it left the board. `segments` is how the text wrote them, spaces included.
 */
export type MovePart =
  | { kind: "text"; text: string }
  /** Looks like a move, but no candidate surely fits it. */
  | { kind: "unplaced"; text: string }
  | { kind: "moves"; segments: Segment[]; moves: [Move, ...Move[]] };

/** Split text into plain text and moves, as `findMove` places them, joining lines. */
export function placeMoves(text: string, candidates: Move[], named: Move[]): MovePart[] {
  const parts: MovePart[] = [];
  let run: Extract<MovePart, { kind: "moves" }> | null = null;
  // The spaces after the run's latest move, until the next segment says whether it goes on.
  let gap: Segment | null = null;
  const close = () => {
    if (run) parts.push(run);
    if (gap) parts.push({ kind: "text", text: gap.text });
    run = null;
    gap = null;
  };
  for (const seg of splitMoves(text)) {
    if (!seg.move) {
      if (run && !gap && /^\s+$/.test(seg.text)) {
        gap = seg;
        continue;
      }
      close();
      parts.push({ kind: "text", text: seg.text });
      continue;
    }
    const last: Move | undefined = run?.moves.at(-1);
    const parsed = parseToken(seg.text);
    // From one known position the notation fits at most one move, so no ambiguity here.
    const next =
      run && gap && last && parsed
        ? candidates.find((mv) => mv.before === last.after && fitsToken(mv, parsed))
        : undefined;
    if (run && gap && next) {
      run.segments.push(gap, seg);
      run.moves.push(next);
      gap = null;
      continue;
    }
    close();
    const move = findMove(seg.text, candidates, named);
    if (move) run = { kind: "moves", segments: [seg], moves: [move] };
    else parts.push({ kind: "unplaced", text: seg.text });
  }
  close();
  return parts;
}
