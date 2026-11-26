/** The teaching opponent: plays at the user's level, levels up to exploit a pending lesson. */

import { Position } from "./board.ts";
import type { Candidate, Engines } from "./engine.ts";
import { FEATURES_BY_NAME } from "./features.ts";
import { Game, isLegal } from "./game.ts";
import { MATE_FEATURE, type DiagnosedLesson, type Lesson, type TeachingConfig } from "./lessons.ts";
import { awaitedHappened } from "./reveals.ts";

export type OpponentMode = "normal" | "levelled";

export async function chooseOpponentMove(
  game: Game,
  lesson: Lesson | null,
  engines: Engines,
  cfg: TeachingConfig,
): Promise<{ move: string; mode: OpponentMode }> {
  const fen = game.fen;
  const playNormally = async (): Promise<{ move: string; mode: OpponentMode }> => ({
    move: await engines.weak.play(fen, { movetimeMs: cfg.opponentMovetimeMs, history: game.previousFens() }),
    mode: "normal",
  });
  if (!lesson) return playNormally();

  const cands = game.isGameOver()
    ? []
    : await engines.analyst.analyse(fen, { depth: cfg.analysisDepth, multipv: cfg.opponentMultipv });
  const top = cands[0];
  if (!top) return playNormally();
  const best = top.score;
  const viable = cands.filter((c) => best - c.score <= cfg.opponentMargin);
  if (lesson.source === "diagnosis")
    return { move: towardsEvent(game, lesson, top, viable, cfg).move, mode: "levelled" };
  if (lesson.feature === MATE_FEATURE) return { move: top.move, mode: "levelled" };
  const feature = FEATURES_BY_NAME[lesson.feature];

  /** Lowest value (user's point of view) the lesson's feature reaches along this line. */
  const progress = (pv: string[]): number => {
    const line = new Game(fen);
    let lowest = Infinity;
    for (const m of pv.slice(0, cfg.opponentLookahead)) {
      if (!isLegal(line.chess, m)) break;
      line.push(m);
      lowest = Math.min(lowest, feature.measure(new Position(line.fen), lesson.userColour)[0]);
    }
    return lowest;
  };

  // Prefer the move that most directly cashes in the lesson; break ties on eval.
  let chosen = viable[0]!;
  let chosenKey = [progress(chosen.pv), -chosen.score] as const;
  for (const c of viable.slice(1)) {
    const key = [progress(c.pv), -c.score] as const;
    if (key[0] < chosenKey[0] || (key[0] === chosenKey[0] && key[1] < chosenKey[1])) {
      chosen = c;
      chosenKey = key;
    }
  }
  return { move: chosen.move, mode: "levelled" };
}

/**
 * The near-best move that brings the lesson's awaited event soonest along its line; among
 * equals, the punishment the dossier predicted, then the stronger move.
 */
function towardsEvent(
  game: Game,
  lesson: DiagnosedLesson,
  top: Candidate,
  viable: Candidate[],
  cfg: TeachingConfig,
): Candidate {
  if (lesson.awaits.kind === "mate") return top;
  const predicted = game.ply === lesson.ply + 1 ? lesson.userLine[1] : undefined;
  /** Plies until the event, counting only the opponent's own moves along the line. */
  const soonest = (pv: string[]): number => {
    const line = new Game(game.fen);
    for (const [i, m] of pv.slice(0, cfg.opponentLookahead).entries()) {
      if (!isLegal(line.chess, m)) break;
      line.push(m);
      if (i % 2 === 0 && awaitedHappened(lesson, line, m)) return i;
    }
    return Infinity;
  };
  const key = (c: Candidate) => [soonest(c.pv), c.move === predicted ? 0 : 1, -c.score] as const;
  let chosen = top;
  let chosenKey = key(chosen);
  for (const c of viable) {
    const k = key(c);
    if (
      k[0] < chosenKey[0] ||
      (k[0] === chosenKey[0] && (k[1] < chosenKey[1] || (k[1] === chosenKey[1] && k[2] < chosenKey[2])))
    ) {
      chosen = c;
      chosenKey = k;
    }
  }
  return chosen;
}
