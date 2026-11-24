/** Loading the parity fixtures recorded by prototype/record_fixtures.py. */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_CONFIG,
  lessonMove,
  recentUserMoves,
  type Colour,
  type Lesson,
  type SessionState,
  type TeachingConfig,
} from "@chess-teacher/core";
import type { RecordedCall } from "@chess-teacher/engine";
import {
  detailText,
  factsText,
  hintTexts,
  moveLabel,
  templateExplanation,
  triggerText,
} from "../src/prototype-text.ts";

export const FIXTURES = join(import.meta.dirname, "..", "fixtures");

export interface FixtureStep {
  type: "startUserTurn" | "userMove" | "opponentMove";
  move?: string;
  mode?: string;
  events: { kind: string; lessonId: number; text: string }[];
}

export interface FixtureGame {
  game: number;
  userColour: Colour;
  depth: number;
  config: {
    threshold: number;
    stillWinning: number;
    hopeless: number;
    linePlies: number;
    expiryMoves: number;
    causeWindow: number;
    levelUp: boolean;
    easy: boolean;
  };
  steps: FixtureStep[];
  engineCalls: { analyst: RecordedCall[]; weak: RecordedCall[] };
  lessons: Record<string, unknown>[];
  finalFen: string;
}

export function loadGames(): { name: string; game: FixtureGame }[] {
  return readdirSync(FIXTURES)
    .filter((f) => f.startsWith("game-"))
    .sort()
    .map((name) => ({ name, game: JSON.parse(readFileSync(join(FIXTURES, name), "utf8")) as FixtureGame }));
}

export function configOf(g: FixtureGame): TeachingConfig {
  return { ...DEFAULT_CONFIG, ...g.config, analysisDepth: g.depth };
}

const EVENT_KINDS: Record<string, string> = { chance_gone: "chanceGone" };
export const pyEventKind = (k: string): string => EVENT_KINDS[k] ?? k;

/** A TypeScript lesson in the same shape the Python recorder wrote, worded as the prototype did. */
export function lessonAsFixture(state: SessionState, l: Lesson): Record<string, unknown> {
  return {
    id: l.id,
    ply: l.ply,
    fenBefore: l.fenBefore,
    userMove: l.userMove,
    bestMove: l.bestMove,
    bestScore: l.bestScore,
    userScore: l.userScore,
    feature: l.feature,
    principle: l.principle,
    kind: l.kind,
    baseline: l.baseline,
    predicted: l.predicted,
    bestValue: l.bestValue,
    triggerAt: l.triggerAt,
    userLine: l.userLine,
    bestLine: l.bestLine,
    userValues: l.userValues,
    bestValues: l.bestValues,
    divergence: l.divergence,
    baselineDetail: detailText(l.baselineDetail),
    userDetail: detailText(l.userDetail),
    bestDetail: detailText(l.bestDetail),
    hangingAfter: l.hangingAfter,
    status: l.status,
    resolvedPly: l.resolvedPly,
    triggerText: triggerText(l.trigger),
    deferred: l.deferred,
    chanceMove: l.chanceMove,
    label: moveLabel(lessonMove(l)),
    facts: factsText(l),
    hints: hintTexts(l),
    template: templateExplanation(l),
    recentUserMoves: recentUserMoves(state, l).map(([, move]) => moveLabel(move)),
  };
}
