/** Typed calls to the Hono API (same origin: /api). Types come from @chess-teacher/contract. */

import type {
  ApiError,
  ConfigResponse,
  CreateGameBody,
  ExplanationBody,
  ExplanationResponse,
  FeedbackBody,
  GameRecord,
  GameSummary,
  MeResponse,
  PrincipleDetailResponse,
  PrincipleKind,
  ProgressResponse,
  SaveGameBody,
  SaveGameResponse,
} from "@chess-teacher/contract";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ basePath: "/api/auth" });

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiError,
  ) {
    super(body.error || `HTTP ${status}`);
  }
}

async function request<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: "same-origin",
    headers: init.json !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: res.statusText }))) as ApiError;
    throw new HttpError(res.status, body);
  }
  return (await res.json()) as T;
}

export const api = {
  config: () => request<ConfigResponse>("/config"),
  me: () => request<MeResponse>("/me"),
  progress: () => request<ProgressResponse>("/me/progress"),
  principle: (kind: PrincipleKind, id: string) =>
    request<PrincipleDetailResponse>(`/me/progress/${kind}/${encodeURIComponent(id)}`),
  activeGames: () => request<GameSummary[]>("/games?status=active"),
  finishedGames: () => request<GameSummary[]>("/games?status=finished"),
  game: (id: string) => request<GameRecord>(`/games/${id}`),
  createGame: (body: CreateGameBody) => request<GameRecord>("/games", { method: "POST", json: body }),
  saveGame: (id: string, body: SaveGameBody) =>
    request<SaveGameResponse>(`/games/${id}`, { method: "PUT", json: body }),
  explanation: (gameId: string, lessonId: number) =>
    request<ExplanationResponse>(`/games/${gameId}/lessons/${lessonId}/explanation`),
  feedback: (gameId: string, lessonId: number, body: FeedbackBody) =>
    request<{ ok: true }>(`/games/${gameId}/lessons/${lessonId}/feedback`, { method: "PUT", json: body }),
  requestExplanation: (gameId: string, lessonId: number, body: ExplanationBody) =>
    request<ExplanationResponse>(`/games/${gameId}/lessons/${lessonId}/explanation`, {
      method: "POST",
      json: body,
    }),
};
