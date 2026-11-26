/**
 * Research: does Stockfish 11's classical evaluation agree with our strategic lessons?
 *
 * Simulates games (weak engine student vs teaching opponent), and for every strategic
 * lesson gets the classical eval breakdown at the end of both lines, then applies
 * `classicalVerdict`. Writes a report with every lesson, the verdict and its reasons, so
 * the kept and rejected lessons can be judged by a chess player.
 *
 * Usage: pnpm --filter @chess-teacher/sim exec tsx src/validate-lessons.ts --games 24 --out ../../reports
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  Game,
  classicalVerdict,
  finish,
  gameOf,
  lessonMove,
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  type ClassicalVerdict,
  type Engines,
  type EvalTrace,
  type FeatureLesson,
  type SessionState,
} from "@chess-teacher/core";
import type { UciEngine } from "@chess-teacher/engine";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { moveLabel, templateExplanation } from "./prototype-text.ts";

const { values: args } = parseArgs({
  options: {
    games: { type: "string", default: "24" },
    depth: { type: "string", default: "10" },
    "max-moves": { type: "string", default: "50" },
    out: { type: "string", default: "reports" },
  },
});

const require = createRequire(import.meta.url);
const SF11 = `node ${require.resolve("stockfish11/src/stockfish.asm.js")}`;

/** The end of a line, stepping back past positions where the side to move is in check. */
function lineEnd(fenBefore: string, line: string[]): string {
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

interface Row {
  game: number;
  lesson: FeatureLesson;
  verdict: ClassicalVerdict | null;
  status: string;
}

async function main() {
  const analyst = await NodeUciEngine.start(findStockfish());
  const weak = await NodeUciEngine.start(findStockfish(), { skill: 3 });
  const student = await NodeUciEngine.start(findStockfish(), { skill: 0 });
  const classical: UciEngine = await NodeUciEngine.start(SF11);
  const engines: Engines = { analyst, weak };
  const rows: Row[] = [];

  for (let g = 0; g < Number(args.games); g++) {
    const userColour = g % 2 === 0 ? "w" : "b";
    let state: SessionState = newSession({ userColour, config: { analysisDepth: Number(args.depth) } });
    for (;;) {
      const game = gameOf(state);
      if (game.isGameOver() || Number(game.fen.split(" ")[5]) > Number(args["max-moves"])) break;
      if (game.turn === userColour) {
        state = (await startUserTurn(state, engines)).state;
        state = (
          await userMove(
            state,
            await student.play(game.fen, { movetimeMs: 10, history: game.previousFens() }),
            engines,
          )
        ).state;
      } else {
        state = (await opponentMove(state, engines)).state;
      }
    }
    state = finish(state);
    for (const lesson of state.lessons) {
      // This check is about the feature lessons; diagnosed lessons are measured by the benchmark.
      if (lesson.source !== "features" || lesson.feature === "material" || lesson.feature === "mate")
        continue;
      const userFen = lineEnd(lesson.fenBefore, lesson.userLine);
      const bestFen = lineEnd(lesson.fenBefore, lesson.bestLine);
      const [u, b] = await Promise.all([classical.evalTrace(userFen), classical.evalTrace(bestFen)]);
      const verdict =
        u && b
          ? classicalVerdict(
              lesson.feature,
              lesson.userColour,
              { fen: userFen, trace: u as EvalTrace },
              {
                fen: bestFen,
                trace: b as EvalTrace,
              },
            )
          : null;
      rows.push({ game: g + 1, lesson, verdict, status: lesson.status });
    }
    console.log(`game ${g + 1}/${args.games}: ${rows.length} strategic lessons so far`);
  }
  await Promise.all([analyst.close(), weak.close(), student.close(), classical.close()]);

  const kept = rows.filter((r) => r.verdict?.agrees);
  const rejected = rows.filter((r) => r.verdict && !r.verdict.agrees);
  const byFeature: Record<string, { kept: number; rejected: number }> = {};
  for (const r of rows) {
    const f = (byFeature[r.lesson.feature] ??= { kept: 0, rejected: 0 });
    if (r.verdict?.agrees) f.kept += 1;
    else if (r.verdict) f.rejected += 1;
  }
  const md = [
    "# Classical-evaluation check on strategic lessons",
    "",
    `${args.games} simulated games, depth ${args.depth}. ${rows.length} strategic lessons: ` +
      `**${kept.length} kept**, **${rejected.length} rejected**, ${rows.length - kept.length - rejected.length} not checkable.`,
    "",
    "| Feature | Kept | Rejected |",
    "|---|---|---|",
    ...Object.entries(byFeature).map(([f, c]) => `| ${f} | ${c.kept} | ${c.rejected} |`),
    "",
  ];
  const section = (title: string, list: Row[]) => {
    md.push(`## ${title}`, "");
    for (const r of list) {
      const l = r.lesson;
      md.push(
        `### Game ${r.game}, ${moveLabel(lessonMove(l))} (${l.userColour === "w" ? "white" : "black"}): ${l.feature}, ${l.kind}`,
        "",
        `**Verdict:** ${r.verdict?.reason ?? "no breakdown available"}  `,
        `**Term gains for the better line:** ${
          (r.verdict?.gains ?? [])
            .filter((g) => Math.abs(g.gain) >= 0.05)
            .map((g) => `${g.term} ${g.gain > 0 ? "+" : ""}${g.gain.toFixed(2)}`)
            .join(", ") || "none"
        }`,
        "",
        "```",
        templateExplanation(l),
        "```",
        "",
        "Judgement: ☐ real reason ☐ partly ☐ rationalisation",
        "",
      );
    }
  };
  section("Kept", kept);
  section("Rejected", rejected);
  mkdirSync(args.out!, { recursive: true });
  const file = join(args.out!, "classical-check.md");
  writeFileSync(file, md.join("\n") + "\n");
  console.log(md.slice(0, 6 + Object.keys(byFeature).length + 2).join("\n"));
  console.log(`\nReport: ${file}`);
}

await main();
