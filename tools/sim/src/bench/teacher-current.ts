/**
 * Today's core as a benchmark teacher: the same detection, classical check and threshold
 * as `userMove`, at the app's defaults, on the item's move.
 */

import { createRequire } from "node:module";
import {
  DEFAULT_CONFIG,
  Game,
  MATE_FEATURE,
  MISSED_CHANCE,
  detectMistake,
  facts,
  lessonGap,
  verifyLesson,
} from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { templateExplanation } from "../prototype-text.ts";
import type { BenchItemInput, Teacher, TeacherOutput } from "./teacher.ts";

const require = createRequire(import.meta.url);
const SF11 = `node ${require.resolve("stockfish11/src/stockfish.asm.js")}`;

export async function currentTeacher(): Promise<Teacher> {
  const analyst = await NodeUciEngine.start(findStockfish());
  const classical = await NodeUciEngine.start(SF11);
  const cfg = DEFAULT_CONFIG;
  return {
    name: "current",
    async teach(item: BenchItemInput): Promise<TeacherOutput> {
      const none: TeacherOutput = {
        flagged: false,
        concepts: [],
        namedMoves: [],
        namedSquares: [],
        namedWins: [],
        motifs: [],
        text: "",
      };
      const cands = await analyst.analyse(item.fen, {
        depth: cfg.analysisDepth,
        multipv: cfg.analysisMultipv,
      });
      const after = new Game(item.fen);
      after.push(item.played);
      const afterCands = after.isGameOver()
        ? []
        : await analyst.analyse(after.fen, { depth: cfg.analysisDepth, multipv: 1 });
      let lesson = detectMistake(1, 0, item.fen, item.played, after, cands, afterCands, cfg);
      if (lesson && cfg.verifyStrategic) {
        const v = await verifyLesson(lesson, classical);
        if (v.reason !== "not a strategic feature") {
          if (v.agrees) lesson.verification = v.reason;
          else lesson = null;
        }
      }
      if (lesson && lesson.verification === undefined && lessonGap(lesson) < cfg.threshold) lesson = null;
      if (!lesson) return none;

      const f = facts(lesson);
      const undefended = f.pieces_left_undefended_by_your_move;
      const showsUndefended = lesson.principle === "hanging" && undefended.length > 0;
      return {
        flagged: true,
        better: lesson.bestMove,
        severity: lesson.kind === MISSED_CHANCE && lesson.feature !== MATE_FEATURE ? "small" : "normal",
        concepts: [lesson.principle, `feature:${lesson.feature}`],
        namedMoves: [],
        namedSquares: showsUndefended ? undefended.map((u) => u.square) : [],
        namedWins: [
          ...(lesson.feature === MATE_FEATURE ? ["mate"] : []),
          ...(showsUndefended ? undefended.map((u) => u.piece) : []),
        ],
        motifs: [],
        text: templateExplanation(lesson),
      };
    },
    close: async () => {
      await Promise.all([analyst.close(), classical.close()]);
    },
  };
}
