/** The teaching opponent: plays at the user's level, levels up to exploit a pending lesson. */

import { Position } from "./board.ts";
import type { Engines } from "./engine.ts";
import { FEATURES_BY_NAME } from "./features.ts";
import { Game, isLegal } from "./game.ts";
import { MATE_FEATURE, type Lesson, type TeachingConfig } from "./lessons.ts";

export type OpponentMode = "normal" | "levelled";

export async function chooseOpponentMove(
  game: Game,
  lesson: Lesson | null,
  engines: Engines,
  cfg: TeachingConfig,
): Promise<{ move: string; mode: OpponentMode }> {
  const fen = game.fen;
  if (!lesson)
    return { move: await engines.weak.play(fen, { movetimeMs: cfg.opponentMovetimeMs }), mode: "normal" };

  const cands = game.isGameOver()
    ? []
    : await engines.analyst.analyse(fen, { depth: cfg.analysisDepth, multipv: cfg.opponentMultipv });
  if (cands.length === 0) {
    return { move: await engines.weak.play(fen, { movetimeMs: cfg.opponentMovetimeMs }), mode: "normal" };
  }
  if (lesson.feature === MATE_FEATURE) return { move: cands[0]!.move, mode: "levelled" };

  const best = cands[0]!.score;
  const viable = cands.filter((c) => best - c.score <= cfg.opponentMargin);
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
