/**
 * A game in progress, as a state machine over plain, serialisable state.
 *
 * Every function takes a SessionState and returns a new one plus the events it produced.
 * Nothing here holds a live board or engine between calls, so a game can be saved after
 * any step and resumed later on any device (architecture decision D10).
 */

import { Position, opposite, type Colour } from "./board.ts";
import type { Candidate, Engines } from "./engine.ts";
import { FEATURES_BY_NAME, material, settledBalance, type Measurement } from "./features.ts";
import { Game, STANDARD_START, fullmoveOf, isLegal, plyOf, sanOf, turnOf } from "./game.ts";
import {
  CONSEQUENCE,
  DEFAULT_CONFIG,
  MATE_FEATURE,
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
import type { Detail, MoveRef } from "./text.ts";
import { verifyLesson } from "./validate.ts";

/**
 * 2: lessons hold their details and trigger as data, not English text.
 * 3: the evaluation after each move (`scores`), and whether the player resigned.
 * 4: lines of play left behind by going back past a revealed lesson (`line`, `branches`).
 */
export const SESSION_STATE_VERSION = 4;

/**
 * A line of play the game left behind: the player went back to before a lesson they had been
 * shown (a rewind, or undoing that far), and played on differently from there.
 */
export interface Branch {
  /** The line's id, as its lessons hold it in `Lesson.line`. */
  id: number;
  /** All its moves, from the start position (the part it shares with other lines included). */
  moves: string[];
}

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
  /**
   * The engine's evaluation after each move, from the user's side, in centipawns (mates as
   * ±(MATE_SCORE − plies)). Indexed like `moves`; null where the position wasn't analysed.
   * Recorded from analysis the game does anyway, so it costs no extra engine time. It can be
   * shorter than `moves` while a move's analysis is still to come.
   */
  scores: (number | null)[];
  /** The player ended the game before it was over by the rules. */
  resigned: boolean;
  /** The id of the line being played (`moves`), as its lessons hold it in `Lesson.line`. */
  line: number;
  /** Lines left behind, oldest first. */
  branches: Branch[];
}

export type GameEventKind = "created" | "warning" | "triggered" | "chanceGone" | "fixed" | "expired";

/** Something that happened to a lesson. What to say about it is the app's choice. */
export interface GameEvent {
  kind: GameEventKind;
  lessonId: number;
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
    scores: [],
    resigned: false,
    line: 0,
    branches: [],
  };
}

// ------------------------------------------------------------------ helpers

// JSON round-trip: works on every platform, and keeps the state honest about being serialisable.
const clone = (s: SessionState): SessionState => JSON.parse(JSON.stringify(s)) as SessionState;

export const gameOf = (s: Pick<SessionState, "startFen" | "moves">): Game => new Game(s.startFen, s.moves);

const pending = (s: SessionState, kind?: LessonKind): Lesson[] =>
  s.lessons.filter((l) => l.status === "pending" && (kind === undefined || l.kind === kind));

const resolve = (l: Lesson, status: LessonStatus, game: Game): void => {
  l.status = status;
  l.resolvedPly = game.ply;
};

const event = (kind: GameEventKind, lesson: Lesson): GameEvent => ({ kind, lessonId: lesson.id });

/** Record the evaluation (user's side) of the position after the latest move. */
function recordScore(s: SessionState, score: number): void {
  const index = s.moves.length - 1;
  if (index < 0) return;
  while (s.scores.length < index) s.scores.push(null);
  s.scores[index] = score;
}

/**
 * Moves taken back or rewound take their evaluations with them. Call it after updating the
 * lessons' statuses. If a revealed lesson's real moves are among those going, the line is kept
 * as a branch first, so the review can still show what happened, and play goes on as a new
 * line: only the player's going back past a lesson they were shown makes one.
 */
function backTo(s: SessionState, moves: number): void {
  const start = plyOf(s.startFen);
  // The lesson's story (its mistake to its outcome) goes past where play goes back to.
  const pastCut = (l: Lesson) => l.resolvedPly !== null && l.resolvedPly - start > moves;
  const old = s.line;
  if (s.lessons.some((l) => l.line === old && l.status === "triggered" && pastCut(l))) {
    s.branches.push({ id: old, moves: s.moves });
    s.line = Math.max(old, ...s.branches.map((b) => b.id)) + 1;
    // Lessons told entirely before the cut, and those still pending, carry on with the new line.
    for (const l of s.lessons) {
      if (l.line === old && l.status !== "rewound" && (l.status === "pending" || !pastCut(l))) {
        l.line = s.line;
      }
    }
  }
  s.moves = s.moves.slice(0, moves);
  s.scores = s.scores.slice(0, moves);
  s.analysis = null;
}

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
  // Only ever called on the user's turn, so the side to move's score is the user's.
  const best = s.analysis.candidates[0];
  if (best) recordScore(s, best.score);
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
      lesson.trigger = { kind: "chance_gone" };
      events.push(event("chanceGone", lesson));
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
  recordScore(s, userScore);

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

  // A bad move that leaves material to be taken muddies the credit for older material lessons
  // even when it isn't taught itself (in a position already lost, say): whatever falls next
  // may be its fault, so those lessons go to the review.
  const best = cands[0];
  const posAfter = new Position(game.fen);
  const onBoard = material(posAfter, s.userColour) - material(posAfter, opposite(s.userColour));
  if (
    best &&
    best.score - userScore >= s.config.threshold &&
    settledBalance(game.fen, s.userColour) < onBoard - 0.5
  ) {
    for (const older of pending(s, CONSEQUENCE)) {
      if (older.feature === "material") resolve(older, "superseded", game);
    }
  }

  let lesson = detectMistake(s.lessons.length + 1, s.line, fenBefore, move, game, cands, after, s.config);
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
  // Below the normal threshold, a strategic lesson is only trusted once the classical check agrees.
  if (lesson && lesson.verification === undefined && lessonGap(lesson) < s.config.threshold) lesson = null;
  if (lesson) {
    // Credit assignment: once a newer mistake affects the same factor, we can no longer
    // tell which move caused what, so the older lesson goes to the review.
    for (const older of pending(s)) if (older.feature === lesson.feature) resolve(older, "superseded", game);
    s.lessons.push(lesson);
    events.push(event("created", lesson));
    if (s.config.easy && lesson.kind === CONSEQUENCE && s.config.levelUp) {
      events.push(event("warning", lesson));
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
  // A game over needs no engine to score; otherwise the user's next turn analyses it.
  if (game.isGameOver()) recordScore(s, scoreAfter(game, [], s.userColour));
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
    lesson.trigger = describeConsequence(lesson, game);
    lesson.deferred = i > 0;
    events.push(event("triggered", lesson));
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

/**
 * The player ends the game: a loss, then the review. A game already over by the rules (a
 * lesson can open on the move that ends it) keeps its real result.
 */
export function resign(state: SessionState): SessionState {
  const s = finish(state);
  s.resigned = !gameOf(s).isGameOver();
  return s;
}

/** How a finished game ended for the user. */
export type GameOutcome =
  | "won"
  | "drawn"
  | "lost"
  /** Stopped early by a version that didn't record resigning. */
  | "ended";

export function gameOutcome(
  s: Pick<SessionState, "startFen" | "moves" | "userColour" | "resigned">,
): GameOutcome {
  const game = gameOf(s);
  if (game.isCheckmate()) return game.turn === s.userColour ? "lost" : "won";
  if (game.isGameOver()) return "drawn";
  return s.resigned ? "lost" : "ended";
}

/** Go back to the position before a lesson's mistake. */
export function rewind(state: SessionState, lessonId: number): SessionState {
  const s = clone(state);
  const target = s.lessons.find((l) => l.id === lessonId);
  if (!target) throw new Error(`No lesson ${lessonId}`);
  for (const l of s.lessons) {
    if (l.line !== s.line || l === target || l.status === "triggered" || l.status === "rewound") continue;
    if (l.ply >= target.ply) {
      if (l.status === "pending") l.status = "rewound";
    } else if (l.resolvedPly !== null && l.resolvedPly > target.ply) {
      // Fixed, expired or overtaken by moves that are going: it's pending again on the new line.
      l.status = "pending";
      l.resolvedPly = null;
    }
  }
  backTo(s, target.ply - plyOf(s.startFen));
  return s;
}

/** Index in `moves` of the user's latest move, or -1 if they haven't moved yet. */
function lastUserMoveIndex(s: SessionState): number {
  const first = turnOf(s.startFen) === s.userColour ? 0 : 1;
  if (s.moves.length <= first) return -1;
  return first + 2 * Math.floor((s.moves.length - 1 - first) / 2);
}

export const canTakeBack = (s: SessionState): boolean => lastUserMoveIndex(s) >= 0;

/**
 * Take back the user's latest move, and the opponent's reply if it was played, so it's the
 * user's turn in the position before their move. Lessons made by those moves no longer
 * count ("rewound") but stay, so lesson ids stay unique (the server keys explanations by
 * them); lessons those moves fixed, superseded or expired are pending again.
 * Lessons already revealed stay revealed: the player has seen them. Null if the user
 * hasn't moved yet.
 */
export function takeBack(state: SessionState): SessionState | null {
  const index = lastUserMoveIndex(state);
  if (index < 0) return null;
  const s = clone(state);
  const ply = plyOf(s.startFen) + index;
  // Every move taken back after the user's own was an opponent's reply, logged in opponentModes.
  const replies = s.moves.length - index - 1;
  s.opponentModes = s.opponentModes.slice(0, Math.max(0, s.opponentModes.length - replies));
  for (const l of s.lessons) {
    if (l.line !== s.line || l.status === "triggered" || l.status === "rewound") continue;
    if (l.ply >= ply) {
      l.status = "rewound";
    } else if (l.resolvedPly !== null && l.resolvedPly > ply) {
      l.status = "pending";
      l.resolvedPly = null;
    }
  }
  backTo(s, index);
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

/** [ply, move] for the user's recent moves, always including the lesson's mistake. */
export function recentUserMoves(s: SessionState, lesson: Lesson): [number, MoveRef][] {
  const replay = new Game(s.startFen);
  const out: [number, MoveRef][] = [];
  s.moves.forEach((move, i) => {
    if (replay.turn === s.userColour) {
      const fen = replay.fen;
      out.push([
        plyOf(s.startFen) + i,
        { moveNumber: fullmoveOf(fen), colour: s.userColour, san: sanOf(fen, move) },
      ]);
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

/** All the moves of a line of play, from the start position: the current line or a branch. */
export function movesOfLine(s: SessionState, line: number): string[] {
  if (line === s.line) return s.moves;
  const branch = s.branches.find((b) => b.id === line);
  if (!branch) throw new Error(`No line ${line}`);
  return branch.moves;
}

/**
 * The moves actually played from a lesson's mistake (included) up to when it was resolved
 * (revealed, fixed or expired), or up to now if it's still pending. Capped at `maxPlies`.
 * A lesson on a line the game has left behind reads that line's moves.
 */
export function playedLine(s: SessionState, lesson: Lesson, maxPlies = 16): string[] {
  const moves = movesOfLine(s, lesson.line);
  const start = lesson.ply - plyOf(s.startFen);
  const end = (lesson.resolvedPly ?? plyOf(s.startFen) + moves.length) - plyOf(s.startFen);
  return moves.slice(start, Math.min(end, start + maxPlies, moves.length));
}

// ------------------------------------------------------------------ saved games

/** A lesson as version 1 saved it: details and trigger as English text. */
type LessonV1 = Omit<Lesson, "baselineDetail" | "userDetail" | "bestDetail" | "trigger" | "line"> & {
  baselineDetail: string;
  userDetail: string;
  bestDetail: string;
  triggerText: string;
};

/** A lesson as version 3 and earlier saved it: no line, because there was only one. */
type LessonV3 = Omit<Lesson, "line"> & { line?: number };

/** A session as any version saved it. */
export type SavedSessionState = Omit<
  SessionState,
  "lessons" | "scores" | "resigned" | "line" | "branches"
> & {
  lessons: (LessonV3 | LessonV1)[];
  scores?: (number | null)[];
  resigned?: boolean;
  line?: number;
  branches?: Branch[];
};

/**
 * Bring a saved session up to the current version. Details are measured again from the
 * lesson's own positions, so they come out exactly as they would have been. A version 1
 * consequence's trigger can't always be rebuilt (the game may have been rewound past it),
 * so it keeps its saved text. Version 2 and earlier recorded no evaluations or resignations.
 * Version 3 and earlier kept no lines left behind: every lesson is on the one line there is.
 */
export function upgradeSession(saved: SavedSessionState): SessionState {
  const line = saved.line ?? 0;
  const lessons = (
    saved.version >= 2 ? (saved.lessons as LessonV3[]) : (saved.lessons as LessonV1[]).map(upgradedLesson)
  ).map((l) => ({ ...l, line: l.line ?? line }));
  return {
    ...saved,
    version: SESSION_STATE_VERSION,
    lessons,
    // A tab running an older version may have taken moves back without their scores.
    scores: (saved.scores ?? []).slice(0, saved.moves.length),
    resigned: saved.resigned ?? false,
    line,
    branches: saved.branches ?? [],
  };
}

function upgradedLesson(old: LessonV1): LessonV3 {
  const { triggerText, ...rest } = old;
  return {
    ...rest,
    ...upgradedDetails(old),
    trigger:
      old.status !== "triggered"
        ? null
        : old.kind === MISSED_CHANCE
          ? { kind: "chance_gone" }
          : { kind: "legacy", text: triggerText },
  };
}

function upgradedDetails(l: LessonV1): Pick<Lesson, "baselineDetail" | "userDetail" | "bestDetail"> {
  if (l.feature === MATE_FEATURE) {
    return {
      baselineDetail: { kind: "none" },
      userDetail: { kind: "checkmated" },
      bestDetail: { kind: "no_mate" },
    };
  }
  const feature = FEATURES_BY_NAME[l.feature];
  const measure = (moves: string[]): Detail => {
    const [, detail]: Measurement = feature.measure(
      new Position(new Game(l.fenBefore, moves).fen),
      l.userColour,
    );
    return detail;
  };
  return { baselineDetail: measure([]), userDetail: measure(l.userLine), bestDetail: measure(l.bestLine) };
}
