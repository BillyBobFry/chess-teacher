/**
 * Loading and replaying the games recorded by src/record-games.ts. The API test and the web
 * smoke test import it too, so a recorded game is replayed the same way everywhere.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  type Engines,
  type GameEvent,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import type { RecordedGame, RecordedStep } from "../src/recorded-game.ts";

const GAMES = join(import.meta.dirname, "..", "games");

/** One recorded game, by file name (`game-01.json`). */
export const loadGame = (name: string): RecordedGame =>
  JSON.parse(readFileSync(join(GAMES, name), "utf8")) as RecordedGame;

export function loadGames(): { name: string; game: RecordedGame }[] {
  return readdirSync(GAMES)
    .filter((f) => f.startsWith("game-"))
    .sort()
    .map((name) => ({ name, game: loadGame(name) }));
}

/** Fresh replay engines: each recorded result is handed out once. */
export const enginesFor = (g: RecordedGame): Engines => ({
  analyst: new RecordedEngine(g.engineCalls.analyst, "analyst"),
  opponent: new RecordedEngine(g.engineCalls.weak, "opponent"),
});

export const startOf = (g: RecordedGame): SessionState =>
  newSession({ userColour: g.userColour, config: g.config });

/** Play one recorded step. */
export async function step(
  state: SessionState,
  s: RecordedStep,
  engines: Engines,
): Promise<{ state: SessionState; events: GameEvent[] }> {
  if (s.type === "startUserTurn") return startUserTurn(state, engines);
  if (s.type === "userMove") return userMove(state, s.move, engines);
  return opponentMove(state, engines);
}
