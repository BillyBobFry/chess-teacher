import type { GameOutcome } from "@chess-teacher/contract";
import { gameOutcome, type Game, type SessionState } from "@chess-teacher/core";
import { m } from "../paraglide/messages.js";

const OUTCOME: Record<GameOutcome, () => string> = {
  won: m.games_won,
  lost: m.games_lost,
  drawn: m.games_drawn,
  ended: m.games_ended,
};

/** How a game ended, as a fact in a list of games ("Won"). */
export const outcomeText = (outcome: GameOutcome): string => OUTCOME[outcome]();

/** How a finished game ended, in a sentence. */
export function resultText(game: Game, state: SessionState): string {
  switch (gameOutcome(state)) {
    case "won":
      return m.result_won();
    case "lost":
      return state.resigned ? m.result_resigned() : m.result_lost();
    case "drawn":
      return game.chess.isStalemate() ? m.result_stalemate() : m.result_draw();
    case "ended":
      return m.result_ended();
  }
}
