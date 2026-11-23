/**
 * A game in progress, as a state machine over plain, serialisable state.
 *
 * Every function takes a SessionState and returns a new one plus the events it produced.
 * Nothing here holds a live board or engine between calls, so a game can be saved after
 * any step and resumed later on any device (architecture decision D10).
 */

import { Position, type Colour } from "./board.ts";
import type { Candidate, Engines } from "./engine.ts";
import { FEATURES_BY_NAME } from "./features.ts";
import { Game, STANDARD_START, isLegal, plyOf, sanOf } from "./game.ts";
import {
  CONSEQUENCE,
  DEFAULT_CONFIG,
  MISSED_CHANCE,
  consequenceLanded,
  describeConsequence,
  detectMistake,
  lessonGap,
  scoreAfter,
  type Lesson,
  type LessonKind,
  type LessonStatus,
  type TeachingConfig,
} from "./lessons.ts";
import { chooseOpponentMove, type OpponentMode } from "./opponent.ts";
import { verifyLesson } from "./validate.ts";

export const SESSION_STATE_VERSION = 1;

export interface SessionState {
  version: number;
  startFen: string;
  /** UCI moves: the source of truth for the position. */
  moves: string[];
  userColour: Colour;
  config: TeachingConfig;
  lessons: Lesson[];
  opponentModes: OpponentMode[];
  /** Analysis of the current position, if already done (saves re-analysing on resume). */
  analysis: { fen: string; candidates: Candidate[] } | null;
  /** Strategic lessons not taught because the classical evaluation disagreed. */
  unverified?: number;
}

export type GameEventKind = "created" | "warning" | "triggered" | "chanceGone" | "fixed" | "expired";

export interface GameEvent {
  kind: GameEventKind;
  lessonId: number;
  text: string;
}

export interface StepResult {
  state: SessionState;
  events: GameEvent[];
}

export function newSession(opts: {
  userColour: Colour;
  config?: Partial<TeachingConfig>;
  startFen?: string;
}): SessionState {
  return {
    version: SESSION_STATE_VERSION,
    startFen: opts.startFen ?? STANDARD_START,
    moves: [],
    userColour: opts.userColour,
    config: { ...DEFAULT_CONFIG, ...opts.config },
    lessons: [],
    opponentModes: [],
    analysis: null,
  };
}

// ------------------------------------------------------------------ helpers

// JSON round-trip: works on every platform, and keeps the state honest about being serialisable.
const clone = (s: SessionState): SessionState => JSON.parse(JSON.stringify(s)) as SessionState;

export const gameOf = (s: SessionState): Game => new Game(s.startFen, s.moves);

const pending = (s: SessionState, kind?: LessonKind): Lesson[] =>
  s.lessons.filter((l) => l.status === "pending" && (kind === undefined || l.kind === kind));

const resolve = (l: Lesson, status: LessonStatus, game: Game): void => {
  l.status = status;
  l.resolvedPly = game.ply;
};

const event = (kind: GameEventKind, lesson: Lesson, text = ""): GameEvent => ({
  kind,
  lessonId: lesson.id,
  text,
});

/** The lesson the opponent is currently trying to demonstrate (the biggest pending one). */
export function activeLesson(s: SessionState): Lesson | null {
  let best: Lesson | null = null;
  for (const l of pending(s, CONSEQUENCE)) if (!best || lessonGap(l) > lessonGap(best)) best = l;
  return best;
}

async function analysis(s: SessionState, game: Game, engines: Engines): Promise<Candidate[]> {
  if (s.analysis?.fen !== game.fen) {
    const candidates = game.isGameOver()
      ? []
      : await engines.analyst.analyse(game.fen, {
          depth: s.config.analysisDepth,
          multipv: s.config.analysisMultipv,
        });
    s.analysis = { fen: game.fen, candidates };
  }
  return s.analysis.candidates;
}

// ------------------------------------------------------------------ turn flow

/** Call when it's the user's turn. Checks whether missed chances have gone. */
export async function startUserTurn(state: SessionState, engines: Engines): Promise<StepResult> {
  const s = clone(state);
  const game = gameOf(s);
  const events: GameEvent[] = [];
  const cands = await analysis(s, game, engines);
  for (const lesson of pending(s, MISSED_CHANCE)) {
    if (game.ply - lesson.ply > 2 * s.config.expiryMoves) {
      resolve(lesson, "expired", game);
      events.push(event("expired", lesson));
      continue;
    }
    if (lesson.feature === "mate") continue;
    const feat = FEATURES_BY_NAME[lesson.feature];
    let stillThere = false;
    if (cands.length) {
      const line = new Game(game.fen);
      for (const m of cands[0]!.pv.slice(0, s.config.linePlies)) {
        if (!isLegal(line.chess, m)) break;
        line.push(m);
      }
      const nowBest = feat.measure(new Position(line.fen), s.userColour)[0];
      stillThere =
        (nowBest - lesson.predicted) / feat.unit >= 0.5 * ((lesson.bestValue - lesson.predicted) / feat.unit);
    }
    if (stillThere) {
      lesson.chanceMove = cands[0]!.move;
    } else {
      resolve(lesson, "triggered", game);
      lesson.triggerText = "The chance has gone.";
      events.push(event("chanceGone", lesson, lesson.triggerText));
    }
  }
  return { state: s, events };
}

export async function userMove(state: SessionState, move: string, engines: Engines): Promise<StepResult> {
  const s = clone(state);
  const game = gameOf(s);
  if (game.turn !== s.userColour) throw new Error("It is not the user's turn.");
  if (!isLegal(game.chess, move)) throw new Error(`Illegal move: ${move}`);
  const events: GameEvent[] = [];
  const fenBefore = game.fen;
  const cands = await analysis(s, game, engines);

  game.push(move);
  s.moves.push(move);
  const after = game.isGameOver()
    ? []
    : await engines.analyst.analyse(game.fen, { depth: s.config.analysisDepth, multipv: 1 });
  const userScore = scoreAfter(game, after, s.userColour);

  // Did the user fix something before it was punished?
  for (const lesson of pending(s)) {
    if (lesson.kind === CONSEQUENCE && userScore >= lesson.bestScore - Math.floor(s.config.threshold / 2)) {
      resolve(lesson, "fixed", game);
      events.push(event("fixed", lesson));
    } else if (lesson.kind === MISSED_CHANCE && lesson.chanceMove === move) {
      resolve(lesson, "fixed", game);
      events.push(event("fixed", lesson));
    }
  }

  let lesson = detectMistake(s.lessons.length + 1, fenBefore, move, game, cands, after, s.config);
  if (lesson && engines.classical && s.config.verifyStrategic !== false) {
    const verdict = await verifyLesson(lesson, engines.classical);
    if (verdict.reason !== "not a strategic feature") {
      if (verdict.agrees) lesson.verification = verdict.reason;
      else {
        s.unverified = (s.unverified ?? 0) + 1;
        lesson = null;
      }
    }
  }
  if (lesson) {
    // Credit assignment: once a newer mistake affects the same factor, we can no longer
    // tell which move caused what, so the older lesson goes to the review.
    for (const older of pending(s)) if (older.feature === lesson.feature) resolve(older, "superseded", game);
    s.lessons.push(lesson);
    events.push(event("created", lesson));
    if (s.config.easy && lesson.kind === CONSEQUENCE && s.config.levelUp) {
      events.push(event("warning", lesson, "Your opponent has spotted something…"));
    }
  }
  s.analysis = null;
  return { state: s, events };
}

export async function opponentMove(
  state: SessionState,
  engines: Engines,
): Promise<StepResult & { move: string; mode: OpponentMode }> {
  const s = clone(state);
  const game = gameOf(s);
  if (game.turn === s.userColour) throw new Error("It is the user's turn.");
  const active = s.config.levelUp ? activeLesson(s) : null;
  const { move, mode } = await chooseOpponentMove(game, active, engines, s.config);
  game.push(move);
  s.moves.push(move);
  s.opponentModes.push(mode);
  s.analysis = null;
  return { state: s, events: checkConsequences(s, game), move, mode };
}

function checkConsequences(s: SessionState, game: Game): GameEvent[] {
  const events: GameEvent[] = [];
  const landed: Lesson[] = [];
  const byRecency = [...pending(s, CONSEQUENCE)].sort((a, b) => b.ply - a.ply);
  for (const lesson of byRecency) {
    const since = game.ply - lesson.ply;
    if (since < 2) continue; // need at least the opponent's reply
    if (consequenceLanded(lesson, game)) {
      landed.push(lesson);
    } else if (since > 2 * s.config.expiryMoves) {
      resolve(lesson, "expired", game);
      events.push(event("expired", lesson));
    }
  }
  // One lesson at a time: reveal the biggest, defer the rest to the review.
  landed.sort((a, b) => lessonGap(b) - lessonGap(a));
  landed.forEach((lesson, i) => {
    resolve(lesson, "triggered", game);
    lesson.triggerText = describeConsequence(lesson, game);
    lesson.deferred = i > 0;
    events.push(event("triggered", lesson, lesson.triggerText));
  });
  return events;
}

/** Game over: anything still pending becomes "you got away with it". */
export function finish(state: SessionState): SessionState {
  const s = clone(state);
  const game = gameOf(s);
  for (const lesson of pending(s)) resolve(lesson, "expired", game);
  return s;
}

/** Go back to the position before a lesson's mistake. */
export function rewind(state: SessionState, lessonId: number): SessionState {
  const s = clone(state);
  const target = s.lessons.find((l) => l.id === lessonId);
  if (!target) throw new Error(`No lesson ${lessonId}`);
  s.moves = s.moves.slice(0, target.ply - plyOf(s.startFen));
  for (const l of s.lessons) {
    if (l.ply >= target.ply && l !== target && l.status === "pending") l.status = "rewound";
  }
  s.analysis = null;
  return s;
}

/** Record whether the user found the cause in the reveal. */
export function recordFoundCause(state: SessionState, lessonId: number, found: boolean): SessionState {
  const s = clone(state);
  const lesson = s.lessons.find((l) => l.id === lessonId);
  if (lesson) lesson.foundCause = found;
  return s;
}

export const isGameOver = (s: SessionState): boolean => gameOf(s).isGameOver();
export const isUserTurn = (s: SessionState): boolean => gameOf(s).turn === s.userColour;

/** [ply, label] for the user's recent moves, always including the lesson's mistake. */
export function recentUserMoves(s: SessionState, lesson: Lesson): [number, string][] {
  const replay = new Game(s.startFen);
  const out: [number, string][] = [];
  s.moves.forEach((move, i) => {
    if (replay.turn === s.userColour) {
      const fen = replay.fen;
      const number = Number(fen.split(" ")[5]);
      out.push([plyOf(s.startFen) + i, `${number}${s.userColour === "w" ? "." : "..."} ${sanOf(fen, move)}`]);
    }
    replay.push(move);
  });
  const idx = out.findIndex(([p]) => p === lesson.ply);
  let window = out.slice(-s.config.causeWindow);
  if (idx !== -1 && !window.includes(out[idx]!)) {
    const tail = out.slice(idx);
    window = tail.slice(-Math.max(s.config.causeWindow, out.length - idx));
  }
  return window;
}

/** How many of the user's own moves ago the lesson's move was (1 = their last move). */
export function userMovesAgo(s: SessionState, lesson: Lesson): number {
  return Math.max(1, Math.ceil((gameOf(s).ply - lesson.ply) / 2));
}
