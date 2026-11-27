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
  // `line`: optional, as saves from version 3 and earlier have none.
  lessons: z.array(z.looseObject({ id: z.number().int(), line: z.number().int().optional() })).max(400),
  opponentModes: z.array(z.enum(["normal", "levelled"])).max(1200),
  analysis: z.looseObject({ fen: z.string() }).nullable(),
  // Optional: saves from version 2 and earlier have neither.
  scores: z.array(z.number().int().nullable()).max(1200).optional(),
  resigned: z.boolean().optional(),
  // Optional: saves from version 3 and earlier have neither. Each branch is made by going back
  // past a revealed lesson, which then stays on it, so there are never more branches than lessons.
  line: z.number().int().min(0).optional(),
  branches: z
    .array(
      z.object({
        id: z.number().int().min(0),
        moves: z.array(uci).max(1200),
        // Optional: saves from version 5 and earlier have none.
        scores: z.array(z.number().int().nullable()).max(1200).optional(),
      }),
    )
    .max(400)
    .optional(),
});

export const RevealSchema = z.object({
  lessonId: z.number().int(),
  step: z.enum(["find", "explain"]),
  attempts: z.number().int().min(0),
  wrong: z.array(z.number().int()),
});
export type RevealState = z.infer<typeof RevealSchema>;

/**
 * The opponent's strength: the rating (as on Lichess, whose games Maia learned from) it plays
 * its normal moves at. The range the new-game slider offers, and all the server accepts.
 */
export const OPPONENT_RATING = { min: 600, max: 1800, step: 100, default: 1000 } as const;

const gameFields = {
  state: SessionStateSchema,
  opponentRating: z.number().int().min(OPPONENT_RATING.min).max(OPPONENT_RATING.max),
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
  opponentRating: number;
  reveal: RevealState | null;
  finished: boolean;
  createdAt: string;
  updatedAt: string;
}

/** How a game ended for the player (core's `GameOutcome`); "ended" is an early stop not recorded as resigning. */
export type GameOutcome = "won" | "drawn" | "lost" | "ended";

export interface GameSummary {
  id: string;
  userColour: "w" | "b";
  moves: number;
  finished: boolean;
  /** For a finished game; null while it's being played. */
  outcome: GameOutcome | null;
  /** Lessons the review shows. */
  lessons: number;
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

/** A coach explanation in three parts (shown as a headline and two short paragraphs). */
export interface ExplanationParts {
  headline: string;
  what_it_allowed: string;
  why_better: string;
  /** The concept the coach chose for a diagnosed lesson (a core `ConceptId`). */
  concept?: string;
}

export interface ExplanationResponse {
  status: ExplanationStatus;
  /** Structured explanation (current prompt). */
  parts?: ExplanationParts;
  /** Plain-text explanation (stored before structured explanations). */
  text?: string;
  /** Coached games left this month (D13). */
  coachedGamesRemaining: number;
  /**
   * On a failed explanation ("error" or "rejected"): whether asking again (POST) writes it
   * again. False once it has failed too many times; the facts then stand alone.
   */
  canRetry?: boolean;
}

export interface MeResponse {
  user: { id: string; name: string; email: string };
  /** The monthly allowance of coached games: games with an AI explanation (D13). */
  coachedGames: { enabled: boolean; used: number; limit: number; remaining: number };
}

export interface ConfigResponse {
  googleEnabled: boolean;
  llmEnabled: boolean;
}

/** Shortest password Better Auth accepts (the client says so when one is too short). */
export const PASSWORD_MIN_LENGTH = 8;

/** What went wrong, as a code: the client words it in the player's language. */
export const API_ERROR_CODES = [
  "internal",
  "not_signed_in",
  "invalid_request",
  "game_too_large",
  "illegal_move",
  "not_found",
  "conflict",
  "malformed_lesson",
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiError {
  error: ApiErrorCode;
  /** For 409s: the version currently on the server. */
  stateVersion?: number;
}

/** Asking for an AI explanation: the player's locale, which it's written in (BCP 47, e.g. en-GB). */
export const ExplanationBody = z.object({ locale: z.string().max(35) });
export type ExplanationBody = z.infer<typeof ExplanationBody>;

export const FeedbackBody = z.object({
  rating: z.union([z.literal(1), z.literal(-1)]),
  comment: z.string().max(1000).optional(),
});
export type FeedbackBody = z.infer<typeof FeedbackBody>;

/**
 * Where a principle's id comes from, as `Lesson.source` says: a feature lesson's principle
 * (core `PrincipleId`) or a diagnosed lesson's concept (core `ConceptId`).
 */
export type PrincipleSource = "features" | "diagnosis";

export interface PrincipleProgress {
  source: PrincipleSource;
  /** A principle or concept id from the core; the client shows its title in the player's locale. */
  id: string;
  /** Lessons about this principle across the recent games. */
  lessons: number;
  /** Revealed during a game and the user found the cause themselves. */
  foundYourself: number;
  /** Revealed during a game (found or not). */
  revealed: number;
  /** The user fixed the weakness before it cost them. */
  fixed: number;
  /** Of the games counted, how many of the most recent 5 had a lesson on this. */
  recentGames: number;
}

export interface ProgressResponse {
  /** Games counted (the most recent ones). */
  games: number;
  lessons: number;
  principles: PrincipleProgress[];
}

/** One lesson on a principle's page. */
export interface PrincipleLesson {
  /**
   * The core's `Lesson`, brought up to date by the server. The contract doesn't depend on the
   * core, so only its id is typed here; the client reads it as a `Lesson`, as it reads a
   * saved game's state.
   */
  lesson: { id: number };
  /** The moves really played from the mistake on (core's `playedLine`), for its futures. */
  played: string[];
  /** False for a lesson in an earlier try: a line the player went back from. */
  onGameLine: boolean;
}

/** A game with lessons on a principle, and those lessons in the order its review lists them. */
export interface PrincipleGame {
  game: GameSummary;
  lessons: PrincipleLesson[];
}

/** One principle or concept across the user's recent games, for its own page. */
export interface PrincipleDetailResponse {
  /** Games counted (the most recent ones), as on the progress page. */
  games: number;
  /** Its counts, as on the progress page; null when none of the games counted has a lesson on it. */
  progress: PrincipleProgress | null;
  /** The games with a lesson on it, newest first. */
  occurrences: PrincipleGame[];
}
