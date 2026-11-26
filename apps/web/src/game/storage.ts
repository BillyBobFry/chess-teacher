/**
 * Saving games to the server. Saves are queued and coalesced: the latest snapshot is what
 * gets saved, one request at a time, each based on the version the previous save returned.
 */

import type { RevealState, SaveGameBody } from "@chess-teacher/contract";
import { upgradeSession, type SavedSessionState, type SessionState } from "@chess-teacher/core";
import { queryOptions } from "@tanstack/react-query";
import { api, HttpError } from "../api/client.ts";
import { activeGamesQuery, queryClient, runMutation } from "../api/queries.ts";
import { m } from "../paraglide/messages.js";

export type { RevealState };

export interface SavedGame {
  version: 1;
  /** Server id (assigned when the game is created). */
  id: string;
  /** The server's version of this game, for conflict detection. */
  stateVersion: number;
  state: SessionState;
  opponentRating: number;
  reveal: RevealState | null;
  finished: boolean;
}

/** A game from the player's account, brought up to date. */
export const savedGameQuery = (id: string) =>
  queryOptions({
    queryKey: ["games", id],
    queryFn: async (): Promise<SavedGame> => {
      const g = await api.game(id);
      return {
        version: 1,
        id: g.id,
        stateVersion: g.stateVersion,
        // Games saved by an older version are brought up to date here, once, on load.
        state: upgradeSession(g.state as unknown as SavedSessionState),
        opponentRating: g.opponentRating,
        reveal: g.reveal,
        finished: g.finished,
      };
    },
  });

/** The game in progress, as the server has it now. */
export async function loadActiveGame(): Promise<SavedGame | null> {
  const [latest] = await queryClient.fetchQuery({ ...activeGamesQuery, staleTime: 0 });
  return latest ? queryClient.fetchQuery({ ...savedGameQuery(latest.id), staleTime: 0 }) : null;
}

type NewGame = Omit<SavedGame, "id" | "stateVersion" | "version">;

const createGameMutation = {
  mutationFn: async (game: NewGame): Promise<SavedGame> => {
    const g = await api.createGame({ ...game, state: game.state as never });
    return { ...game, version: 1, id: g.id, stateVersion: g.stateVersion };
  },
};

export const createGame = (game: NewGame) => runMutation(createGameMutation, game);

const saveGame = { mutationFn: ({ id, body }: { id: string; body: SaveGameBody }) => api.saveGame(id, body) };

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
        const r = await runMutation(saveGame, {
          id: g.id,
          body: {
            state: g.state as never,
            opponentRating: g.opponentRating,
            reveal: g.reveal,
            finished: g.finished,
            expectedVersion: this.version,
          },
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
