/**
 * Low-level board helpers: square indexing, attack maps and piece lookups.
 *
 * Squares are numbered a1 = 0 … h8 = 63 (file + 8 × rank). Attack sets are computed
 * from a FEN with simple ray scanning, independent of chess.js, so that the strategic
 * features see exactly the same attackers as the original Python prototype
 * (pinned pieces still attack; sliding pieces stop at the first piece).
 */

export type Colour = "w" | "b";
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface Piece {
  type: PieceType;
  color: Colour;
}

export const VALUES: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
export const PIECE_NAMES: Record<PieceType, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};
export const FILE_NAMES = "abcdefgh";

export const opposite = (c: Colour): Colour => (c === "w" ? "b" : "w");
export const fileOf = (s: number): number => s & 7;
export const rankOf = (s: number): number => s >> 3;
export const square = (file: number, rank: number): number => file + 8 * rank;
export const squareName = (s: number): string => `${FILE_NAMES[fileOf(s)]}${rankOf(s) + 1}`;
export const parseSquare = (name: string): number => name.charCodeAt(0) - 97 + 8 * (Number(name[1]) - 1);

/** Negate without producing −0 (which would compare unequal to 0 in deep equality). */
export const neg = (x: number): number => (x === 0 ? 0 : -x);

const KNIGHT_STEPS = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
] as const;
const KING_STEPS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
] as const;
const ROOK_DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;
const BISHOP_DIRS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

export class Position {
  readonly squares: (Piece | null)[] = new Array(64).fill(null);
  readonly turn: Colour;
  readonly fullmoveNumber: number;
  /** En passant target square, if the FEN gives one. */
  readonly epSquare: number | null;

  constructor(readonly fen: string) {
    const [placement, turn, , ep, , fullmove] = fen.split(" ");
    let rank = 7;
    let file = 0;
    for (const ch of placement!) {
      if (ch === "/") {
        rank -= 1;
        file = 0;
      } else if (/\d/.test(ch)) {
        file += Number(ch);
      } else {
        const color: Colour = ch === ch.toUpperCase() ? "w" : "b";
        this.squares[square(file, rank)] = { type: ch.toLowerCase() as PieceType, color };
        file += 1;
      }
    }
    this.turn = turn === "b" ? "b" : "w";
    this.fullmoveNumber = Number(fullmove ?? 1);
    this.epSquare = ep && ep !== "-" ? parseSquare(ep) : null;
  }

  pieceAt(s: number): Piece | null {
    return this.squares[s] ?? null;
  }

  /** Squares of the given pieces, ascending (a1 → h8). */
  pieces(type: PieceType, color: Colour): number[] {
    const out: number[] = [];
    for (let s = 0; s < 64; s++) {
      const p = this.squares[s];
      if (p && p.type === type && p.color === color) out.push(s);
    }
    return out;
  }

  king(color: Colour): number | null {
    return this.pieces("k", color)[0] ?? null;
  }

  /** Squares attacked by the piece on `s` (empty if no piece). */
  attacks(s: number): number[] {
    return attacksFrom(this.squares, s);
  }

  /** Squares of `color`'s pieces that attack `target` (ascending). */
  attackers(color: Colour, target: number): number[] {
    return attackersOf(this.squares, color, target);
  }

  /** Insufficient material for `color` to ever checkmate (python-chess rules). */
  hasInsufficientMaterial(color: Colour): boolean {
    const own = this.squares.filter((p): p is Piece => !!p && p.color === color);
    if (own.some((p) => p.type === "p" || p.type === "r" || p.type === "q")) return false;
    if (own.some((p) => p.type === "n")) {
      const theirs = this.squares.filter((p) => p && p.color !== color && p.type !== "k" && p.type !== "q");
      return own.length <= 2 && theirs.length === 0;
    }
    if (own.some((p) => p.type === "b")) {
      const bishops: number[] = [];
      for (let s = 0; s < 64; s++) if (this.squares[s]?.type === "b") bishops.push(s);
      const dark = (s: number) => (fileOf(s) + rankOf(s)) % 2 === 0;
      const sameColour = bishops.every(dark) || bishops.every((s) => !dark(s));
      const anyPawnsOrKnights = this.squares.some((p) => p && (p.type === "p" || p.type === "n"));
      return sameColour && !anyPawnsOrKnights;
    }
    return true;
  }
}

// --------------------------------------------------------------------------- attack maps

/** Squares attacked by the piece on `s` of a board (empty if no piece). */
export function attacksFrom(squares: readonly (Piece | null)[], s: number): number[] {
  const p = squares[s];
  if (!p) return [];
  const f = fileOf(s);
  const r = rankOf(s);
  const out: number[] = [];
  const step = (df: number, dr: number) => {
    const nf = f + df;
    const nr = r + dr;
    if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) out.push(square(nf, nr));
  };
  const slide = (dirs: readonly (readonly [number, number])[]) => {
    for (const [df, dr] of dirs) {
      let nf = f + df;
      let nr = r + dr;
      while (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
        const t = square(nf, nr);
        out.push(t);
        if (squares[t]) break;
        nf += df;
        nr += dr;
      }
    }
  };
  switch (p.type) {
    case "p": {
      const dr = p.color === "w" ? 1 : -1;
      step(-1, dr);
      step(1, dr);
      break;
    }
    case "n":
      for (const [df, dr] of KNIGHT_STEPS) step(df, dr);
      break;
    case "k":
      for (const [df, dr] of KING_STEPS) step(df, dr);
      break;
    case "b":
      slide(BISHOP_DIRS);
      break;
    case "r":
      slide(ROOK_DIRS);
      break;
    case "q":
      slide(ROOK_DIRS);
      slide(BISHOP_DIRS);
      break;
  }
  return out;
}

/** Squares of `color`'s pieces that attack `target` (ascending). */
export function attackersOf(squares: readonly (Piece | null)[], color: Colour, target: number): number[] {
  const out: number[] = [];
  for (let s = 0; s < 64; s++) {
    const p = squares[s];
    if (p && p.color === color && attacksFrom(squares, s).includes(target)) out.push(s);
  }
  return out;
}

// --------------------------------------------------------------------------- captures

export interface Capture {
  from: number;
  to: number;
  /** Square of the captured piece (differs from `to` for en passant). */
  victimSquare: number;
  victim: PieceType;
  attacker: PieceType;
  promotion?: PieceType;
}

const PROMOTIONS: PieceType[] = ["q", "r", "b", "n"];

/** Legal captures for the side to move (including en passant and capture-promotions). */
export function legalCaptures(squares: (Piece | null)[], turn: Colour, epSquare: number | null): Capture[] {
  const out: Capture[] = [];
  const enemy = opposite(turn);
  for (let s = 0; s < 64; s++) {
    const p = squares[s];
    if (!p || p.color !== turn) continue;
    for (const t of attacksFrom(squares, s)) {
      const target = squares[t];
      if (target && target.color === enemy && target.type !== "k") {
        const lastRank = p.type === "p" && (rankOf(t) === 7 || rankOf(t) === 0);
        for (const promotion of lastRank ? PROMOTIONS : [undefined]) {
          out.push({
            from: s,
            to: t,
            victimSquare: t,
            victim: target.type,
            attacker: p.type,
            ...(promotion ? { promotion } : {}),
          });
        }
      } else if (p.type === "p" && t === epSquare && !target) {
        const victimSquare = turn === "w" ? t - 8 : t + 8;
        if (squares[victimSquare]?.type === "p") {
          out.push({ from: s, to: t, victimSquare, victim: "p", attacker: "p" });
        }
      }
    }
  }
  return out.filter((c) => {
    const undo = makeCapture(squares, c);
    const king = squares.findIndex((q) => q?.type === "k" && q.color === turn);
    const legal = king === -1 || attackersOf(squares, enemy, king).length === 0;
    undo();
    return legal;
  });
}

/** Play a capture on a board in place; returns a function that undoes it. */
export function makeCapture(squares: (Piece | null)[], c: Capture): () => void {
  const mover = squares[c.from]!;
  const victim = squares[c.victimSquare]!;
  squares[c.victimSquare] = null;
  squares[c.to] = c.promotion ? { type: c.promotion, color: mover.color } : mover;
  squares[c.from] = null;
  return () => {
    squares[c.from] = mover;
    squares[c.to] = null;
    squares[c.victimSquare] = victim;
  };
}
