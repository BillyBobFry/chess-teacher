/**
 * The player's progress: lessons counted by the principle or concept they teach, across their
 * recent games, and the lessons behind each count. Games are read as saved; only the games a
 * principle's page lists are brought up to date, as that page sends their lessons whole.
 */

import type {
  GameSummary,
  PrincipleDetailResponse,
  PrincipleGame,
  PrincipleKind,
  PrincipleLesson,
  PrincipleProgress,
  ProgressResponse,
} from "@chess-teacher/contract";
import {
  gameOutcome,
  isConceptId,
  isPrincipleId,
  playedLine,
  reviewLessons,
  reviewTree,
  upgradeSession,
  type Lesson,
  type ReviewLine,
  type SavedSessionState,
} from "@chess-teacher/core";
import type { games } from "./db/schema.ts";

type GameRow = typeof games.$inferSelect;

/** Games counted: the most recent ones, so progress reflects how the player plays now. */
export const PROGRESS_GAMES = 50;

/** The lessons a saved game has, as any version saved them. */
const savedLessons = (row: GameRow): Lesson[] => (row.state as { lessons?: Lesson[] }).lessons ?? [];

/** What a lesson teaches, or null when this version of the core doesn't know it. */
function ideaOf(l: Lesson): { kind: PrincipleKind; id: string } | null {
  // A lesson saved before diagnosis has no `source`: it's a feature lesson.
  if (l.source === "diagnosis")
    return l.concept && isConceptId(l.concept) ? { kind: "concept", id: l.concept } : null;
  return isPrincipleId(l.principle) ? { kind: "principle", id: l.principle } : null;
}

/** Whether a principle page can show this kind and id: one the core knows. */
export const isIdea = (kind: string, id: string): kind is PrincipleKind =>
  (kind === "concept" && isConceptId(id)) || (kind === "principle" && isPrincipleId(id));

/** A game for a list: the same in every saved version, so it's read as saved. */
export function summaryOf(row: GameRow): GameSummary {
  const s = row.state as SavedSessionState;
  return {
    id: row.id,
    userColour: s.userColour,
    moves: s.moves.length,
    finished: row.finished,
    outcome: row.finished ? gameOutcome({ ...s, resigned: s.resigned ?? false }) : null,
    lessons: reviewLessons(s).length,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * Lessons counted by what they teach, most common first. Counted as the review lists them:
 * lessons in an earlier try count, but not those taken back before they were shown.
 * `rows` are the player's games, newest first.
 */
export function progressOf(rows: GameRow[]): ProgressResponse {
  const byIdea = new Map<string, PrincipleProgress>();
  let lessons = 0;
  rows.forEach((row, gameIndex) => {
    const seenInGame = new Set<string>();
    for (const l of reviewLessons({ lessons: savedLessons(row) })) {
      const idea = ideaOf(l);
      if (!idea) continue;
      const key = `${idea.kind}:${idea.id}`;
      lessons += 1;
      const p =
        byIdea.get(key) ??
        ({
          ...idea,
          lessons: 0,
          foundYourself: 0,
          revealed: 0,
          fixed: 0,
          recentGames: 0,
        } satisfies PrincipleProgress);
      p.lessons += 1;
      if (l.status === "triggered" && l.foundCause !== null) p.revealed += 1;
      if (l.foundCause === true) p.foundYourself += 1;
      if (l.status === "fixed") p.fixed += 1;
      if (gameIndex < 5 && !seenInGame.has(key)) {
        p.recentGames += 1;
        seenInGame.add(key);
      }
      byIdea.set(key, p);
    }
  });
  return {
    games: rows.length,
    lessons,
    principles: [...byIdea.values()].sort((a, b) => b.lessons - a.lessons),
  };
}

/** A line's lessons in the review's order, each with whether it's on the line the game ended on. */
function* treeLessons(
  line: ReviewLine,
  onGameLine: boolean,
): Generator<{ lesson: Lesson; onGameLine: boolean }> {
  for (const item of line.items) {
    if (item.kind === "lesson") yield { lesson: item.lesson, onGameLine };
    else yield* treeLessons(item.line, false);
  }
}

/**
 * One principle or concept: its counts, as on the progress page, and every lesson behind
 * them, grouped by game (newest first) in the order the game's review lists them.
 */
export function principleDetailOf(rows: GameRow[], kind: PrincipleKind, id: string): PrincipleDetailResponse {
  const matches = (l: Lesson) => {
    const idea = ideaOf(l);
    return idea?.kind === kind && idea.id === id;
  };
  const occurrences: PrincipleGame[] = [];
  for (const row of rows) {
    if (!reviewLessons({ lessons: savedLessons(row) }).some(matches)) continue;
    const state = upgradeSession(row.state as SavedSessionState);
    const lessons: PrincipleLesson[] = [];
    for (const { lesson, onGameLine } of treeLessons(reviewTree(state), true)) {
      if (matches(lesson)) lessons.push({ lesson, played: playedLine(state, lesson), onGameLine });
    }
    occurrences.push({ game: summaryOf(row), lessons });
  }
  return {
    games: rows.length,
    progress: progressOf(rows).principles.find((p) => p.kind === kind && p.id === id) ?? null,
    occurrences,
  };
}
