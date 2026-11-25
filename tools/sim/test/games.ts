/** Loading and replaying the games recorded by src/record-games.ts. */

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

export function loadGames(): { name: string; game: RecordedGame }[] {
  return readdirSync(GAMES)
    .filter((f) => f.startsWith("game-"))
    .sort()
    .map((name) => ({ name, game: JSON.parse(readFileSync(join(GAMES, name), "utf8")) as RecordedGame }));
}

/** Fresh replay engines: each recorded result is handed out once. */
export const enginesFor = (g: RecordedGame): Engines => ({
  analyst: new RecordedEngine(g.engineCalls.analyst, "analyst"),
  weak: new RecordedEngine(g.engineCalls.weak, "weak"),
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
