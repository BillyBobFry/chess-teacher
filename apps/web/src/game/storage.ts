/**
 * Local persistence for the game in progress (Milestone 2 has no server yet). Storage can
 * be unavailable or throw (private windows, blocked site data), so every access is guarded
 * and the app works without it.
 */

import type { SessionState } from "@chess-teacher/core";

export interface RevealState {
  lessonId: number;
  step: "find" | "explain";
  attempts: number;
  /** Plies the user guessed wrongly. */
  wrong: number[];
}

export interface SavedGame {
  version: 1;
  state: SessionState;
  opponentSkill: number;
  reveal: RevealState | null;
  finished: boolean;
}

const KEY = "chess-teacher/game/v1";

export function loadGame(): SavedGame | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedGame;
    return saved.version === 1 ? saved : null;
  } catch {
    return null;
  }
}

export function saveGame(game: SavedGame | null): void {
  try {
    if (game) localStorage.setItem(KEY, JSON.stringify(game));
    else localStorage.removeItem(KEY);
  } catch {
    // Saving is a convenience here; the game continues without it.
  }
}
