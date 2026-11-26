/**
 * Every request to the API goes through TanStack Query: the queries and mutations here, read
 * with `useQuery` and `useMutation` in components, or through `queryClient` in the game loop.
 */

import type { ExplanationResponse, PrincipleKind } from "@chess-teacher/contract";
import {
  MutationObserver,
  QueryClient,
  queryOptions,
  type MutationObserverOptions,
} from "@tanstack/react-query";
import { getLocale } from "../paraglide/runtime.js";
import { api, HttpError } from "./client.ts";

/** A failed request is tried twice more, after 1s and then 2s (TanStack's backoff doubles). */
export const MAX_RETRIES = 2;

/**
 * Retry what might work a second time: the network, the server failing, the coach failing.
 * A 4xx is the request's own fault and fails the same way again.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (error instanceof HttpError) return error.status >= 500 || error.status === 429;
  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry } },
});

/** Runs a mutation outside React (the game loop's saves), through the same client. */
export function runMutation<TData, TVariables>(
  options: MutationObserverOptions<TData, Error, TVariables>,
  variables: TVariables,
): Promise<TData> {
  return new MutationObserver(queryClient, options).mutate(variables);
}

export const configQuery = queryOptions({
  queryKey: ["config"],
  queryFn: api.config,
  // Set when the server starts.
  staleTime: Infinity,
});

export const meQuery = queryOptions({ queryKey: ["me"], queryFn: api.me });

export const progressQuery = queryOptions({ queryKey: ["progress"], queryFn: api.progress });

/** One principle (or concept) and its lessons across the recent games. */
export const principleQuery = (kind: PrincipleKind, id: string) =>
  queryOptions({ queryKey: ["progress", kind, id], queryFn: () => api.principle(kind, id) });

export const finishedGamesQuery = queryOptions({
  queryKey: ["games", { status: "finished" }],
  queryFn: api.finishedGames,
});

export const activeGamesQuery = queryOptions({
  queryKey: ["games", { status: "active" }],
  queryFn: api.activeGames,
});

/** The coach didn't manage it this time, and the server will try again if asked. */
export class ExplanationFailed extends Error {
  constructor(readonly response: ExplanationResponse) {
    super(`explanation ${response.status}`);
  }
}

const POLL_MS = 1500;
/** How long to wait on an explanation another request is writing before trying again. */
const POLLS = 12;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const retryable = (r: ExplanationResponse) =>
  (r.status === "error" || r.status === "rejected") && !!r.canRetry;

/** An answer to show, or a failure to retry: still being written, or failed with tries left. */
function settle(r: ExplanationResponse): ExplanationResponse {
  if (r.status === "pending" || retryable(r)) throw new ExplanationFailed(r);
  return r;
}

/** Asks the coach to write it (or to try again): spends the allowance if it succeeds. */
async function request(gameId: string, lessonId: number): Promise<ExplanationResponse> {
  try {
    // Written in the player's language (UX-41).
    return await api.requestExplanation(gameId, lessonId, { locale: getLocale() });
  } finally {
    void queryClient.invalidateQueries({ queryKey: meQuery.queryKey });
  }
}

/**
 * The reveal and the review share a lesson's explanation, so one written at the reveal is
 * already there in the review. Null: the lesson has none and never will (never revealed).
 */
const explanationKey = (gameId: string, lessonId: number) =>
  ["games", gameId, "lessons", lessonId, "explanation"] as const;

/**
 * At the reveal: the coach's explanation, written now from the saved game (D5), or the one
 * already written. `beforeRequest` waits for the moves since the mistake to be saved.
 */
export function revealExplanationQuery(gameId: string, lessonId: number, beforeRequest: () => Promise<void>) {
  return queryOptions({
    queryKey: explanationKey(gameId, lessonId),
    queryFn: async (): Promise<ExplanationResponse | null> => {
      await beforeRequest();
      let r = await request(gameId, lessonId);
      // Another request is writing it (another tab, or the one made at the reveal).
      for (let i = 0; r.status === "pending" && i < POLLS; i++) {
        await sleep(POLL_MS);
        r = await api.explanation(gameId, lessonId);
      }
      return settle(r);
    },
    // An explanation, once written, doesn't change.
    staleTime: Infinity,
  });
}

/**
 * In the review: only an explanation asked for at the reveal. A lesson that was never revealed
 * gets none, so the review doesn't spend the allowance on lessons the player wasn't shown; one
 * that failed is written again.
 */
export function reviewExplanationQuery(gameId: string, lessonId: number) {
  return queryOptions({
    queryKey: explanationKey(gameId, lessonId),
    queryFn: async (): Promise<ExplanationResponse | null> => {
      const r = await api.explanation(gameId, lessonId);
      // The game is over, so nothing is still writing it: "pending" means never asked for.
      if (r.status === "pending") return null;
      return settle(retryable(r) ? await request(gameId, lessonId) : r);
    },
    staleTime: Infinity,
  });
}

export type ExplanationQuery = ReturnType<typeof revealExplanationQuery>;
