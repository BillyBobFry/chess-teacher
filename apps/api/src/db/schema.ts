/**
 * Database schema. The first four tables are Better Auth's (names and columns as it
 * expects); the rest are the app's.
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  doublePrecision,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------- Better Auth

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------------------------------------------------------------- app

/** One row per game; `state` is the core's SessionState as JSON (architecture D10). */
export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    state: jsonb("state").notNull(),
    stateVersion: integer("state_version").notNull().default(1),
    opponentRating: integer("opponent_rating").notNull(),
    reveal: jsonb("reveal"),
    finished: boolean("finished").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("games_user_updated_idx").on(t.userId, t.updatedAt)],
);

/** LLM explanations, one per lesson. Also the record of what each explanation cost. */
export const explanations = pgTable(
  "explanations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id").notNull(),
    status: text("status").notNull(), // pending | ready | rejected | error
    model: text("model"),
    promptVersion: integer("prompt_version").notNull(),
    factsHash: text("facts_hash").notNull(),
    /** The locale the explanation is written in (BCP 47). */
    locale: text("locale").notNull().default("en-GB"),
    text: text("text"),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    costUsd: doublePrecision("cost_usd"),
    error: text("error"),
    /** How many times it has been generated: a failed one is tried again, up to a limit. */
    attempts: integer("attempts").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("explanations_game_lesson_idx").on(t.gameId, t.lessonId)],
);

/**
 * Coached games, the unit of the monthly allowance (D13): a game is coached in a month when
 * its first AI explanation of that month is written. The game id has no foreign key, so
 * deleting a game doesn't give its allowance back.
 */
export const coachedGames = pgTable(
  "coached_games",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    period: text("period").notNull(), // "2026-11"
    gameId: uuid("game_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.period, t.gameId] })],
);

/** "Did this lesson make sense?" ratings, for measuring and improving lesson quality. */
export const lessonFeedback = pgTable(
  "lesson_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id").notNull(),
    /** 1 = made sense, -1 = didn't. */
    rating: integer("rating").notNull(),
    comment: text("comment"),
    /** Copied from the lesson, so ratings can be analysed by feature without unpacking games. */
    feature: text("feature").notNull(),
    principle: text("principle").notNull(),
    kind: text("kind").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("lesson_feedback_game_lesson_idx").on(t.gameId, t.lessonId)],
);
