/**
 * A second opinion on strategic lessons. Our features say *what* differs between the user's
 * line and the better line; Stockfish's classical evaluation says which of its terms
 * account for the difference. A strategic lesson is only taught when the term(s) matching
 * its feature are among the main reasons, so we don't teach a factor that merely happened
 * to differ.
 */

import { Position, VALUES, type Colour } from "./board.ts";
import type { ClassicalEval, EvalTrace } from "./engine.ts";
import { Game } from "./game.ts";
import type { Lesson, LessonFeature } from "./lessons.ts";

/** Which classical-evaluation terms correspond to each strategic feature. */
export const FEATURE_TERMS: Partial<Record<LessonFeature, string[]>> = {
  development: ["Mobility", "Knights", "Bishops"],
  king_safety: ["King safety"],
  centre: ["Space", "Mobility"],
  mobility: ["Mobility"],
  own_pawns: ["Pawns"],
  their_pawns: ["Pawns"],
  passed_pawns: ["Passed"],
  outposts: ["Knights", "Bishops"],
  open_files: ["Rooks"],
  // No classical term measures king activity on its own (mapping it to "Passed" let pawn
  // races through as "king activity" lessons), so these lessons can't be verified.
  king_activity: [],
};

/** Terms that are never a strategic explanation (or are summaries of others). */
const IGNORED_TERMS = new Set(["Material", "Imbalance", "Initiative", "Variant", "Total"]);

/**
 * Game phase in [0, 1] (1 = full middlegame), from non-pawn material, mirroring Stockfish's
 * blend of middlegame and endgame scores. Stockfish's limits (3915 and 15258 in its
 * internal units) are about 15 and 59 in pawn units.
 */
export function gamePhase(fen: string): number {
  let npm = 0;
  for (const p of new Position(fen).squares) if (p && p.type !== "p" && p.type !== "k") npm += VALUES[p.type];
  return Math.min(1, Math.max(0, (npm - 15) / (59 - 15)));
}

export interface ClassicalVerdict {
  /** Should this lesson be taught? */
  agrees: boolean;
  /** Pawns gained by the better line on the feature's own term(s), from the user's side. */
  featureGain: number;
  /** All terms, largest gain for the better line first (user's point of view, in pawns). */
  gains: { term: string; gain: number }[];
  reason: string;
}

export interface VerdictOptions {
  /** The feature's terms must gain at least this much (pawns). */
  minGain: number;
  /** …and be within this many places of the largest gain… */
  maxRank: number;
  /** …and the largest gain may be at most this many times the feature's gain. */
  maxDominance: number;
}

/**
 * Tuned on 45 simulated strategic lessons judged by hand (reports/classical-check.md):
 * these rules keep most real strategic lessons and reject most rationalisations.
 */
export const DEFAULT_VERDICT_OPTIONS: VerdictOptions = { minGain: 0.1, maxRank: 2, maxDominance: 3 };

export function classicalVerdict(
  feature: LessonFeature,
  userColour: Colour,
  userEnd: { fen: string; trace: EvalTrace },
  bestEnd: { fen: string; trace: EvalTrace },
  opts: VerdictOptions = DEFAULT_VERDICT_OPTIONS,
): ClassicalVerdict {
  const terms = FEATURE_TERMS[feature];
  if (!terms) return { agrees: true, featureGain: 0, gains: [], reason: "not a strategic feature" };
  if (terms.length === 0) return { agrees: false, featureGain: 0, gains: [], reason: "can't be verified" };

  const sign = userColour === "w" ? 1 : -1;
  const blend = (t: { mg: number; eg: number }, phase: number) => t.mg * phase + t.eg * (1 - phase);
  const pu = gamePhase(userEnd.fen);
  const pb = gamePhase(bestEnd.fen);
  const names = new Set([...Object.keys(userEnd.trace.terms), ...Object.keys(bestEnd.trace.terms)]);
  const gains = [...names]
    .filter((n) => !IGNORED_TERMS.has(n))
    .map((term) => {
      const u = userEnd.trace.terms[term] ?? { mg: 0, eg: 0 };
      const b = bestEnd.trace.terms[term] ?? { mg: 0, eg: 0 };
      return { term, gain: Math.round(sign * (blend(b, pb) - blend(u, pu)) * 100) / 100 };
    })
    .sort((a, b) => b.gain - a.gain);

  const featureGain =
    Math.round(gains.filter((g) => terms.includes(g.term)).reduce((s, g) => s + g.gain, 0) * 100) / 100;
  const rank = gains.findIndex((g) => terms.includes(g.term) && g.gain > 0);
  if (featureGain < opts.minGain) {
    return {
      agrees: false,
      featureGain,
      gains,
      reason: `${terms.join("/")} gains only ${featureGain.toFixed(2)}`,
    };
  }
  if (rank === -1 || rank >= opts.maxRank) {
    return {
      agrees: false,
      featureGain,
      gains,
      reason: `${terms.join("/")} isn't a main reason (top: ${gains
        .slice(0, 2)
        .map((g) => `${g.term} ${g.gain.toFixed(2)}`)
        .join(", ")})`,
    };
  }
  const top = gains[0]!;
  if (!terms.includes(top.term) && top.gain > opts.maxDominance * featureGain) {
    return {
      agrees: false,
      featureGain,
      gains,
      reason: `${top.term} (+${top.gain.toFixed(2)}) dwarfs ${terms.join("/")} (+${featureGain.toFixed(2)})`,
    };
  }
  return {
    agrees: true,
    featureGain,
    gains,
    reason: `${gains[rank]!.term} is a main reason (+${featureGain.toFixed(2)})`,
  };
}

/** The end of a line, stepping back past positions where the side to move is in check
 * (the classical evaluation has no breakdown for those). */
export function lineEndFen(fenBefore: string, line: readonly string[]): string {
  const game = new Game(fenBefore);
  const fens = [game.fen];
  for (const m of line) {
    game.push(m);
    fens.push(game.fen);
  }
  for (let i = fens.length - 1; i >= 0; i--) {
    if (!new Game(fens[i]!).chess.inCheck()) return fens[i]!;
  }
  return fens[0]!;
}

/** Ask the classical engine whether a strategic lesson's feature really explains the gap.
 * Material and checkmate lessons need no second opinion. */
export async function verifyLesson(
  lesson: Lesson,
  classical: ClassicalEval,
  opts: VerdictOptions = DEFAULT_VERDICT_OPTIONS,
): Promise<ClassicalVerdict> {
  if (!FEATURE_TERMS[lesson.feature]) {
    return { agrees: true, featureGain: 0, gains: [], reason: "not a strategic feature" };
  }
  const userFen = lineEndFen(lesson.fenBefore, lesson.userLine);
  const bestFen = lineEndFen(lesson.fenBefore, lesson.bestLine);
  const [u, b] = [await classical.evalTrace(userFen), await classical.evalTrace(bestFen)];
  if (!u || !b) return { agrees: false, featureGain: 0, gains: [], reason: "no evaluation breakdown" };
  return classicalVerdict(
    lesson.feature,
    lesson.userColour,
    { fen: userFen, trace: u },
    { fen: bestFen, trace: b },
    opts,
  );
}
