/**
 * Research: what would a lower eval-gap bar add for strategic lessons?
 *
 * Plays simulated games with one bar for every lesson (`threshold`, 70, classical check on), as
 * the app did before strategic lessons had their own bar. At every student move it also asks
 * `detectMistake` the same question with the lower strategic bar (`--low`). A
 * "near miss" is a strategic lesson (not material, not mate) whose gap is below the real
 * threshold: today it is never taught. Each near miss gets the classical check, so the
 * report shows how many extra strategic lessons a lower bar would teach, of which kinds,
 * and lets a chess player judge whether they are right.
 *
 * It also sorts the lessons the app really taught into tactics/strategy × blunder/missed,
 * to size the "you missed it" vs "you blundered" split.
 *
 * Usage: pnpm --filter @chess-teacher/sim exec tsx src/near-miss.ts --games 12 --low 35 --out ../../reports
 *   --engine "node /path/to/stockfish.js" if Stockfish isn't installed natively.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  DEFAULT_CONFIG,
  Game,
  Position,
  detectMistake,
  finish,
  fullmoveOf,
  gameOf,
  lessonGap,
  lessonMove,
  material,
  newSession,
  opponentMove,
  opposite,
  sanOf,
  startUserTurn,
  userMove,
  verifyLesson,
  type ClassicalVerdict,
  type Engines,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { detailText, moveLabel, templateExplanation } from "./prototype-text.ts";

const { values: args } = parseArgs({
  options: {
    games: { type: "string", default: "12" },
    low: { type: "string", default: "35" },
    "student-skill": { type: "string", default: "0" },
    depth: { type: "string", default: "10" },
    "max-moves": { type: "string", default: "50" },
    engine: { type: "string" },
    out: { type: "string", default: "reports" },
  },
});

const LOW = Number(args.low);

interface NearMiss {
  game: number;
  lesson: Lesson;
  verdict: ClassicalVerdict;
  /** What the app actually taught for the same move, if anything. */
  taughtInstead: string | null;
}

type TaughtCategory =
  "tactics: blunder" | "tactics: missed free material" | "tactics: missed tactic" | "strategy";

interface Taught {
  game: number;
  lesson: Lesson;
  category: TaughtCategory;
}

/** Material lessons: did the user lose their own material, leave a free capture, or miss a tactic? */
function categorise(l: Lesson): TaughtCategory {
  if (l.feature !== "material" && l.feature !== "mate") return "strategy";
  if (l.feature === "mate") return "tactics: blunder";
  const pos = new Position(l.fenBefore);
  const raw = material(pos, l.userColour) - material(pos, opposite(l.userColour));
  if (l.predicted < raw - 0.5) return "tactics: blunder";
  // The settled balance before the move counts captures available to the user.
  if (l.baseline > raw + 0.5) return "tactics: missed free material";
  return "tactics: missed tactic";
}

const sanLine = (fen: string, line: string[]): string => {
  const g = new Game(fen);
  const out: string[] = [];
  for (const m of line) {
    out.push(sanOf(g.fen, m));
    g.push(m);
  }
  return out.join(" ");
};

const count = <T extends string>(xs: T[]): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const x of xs) out[x] = (out[x] ?? 0) + 1;
  return out;
};

async function main() {
  const command = args.engine ?? findStockfish();
  const analyst = await NodeUciEngine.start(command);
  const weak = await NodeUciEngine.start(command, { skill: 3 });
  const student = await NodeUciEngine.start(command, { skill: Number(args["student-skill"]) });
  const require = createRequire(import.meta.url);
  const classical = await NodeUciEngine.start(`node ${require.resolve("stockfish11/src/stockfish.asm.js")}`);
  const engines: Engines = { analyst, weak, classical };

  const nearMisses: NearMiss[] = [];
  const taught: Taught[] = [];
  let userMoves = 0;
  let strictUnverified = 0;
  let nearMissCandidates = 0;
  const started = performance.now();

  for (let g = 0; g < Number(args.games); g++) {
    const userColour = g % 2 === 0 ? "w" : "b";
    let state: SessionState = newSession({
      userColour,
      config: { analysisDepth: Number(args.depth), strategicThreshold: DEFAULT_CONFIG.threshold },
    });
    for (;;) {
      const game = gameOf(state);
      if (game.isGameOver() || fullmoveOf(game.fen) > Number(args["max-moves"])) break;
      if (game.turn !== userColour) {
        state = (await opponentMove(state, engines)).state;
        continue;
      }
      state = (await startUserTurn(state, engines)).state;
      const fenBefore = game.fen;
      const cands = state.analysis?.fen === fenBefore ? state.analysis.candidates : [];
      const move = await student.play(fenBefore, { movetimeMs: 10 });
      const before = state.lessons.length;
      state = (await userMove(state, move, engines)).state;
      userMoves += 1;
      const created = state.lessons.slice(before);

      const gameAfter = new Game(fenBefore, [move]);
      const after = gameAfter.isGameOver()
        ? []
        : await analyst.analyse(gameAfter.fen, { depth: Number(args.depth), multipv: 1 });
      const probe = detectMistake(0, fenBefore, move, gameAfter, cands, after, {
        ...state.config,
        strategicThreshold: LOW,
      });
      if (
        probe &&
        probe.feature !== "material" &&
        probe.feature !== "mate" &&
        lessonGap(probe) < state.config.threshold
      ) {
        nearMissCandidates += 1;
        const verdict = await verifyLesson(probe, classical);
        const instead = created[0];
        nearMisses.push({
          game: g + 1,
          lesson: probe,
          verdict,
          taughtInstead: instead ? `${instead.feature} (${instead.kind})` : null,
        });
      }
    }
    state = finish(state);
    strictUnverified += state.unverified ?? 0;
    for (const lesson of state.lessons) taught.push({ game: g + 1, lesson, category: categorise(lesson) });
    console.log(
      `game ${g + 1}/${args.games}: ${state.lessons.length} lessons taught, ` +
        `${nearMisses.filter((n) => n.game === g + 1).length} near misses`,
    );
  }
  await Promise.all([analyst.close(), weak.close(), student.close(), classical.close()]);
  const seconds = Math.round((performance.now() - started) / 1000);

  const games = Number(args.games);
  const kept = nearMisses.filter((n) => n.verdict.agrees);
  const rejected = nearMisses.filter((n) => !n.verdict.agrees);
  const byFeature: Record<string, { consequence: number; missed: number; kept: number; rejected: number }> =
    {};
  for (const n of nearMisses) {
    const f = (byFeature[n.lesson.feature] ??= { consequence: 0, missed: 0, kept: 0, rejected: 0 });
    if (n.lesson.kind === "consequence") f.consequence += 1;
    else f.missed += 1;
    if (n.verdict.agrees) f.kept += 1;
    else f.rejected += 1;
  }
  const taughtByCategory = count(taught.map((t) => `${t.category} (${t.lesson.kind})`));
  const perGame = (x: number) => (x / games).toFixed(1);

  const md = [
    "# Near-miss strategic lessons: what a lower bar would add",
    "",
    `${games} simulated games (student: Stockfish skill ${args["student-skill"]}, 10 ms/move; opponent skill 3, levelling up; ` +
      `analysis depth ${args.depth}; at most ${args["max-moves"]} moves). ${userMoves} student moves. Took ${seconds} s.`,
    "",
    `A near miss is a strategic lesson with an eval gap between ${LOW} and ${state0Threshold()} centipawns: ` +
      "today's detection would find it at a lower bar, but never teaches it.",
    "",
    "## Summary",
    "",
    "| | Total | Per game |",
    "|---|---|---|",
    `| Lessons taught today | ${taught.length} | ${perGame(taught.length)} |`,
    `| …of which strategic | ${taught.filter((t) => t.category === "strategy").length} | ${perGame(taught.filter((t) => t.category === "strategy").length)} |`,
    `| Strategic lessons today's check rejected | ${strictUnverified} | ${perGame(strictUnverified)} |`,
    `| Near misses found at ${LOW} cp | ${nearMissCandidates} | ${perGame(nearMissCandidates)} |`,
    `| …kept by the classical check | **${kept.length}** | **${perGame(kept.length)}** |`,
    `| …rejected by the classical check | ${rejected.length} | ${perGame(rejected.length)} |`,
    `| …of kept, the app taught something else at the same move | ${kept.filter((n) => n.taughtInstead).length} | |`,
    "",
    "## Lessons taught today, by kind",
    "",
    "Material lessons sorted by what happened: the student lost their own material (blunder), left a capture " +
      "that was already on the board (missed free material), or the better line won material by force (missed tactic).",
    "",
    "| Category | Count |",
    "|---|---|",
    ...Object.entries(taughtByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `| ${k} | ${v} |`),
    "",
    "## Near misses by feature",
    "",
    "| Feature | Consequence | Missed chance | Kept | Rejected |",
    "|---|---|---|---|---|",
    ...Object.entries(byFeature)
      .sort((a, b) => b[1].kept - a[1].kept)
      .map(([f, c]) => `| ${f} | ${c.consequence} | ${c.missed} | ${c.kept} | ${c.rejected} |`),
    "",
  ];

  const section = (title: string, list: NearMiss[]) => {
    md.push(`## ${title}`, "");
    for (const n of list) {
      const l = n.lesson;
      md.push(
        `### Game ${n.game}, ${moveLabel(lessonMove(l))} (${l.userColour === "w" ? "white" : "black"}): ${l.feature}, ${l.kind}, gap ${lessonGap(l)} cp`,
        "",
        `**FEN:** \`${l.fenBefore}\`  `,
        `**Played:** ${sanLine(l.fenBefore, l.userLine)}  `,
        `**Better:** ${sanLine(l.fenBefore, l.bestLine)}  `,
        `**Measured:** before: ${detailText(l.baselineDetail)} · after yours: ${detailText(l.userDetail)} · after better: ${detailText(l.bestDetail)}  `,
        `**Verdict:** ${n.verdict.reason}  `,
        `**Term gains for the better line:** ${
          n.verdict.gains
            .filter((g) => Math.abs(g.gain) >= 0.05)
            .map((g) => `${g.term} ${g.gain > 0 ? "+" : ""}${g.gain.toFixed(2)}`)
            .join(", ") || "none"
        }  `,
        `**Taught instead at this move:** ${n.taughtInstead ?? "nothing"}`,
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
  section("Kept near misses", kept);
  section("Rejected near misses", rejected);

  mkdirSync(args.out, { recursive: true });
  const file = join(args.out, `near-miss-skill${args["student-skill"]}.md`);
  writeFileSync(file, md.join("\n") + "\n");
  console.log(md.slice(0, md.indexOf("## Kept near misses")).join("\n"));
  console.log(`\nReport: ${file}`);
}

/** The app's real threshold, for the report's wording. */
function state0Threshold(): number {
  return DEFAULT_CONFIG.threshold;
}

await main();
