/**
 * The API contract: request and response shapes, defined once. The server validates
 * against these schemas; clients (web now, mobile later) get their types from them.
 */

import { z } from "zod";

const uci = z.string().regex(/^[a-h][1-8][a-h][1-8][qrbn]?$/);

/**
 * A saved game session (core's SessionState). The server checks its shape and that
 * every move is legal; lessons are kept as opaque objects with a size cap, because
 * their contents are the client's analysis, which the server can't verify anyway.
 */
export const SessionStateSchema = z.looseObject({
  version: z.number().int(),
  startFen: z.string().max(120),
  moves: z.array(uci).max(1200),
  userColour: z.enum(["w", "b"]),
  config: z.looseObject({}),
  lessons: z.array(z.looseObject({ id: z.number().int() })).max(400),
  opponentModes: z.array(z.enum(["normal", "levelled"])).max(1200),
  analysis: z.looseObject({ fen: z.string() }).nullable(),
});

export const RevealSchema = z.object({
  lessonId: z.number().int(),
  step: z.enum(["find", "explain"]),
  attempts: z.number().int().min(0),
  wrong: z.array(z.number().int()),
});
export type RevealState = z.infer<typeof RevealSchema>;

const gameFields = {
  state: SessionStateSchema,
  opponentSkill: z.number().int().min(0).max(20),
  reveal: RevealSchema.nullable(),
  finished: z.boolean(),
};

export const CreateGameBody = z.object(gameFields);
export type CreateGameBody = z.infer<typeof CreateGameBody>;

/** Saving requires the version you loaded, so two devices can't overwrite each other. */
export const SaveGameBody = z.object({ ...gameFields, expectedVersion: z.number().int().min(0) });
export type SaveGameBody = z.infer<typeof SaveGameBody>;

export interface GameRecord {
  id: string;
  state: z.infer<typeof SessionStateSchema>;
  stateVersion: number;
  opponentSkill: number;
  reveal: RevealState | null;
  finished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameSummary {
  id: string;
  userColour: "w" | "b";
  moves: number;
  finished: boolean;
  updatedAt: string;
}

export interface SaveGameResponse {
  stateVersion: number;
}

export type ExplanationStatus =
  /** An AI explanation is ready in `text`. */
  | "ready"
  /** Being generated; ask again shortly. */
  | "pending"
  /** No AI explanations on this server (no API key configured). */
  | "unavailable"
  /** The user's monthly allowance is used up. */
  | "quota"
  /** Generated, but failed the guardrail (mentioned something not in the facts). */
  | "rejected"
  | "error";

export interface ExplanationResponse {
  status: ExplanationStatus;
  text?: string;
  /** AI explanations left this month. */
  remaining: number;
}

export interface MeResponse {
  user: { id: string; name: string; email: string };
  explanations: { enabled: boolean; used: number; limit: number; remaining: number };
}

export interface ConfigResponse {
  googleEnabled: boolean;
  llmEnabled: boolean;
}

export interface ApiError {
  error: string;
  /** For 409s: the version currently on the server. */
  stateVersion?: number;
}
