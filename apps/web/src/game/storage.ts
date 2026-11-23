/**
 * Saving games to the server. Saves are queued and coalesced: the latest snapshot is what
 * gets saved, one request at a time, each based on the version the previous save returned.
 */

import type { RevealState } from "@chess-teacher/contract";
import type { SessionState } from "@chess-teacher/core";
import { api, HttpError } from "../api/client.ts";
import { m } from "../paraglide/messages.js";

export type { RevealState };

export interface SavedGame {
  version: 1;
  /** Server id (assigned when the game is created). */
  id: string;
  /** The server's version of this game, for conflict detection. */
  stateVersion: number;
  state: SessionState;
  opponentSkill: number;
  reveal: RevealState | null;
  finished: boolean;
}

export async function loadActiveGame(): Promise<SavedGame | null> {
  const [latest] = await api.activeGames();
  if (!latest) return null;
  const g = await api.game(latest.id);
  return {
    version: 1,
    id: g.id,
    stateVersion: g.stateVersion,
    state: g.state as unknown as SessionState,
    opponentSkill: g.opponentSkill,
    reveal: g.reveal,
    finished: g.finished,
  };
}

export async function createGame(
  game: Omit<SavedGame, "id" | "stateVersion" | "version">,
): Promise<SavedGame> {
  const g = await api.createGame({ ...game, state: game.state as never });
  return { ...game, version: 1, id: g.id, stateVersion: g.stateVersion };
}

export class ConflictError extends Error {}

/** Serialises saves for one game and reports conflicts. */
export class Saver {
  private latest: SavedGame | null = null;
  private running: Promise<void> | null = null;

  constructor(
    private version: number,
    /** Called after each successful save with the snapshot that was saved. */
    private readonly onSaved: (saved: SavedGame) => void,
    private readonly onError: (err: Error) => void,
  ) {}

  save(game: SavedGame): void {
    this.latest = game;
    this.running ??= this.drain().finally(() => (this.running = null));
  }

  /** Resolves once everything queued so far has been saved. */
  async flush(): Promise<void> {
    while (this.running) await this.running;
  }

  private async drain(): Promise<void> {
    while (this.latest) {
      const g = this.latest;
      this.latest = null;
      try {
        const r = await api.saveGame(g.id, {
          state: g.state as never,
          opponentSkill: g.opponentSkill,
          reveal: g.reveal,
          finished: g.finished,
          expectedVersion: this.version,
        });
        this.version = r.stateVersion;
        this.onSaved({ ...g, stateVersion: r.stateVersion });
      } catch (err) {
        this.latest = null;
        this.onError(
          err instanceof HttpError && err.status === 409
            ? new ConflictError(m.error_conflict())
            : err instanceof Error
              ? err
              : new Error(String(err)),
        );
        return;
      }
    }
  }
}
