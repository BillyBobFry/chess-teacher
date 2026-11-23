/**
 * A game position with its history, built on chess.js.
 *
 * Game-over follows python-chess's automatic rules (checkmate, stalemate, insufficient
 * material, the 75-move rule and fivefold repetition) rather than chess.js's claimable
 * draws (50-move rule, threefold repetition), so that a game ends at the same point as in
 * the prototype. Claimable draws are a UI decision, not a teaching one.
 */

import { Chess, type Move } from "chess.js";
import { Position, type Colour } from "./board.ts";

export const STANDARD_START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export interface UciParts {
  from: string;
  to: string;
  promotion?: string;
}

export const uciParts = (uci: string): UciParts =>
  uci.length > 4
    ? { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }
    : { from: uci.slice(0, 2), to: uci.slice(2, 4) };

const positionKey = (fen: string): string => fen.split(" ").slice(0, 4).join(" ");

/** python-chess's ply count for a FEN: 2 × (fullmove − 1), plus one if black is to move. */
export const plyOf = (fen: string): number => {
  const [, turn, , , , fullmove] = fen.split(" ");
  return 2 * (Number(fullmove ?? 1) - 1) + (turn === "b" ? 1 : 0);
};

export const fullmoveOf = (fen: string): number => Number(fen.split(" ")[5] ?? 1);
export const turnOf = (fen: string): Colour => (fen.split(" ")[1] === "b" ? "b" : "w");

export class Game {
  readonly chess: Chess;
  private readonly keys: string[];

  constructor(
    readonly startFen: string = STANDARD_START,
    moves: readonly string[] = [],
  ) {
    this.chess = new Chess(startFen);
    this.keys = [positionKey(this.chess.fen())];
    for (const m of moves) this.push(m);
  }

  get fen(): string {
    return this.chess.fen();
  }

  get turn(): Colour {
    return this.chess.turn();
  }

  get ply(): number {
    return plyOf(this.fen);
  }

  /** Play a UCI move. Throws if it is illegal. */
  push(uci: string): Move {
    const move = this.chess.move(uciParts(uci));
    this.keys.push(positionKey(this.chess.fen()));
    return move;
  }

  isCheckmate(): boolean {
    return this.chess.isCheckmate();
  }

  isGameOver(): boolean {
    if (this.chess.isCheckmate() || this.chess.isStalemate()) return true;
    const pos = new Position(this.fen);
    if (pos.hasInsufficientMaterial("w") && pos.hasInsufficientMaterial("b")) return true;
    const halfmoves = Number(this.fen.split(" ")[4] ?? 0);
    if (halfmoves >= 150) return true;
    const current = this.keys[this.keys.length - 1];
    return this.keys.filter((k) => k === current).length >= 5;
  }

  /** History of moves in UCI, for display or saving. */
  history(): string[] {
    return this.chess.history({ verbose: true }).map((m) => m.lan);
  }
}

/** Whether a UCI move is legal in the position. */
export function isLegal(chess: Chess, uci: string): boolean {
  return chess.moves({ verbose: true }).some((m) => m.lan === uci);
}

/** SAN of a UCI move from a position. */
export function sanOf(fen: string, uci: string): string {
  return new Chess(fen).move(uciParts(uci)).san;
}

/** A line of moves in SAN with move numbers, formatted like python-chess's variation_san. */
export function variationSan(fen: string, line: readonly string[]): string {
  const chess = new Chess(fen);
  const out: string[] = [];
  for (const uci of line) {
    const number = fullmoveOf(chess.fen());
    const white = chess.turn() === "w";
    const san = chess.move(uciParts(uci)).san;
    if (white) out.push(`${number}. ${san}`);
    else if (out.length === 0) out.push(`${number}...${san}`);
    else out.push(san);
  }
  return out.join(" ");
}

/** The legal prefix of a principal variation (engines occasionally return stale moves). */
export function cleanLine(fen: string, moves: readonly string[], plies: number): string[] {
  const chess = new Chess(fen);
  const out: string[] = [];
  for (const m of moves.slice(0, plies)) {
    if (!isLegal(chess, m)) break;
    chess.move(uciParts(m));
    out.push(m);
  }
  return out;
}
