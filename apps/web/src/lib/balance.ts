import { balanceOf } from "@chess-teacher/core";
import { m } from "../paraglide/messages.js";

/**
 * The engine's evaluation of a position in words, from the player's side: "You're about a pawn
 * behind". Whoever shows it says it's the engine's (UX-103).
 */
export function balanceText(score: number | null): string {
  if (score === null) return m.balance_unknown();
  const balance = balanceOf(score);
  if (balance.kind === "mate") {
    if (balance.moves === 0) return balance.winning ? m.balance_checkmate_won() : m.balance_checkmate_lost();
    return (balance.winning ? m.balance_mate_for : m.balance_mate_against)({ count: balance.moves });
  }
  const pawns = Math.round(Math.abs(balance.pawns));
  if (pawns === 0) return m.balance_even();
  return (balance.pawns > 0 ? m.balance_ahead : m.balance_behind)({ count: pawns });
}

/**
 * A score as a height from -1 (the opponent is winning) to 1 (the player is): a pawn or two
 * reads clearly, a won position doesn't flatten the rest of the game, and a forced mate sits at
 * the edge.
 */
export function balanceHeight(score: number): number {
  const balance = balanceOf(score);
  if (balance.kind === "mate") return balance.winning ? 1 : -1;
  return 0.9 * Math.tanh(balance.pawns / 3);
}
