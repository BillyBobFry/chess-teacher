/** Mistake detection, lessons, and the checks that trigger them. */

import { Position, neg, opposite, squareName, type Colour, type PieceType } from "./board.ts";
import { MATE_SCORE, type Candidate } from "./engine.ts";
import {
  FEATURES,
  FEATURES_BY_NAME,
  hanging,
  material,
  measureAll,
  type FeatureName,
  type Measurements,
} from "./features.ts";
import { Game, cleanLine, fullmoveOf, plyOf, sanOf, uciParts } from "./game.ts";
import type { PrincipleId } from "./principles.ts";
import type { Detail, MoveRef, PieceCount, Trigger } from "./text.ts";

/** The user's move makes something measurably worse. */
export const CONSEQUENCE = "consequence";
/** The user's move is fine, but the best move would have gained something. */
export const MISSED_CHANCE = "missed_chance";
export const MATE_FEATURE = "mate";
/** Opponent weaknesses are opportunities: losing one is a missed chance, not a consequence. */
const OPPORTUNITY_FEATURES = new Set<string>(["their_pawns"]);

/**
 * Before this move, the engine's small preferences between normal opening moves aren't
 * lessons, so strategic lessons need the full threshold.
 */
const LOWER_BAR_FROM_MOVE = 3;

export type LessonKind = typeof CONSEQUENCE | typeof MISSED_CHANCE;
export type LessonFeature = FeatureName | typeof MATE_FEATURE;
export type LessonStatus = "pending" | "triggered" | "fixed" | "expired" | "superseded" | "rewound";

export interface TeachingConfig {
  /** Minimum eval gap (centipawns) before we consider teaching. */
  threshold: number;
  /**
   * Minimum eval gap for strategic lessons once the opening is under way. Strategic mistakes
   * cost little per move, so they rarely reach `threshold`; the classical check (not the gap)
   * is what keeps these lessons honest. Missing in games saved before it existed, which keep
   * `threshold`.
   */
  strategicThreshold?: number;
  /** Don't nitpick moves that leave the user clearly winning. */
  stillWinning: number;
  /** Don't teach in positions that were already lost. */
  hopeless: number;
  /** How far to play the two futures forward (plies). */
  linePlies: number;
  /** A pending lesson expires after this many opponent moves. */
  expiryMoves: number;
  /** How many of the user's recent moves to offer in "find the cause". */
  causeWindow: number;
  /** The teaching opponent exploits pending lessons. */
  levelUp: boolean;
  /** Warn when the opponent has spotted something. */
  easy: boolean;
  /** Analysis depth for the full-strength engine. */
  analysisDepth: number;
  /** Candidate moves considered before each user move. */
  analysisMultipv: number;
  /** Opponent: thinking time in normal mode. */
  opponentMovetimeMs: number;
  /** Opponent: candidate moves considered when levelled up. */
  opponentMultipv: number;
  /** Opponent: how much eval it will give up to make an exploit clearer (centipawns). */
  opponentMargin: number;
  /** Opponent: plies of each candidate's line checked for lesson progress. */
  opponentLookahead: number;
  /** Only teach strategic lessons the classical evaluation agrees with (when available). */
  verifyStrategic: boolean;
}

export const DEFAULT_CONFIG: TeachingConfig = {
  threshold: 70,
  strategicThreshold: 35,
  stillWinning: 300,
  hopeless: -500,
  linePlies: 8,
  expiryMoves: 8,
  causeWindow: 5,
  levelUp: true,
  easy: false,
  analysisDepth: 12,
  analysisMultipv: 3,
  opponentMovetimeMs: 50,
  opponentMultipv: 5,
  opponentMargin: 60,
  opponentLookahead: 4,
  verifyStrategic: true,
};

/** A lesson is plain data, so a game in progress can be saved and resumed anywhere. */
export interface Lesson {
  id: number;
  ply: number;
  userColour: Colour;
  fenBefore: string;
  userMove: string;
  bestMove: string;
  bestScore: number;
  userScore: number;
  feature: LessonFeature;
  principle: PrincipleId;
  kind: LessonKind;
  baseline: number;
  /** Feature value at the end of the user's line. */
  predicted: number;
  /** Feature value at the end of the best line. */
  bestValue: number;
  /** A consequence lands when the real value is <= this. */
  triggerAt: number;
  userLine: string[];
  bestLine: string[];
  userValues: number[];
  bestValues: number[];
  divergence: number;
  baselineDetail: Detail;
  userDetail: Detail;
  bestDetail: Detail;
  /** User pieces left hanging after the move (squares, h8 → a1 order). */
  hangingAfter: string[];
  status: LessonStatus;
  resolvedPly: number | null;
  /** What happened when the lesson was triggered (null until then). */
  trigger: Trigger | null;
  /** Triggered at the same time as another lesson; shown in the review instead. */
  deferred: boolean;
  foundCause: boolean | null;
  chanceMove: string | null;
  /** Why the classical evaluation agreed with this strategic lesson (if it was checked). */
  verification?: string;
}

export const lessonGap = (l: Lesson): number => l.bestScore - l.userScore;
export const lessonMoveNumber = (l: Lesson): number => fullmoveOf(l.fenBefore);
export const lessonUserSan = (l: Lesson): string => sanOf(l.fenBefore, l.userMove);
export const lessonBestSan = (l: Lesson): string => sanOf(l.fenBefore, l.bestMove);
/** The user's mistake, as a move to show ("12. Nf3"). */
export const lessonMove = (l: Lesson): MoveRef => ({
  moveNumber: lessonMoveNumber(l),
  colour: l.userColour,
  san: lessonUserSan(l),
});

// --------------------------------------------------------------------------- detection

/** Eval (centipawns, user's point of view) of the position after the user's move. */
export function scoreAfter(gameAfter: Game, after: Candidate[], userColour: Colour): number {
  if (gameAfter.isCheckmate()) return gameAfter.turn !== userColour ? MATE_SCORE : -MATE_SCORE;
  if (gameAfter.isGameOver()) return 0;
  return after.length ? neg(after[0]!.score) : 0;
}

/** Queens of both colours left on the board after a line. */
function queensAfter(fen: string, line: string[]): number {
  const game = new Game(fen);
  for (const m of line) game.push(m);
  const pos = new Position(game.fen);
  return pos.pieces("q", "w").length + pos.pieces("q", "b").length;
}

function lineValues(fen: string, line: string[], color: Colour): Measurements[] {
  const game = new Game(fen);
  return line.map((m) => {
    game.push(m);
    return measureAll(new Position(game.fen), color);
  });
}

export function detectMistake(
  lessonId: number,
  fenBefore: string,
  userMove: string,
  gameAfter: Game,
  candsBefore: Candidate[],
  after: Candidate[],
  cfg: TeachingConfig,
): Lesson | null {
  const best = candsBefore[0];
  if (!best) return null;
  const userColour = new Position(fenBefore).turn;
  if (best.move === userMove) return null;

  const userScore = scoreAfter(gameAfter, after, userColour);
  const gap = best.score - userScore;
  const lowestBar = Math.min(cfg.threshold, cfg.strategicThreshold ?? cfg.threshold);
  if (gap < lowestBar || userScore >= cfg.stillWinning || best.score <= cfg.hopeless) return null;

  const tail = after.length ? after[0]!.pv : [];
  let userLine = [userMove, ...cleanLine(gameAfter.fen, tail, cfg.linePlies - 1)];
  let bestLine = cleanLine(fenBefore, best.pv, cfg.linePlies);
  const n = Math.min(userLine.length, bestLine.length);
  userLine = userLine.slice(0, n);
  bestLine = bestLine.slice(0, n);

  const posAfter = new Position(gameAfter.fen);
  const hangingAfter = hanging(posAfter, userColour).map(squareName);
  const baseline = measureAll(new Position(fenBefore), userColour);

  const base = {
    id: lessonId,
    ply: plyOf(fenBefore),
    userColour,
    fenBefore,
    userMove,
    bestMove: best.move,
    bestScore: best.score,
    userScore,
    userLine,
    bestLine,
    hangingAfter,
    status: "pending" as LessonStatus,
    resolvedPly: null,
    trigger: null,
    deferred: false,
    foundCause: null,
    chanceMove: null,
  };

  // Getting mated is its own lesson: there's no slow strategic consequence to wait for.
  if (userScore <= -(MATE_SCORE - 300)) {
    return {
      ...base,
      feature: MATE_FEATURE,
      principle: "safety",
      kind: CONSEQUENCE,
      baseline: 0,
      predicted: -1,
      bestValue: 0,
      triggerAt: -1,
      userValues: [],
      bestValues: [],
      divergence: n - 1,
      baselineDetail: { kind: "none" },
      userDetail: { kind: "checkmated" },
      bestDetail: { kind: "no_mate" },
    };
  }

  if (n === 0) return null;
  const userVals = lineValues(fenBefore, userLine, userColour);
  const bestVals = lineValues(fenBefore, bestLine, userColour);
  const end = n - 1;

  const normGap = (name: FeatureName, i: number): number =>
    (bestVals[i]![name][0] - userVals[i]![name][0]) / FEATURES_BY_NAME[name].unit;
  // The gap must hold for the last two plies, so a snapshot taken with one side to move
  // (or mid-manoeuvre) can't create a lesson on its own.
  const persistentGap = (name: FeatureName): number =>
    end >= 1 ? Math.min(normGap(name, end), normGap(name, end - 1)) : normGap(name, end);

  // A queen has more moves than any other piece, so a line that trades queens off looks like
  // a big loss of activity even when the pieces left are just as active.
  const queensDiffer = queensAfter(fenBefore, userLine) !== queensAfter(fenBefore, bestLine);

  // Material is the most concrete lesson, so it wins whenever it explains the gap.
  let chosen: FeatureName | null = null;
  if (normGap("material", end) >= 1) {
    chosen = "material";
  } else {
    let top: [number, FeatureName] | null = null;
    for (const f of FEATURES) {
      if (f.name === "material" || (f.name === "mobility" && queensDiffer)) continue;
      const v = persistentGap(f.name);
      // Same tie-break as Python's max() over (value, name) tuples.
      if (!top || v > top[0] || (v === top[0] && f.name > top[1])) top = [v, f.name];
    }
    if (top && top[0] >= 1) chosen = top[1];
  }
  if (chosen === null) return null; // the engine prefers another move, but nothing we measure explains why
  // Strategic lessons get the lower bar, except where it can't be trusted: in the first few
  // moves, and for king activity, which the classical check can't verify.
  const lowerBar =
    chosen !== "material" && chosen !== "king_activity" && fullmoveOf(fenBefore) >= LOWER_BAR_FROM_MOVE;
  if (gap < (lowerBar ? lowestBar : cfg.threshold)) return null;

  const feat = FEATURES_BY_NAME[chosen];
  const [baseV, baseD] = baseline[chosen];
  const [userV, userD] = userVals[end]![chosen];
  const [bestV, bestD] = bestVals[end]![chosen];
  const finalGap = normGap(chosen, end);
  let divergence = end;
  for (let i = 0; i < n; i++) {
    if (normGap(chosen, i) >= 0.5 * finalGap) {
      divergence = i;
      break;
    }
  }

  let kind: LessonKind;
  let triggerAt: number;
  if (!OPPORTUNITY_FEATURES.has(chosen) && (baseV - userV) / feat.unit >= 0.9) {
    kind = CONSEQUENCE;
    triggerAt = baseV - 0.75 * (baseV - userV);
  } else {
    kind = MISSED_CHANCE;
    triggerAt = userV;
  }

  let principle: PrincipleId = feat.principle;
  if (chosen === "material") {
    const balance = (pos: Position) => material(pos, userColour) - material(pos, opposite(userColour));
    // Measured after the user's move, so a capture they just made counts as theirs.
    const afterMove = balance(posAfter);
    // The engine's line may lose material and win it back later with a trick the user would
    // also have to find, so judge the line by the lowest balance it holds for two plies.
    const held = userVals.map((v, i) => Math.max(v.material[0], (userVals[i + 1] ?? v).material[0]));
    const lowest = Math.min(userV, ...held);
    if (lowest >= afterMove - 0.5) {
      // The user's line loses nothing of their own: the better move would have won material.
      // That's a chance they missed, not a blunder.
      kind = MISSED_CHANCE;
      triggerAt = userV;
      // The settled balance before the move already counts captures that were on offer.
      principle = baseV > balance(new Position(fenBefore)) + 0.5 ? "free_material" : "forcing_moves";
    } else {
      if ((baseV - lowest) / feat.unit >= 0.9) {
        kind = CONSEQUENCE;
        triggerAt = baseV - 0.75 * (baseV - lowest);
      }
      const oppReply = userLine[1];
      principle =
        oppReply !== undefined && hangingAfter.includes(uciParts(oppReply).to) ? "hanging" : "safety";
    }
  }

  return {
    ...base,
    feature: chosen,
    principle,
    kind,
    baseline: baseV,
    predicted: userV,
    bestValue: bestV,
    triggerAt,
    userValues: userVals.map((v) => v[chosen][0]),
    bestValues: bestVals.map((v) => v[chosen][0]),
    divergence,
    baselineDetail: baseD,
    userDetail: userD,
    bestDetail: bestD,
  };
}

// --------------------------------------------------------------------------- triggers

export function consequenceLanded(lesson: Lesson, game: Game): boolean {
  if (lesson.feature === MATE_FEATURE) return game.isCheckmate() && game.turn === lesson.userColour;
  const [value] = FEATURES_BY_NAME[lesson.feature].measure(new Position(game.fen), lesson.userColour);
  return value <= lesson.triggerAt;
}

export function describeConsequence(lesson: Lesson, game: Game): Trigger {
  const c = lesson.userColour;
  if (lesson.feature === MATE_FEATURE) return { kind: "checkmated" };
  const now = new Position(game.fen);
  if (lesson.feature === "material") {
    const before = new Position(lesson.fenBefore);
    const changes = (color: Colour): PieceCount[] => {
      const out: PieceCount[] = [];
      for (const piece of ["q", "r", "b", "n", "p"] as PieceType[]) {
        const count = before.pieces(piece, color).length - now.pieces(piece, color).length;
        if (count > 0) out.push({ piece, count });
      }
      return out;
    };
    const balance = (p: Position) => material(p, c) - material(p, opposite(c));
    const net = balance(before) - balance(now);
    if (net <= 0) return { kind: "losing_material" };
    const [settled] = FEATURES_BY_NAME.material.measure(now, c);
    return {
      kind: "lost_material",
      lost: changes(c),
      taken: changes(opposite(c)),
      net,
      more: lesson.baseline - settled > net,
    };
  }
  const [, detail] = FEATURES_BY_NAME[lesson.feature].measure(now, c);
  return { kind: "feature", feature: lesson.feature, detail };
}
