/**
 * Simulate games between a weak engine "student" and the teaching opponent, using the
 * TypeScript core and a real Stockfish process. Same questions as the Python version:
 *   - How many mistakes become lessons, and of which kinds?
 *   - Do predicted consequences actually land in the real game?
 *   - Does levelling the opponent up make them land more often?
 *
 * Usage: pnpm sim -- --games 12 --compare
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  CONSEQUENCE,
  MISSED_CHANCE,
  PRINCIPLES,
  facts,
  finish,
  gameOf,
  lessonGap,
  lessonLabel,
  newSession,
  opponentMove,
  startUserTurn,
  templateExplanation,
  userMove,
  type Engines,
  type SessionState,
} from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { createRequire } from "node:module";

const { values: args } = parseArgs({
  options: {
    games: { type: "string", default: "6" },
    "student-skill": { type: "string", default: "0" },
    "student-movetime": { type: "string", default: "10" },
    "opponent-skill": { type: "string", default: "3" },
    depth: { type: "string", default: "10" },
    "max-moves": { type: "string", default: "50" },
    compare: { type: "boolean", default: false },
    verify: { type: "boolean", default: false },
    engine: { type: "string" },
    out: { type: "string", default: "reports" },
  },
});

interface LessonRow {
  game: number;
  move: string;
  colour: string;
  kind: string;
  feature: string;
  principle: string;
  status: string;
  deferred: boolean;
  gapCp: number;
  delayMoves: number | null;
  triggerText: string;
  explanation: string;
  facts: unknown;
}

interface GameRow {
  game: number;
  levelUp: boolean;
  plies: number;
  levelledShare: number;
  msPerUserMove: number;
  lessons: LessonRow[];
}

async function playGame(
  n: number,
  levelUp: boolean,
  engines: Engines,
  student: NodeUciEngine,
): Promise<GameRow> {
  const userColour = n % 2 === 0 ? "w" : "b";
  let state: SessionState = newSession({
    userColour,
    config: { levelUp, analysisDepth: Number(args.depth) },
  });
  let userTime = 0;
  let userMoves = 0;
  for (;;) {
    const game = gameOf(state);
    if (game.isGameOver() || Number(game.fen.split(" ")[5]) > Number(args["max-moves"])) break;
    if (game.turn === userColour) {
      const t = performance.now();
      state = (await startUserTurn(state, engines)).state;
      const move = await student.play(game.fen, { movetimeMs: Number(args["student-movetime"]) });
      const t2 = performance.now();
      state = (await userMove(state, move, engines)).state;
      userTime += t2 - t + (performance.now() - t2);
      userMoves += 1;
    } else {
      state = (await opponentMove(state, engines)).state;
    }
  }
  state = finish(state);
  return {
    game: n,
    levelUp,
    plies: state.moves.length,
    levelledShare:
      state.opponentModes.filter((m) => m === "levelled").length / Math.max(1, state.opponentModes.length),
    msPerUserMove: userTime / Math.max(1, userMoves),
    lessons: state.lessons.map((l) => ({
      game: n,
      move: lessonLabel(l),
      colour: userColour === "w" ? "white" : "black",
      kind: l.kind,
      feature: l.feature,
      principle: l.principle,
      status: l.status,
      deferred: l.deferred,
      gapCp: lessonGap(l),
      delayMoves: l.resolvedPly === null ? null : (l.resolvedPly - l.ply) / 2,
      triggerText: l.triggerText,
      explanation: templateExplanation(l),
      facts: facts(l),
    })),
  };
}

const count = <T>(items: T[]): Record<string, number> =>
  items.reduce<Record<string, number>>((acc, x) => ({ ...acc, [String(x)]: (acc[String(x)] ?? 0) + 1 }), {});
const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};
const round = (x: number, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

function summarise(games: GameRow[]) {
  const lessons = games.flatMap((g) => g.lessons);
  const cons = lessons.filter((l) => l.kind === CONSEQUENCE);
  const triggered = cons.filter((l) => l.status === "triggered");
  const delays = triggered.map((l) => l.delayMoves).filter((d): d is number => d !== null);
  return {
    lessonsPerGame: round(lessons.length / Math.max(1, games.length), 1),
    consequence: cons.length,
    landed: cons.length ? round(triggered.length / cons.length) : null,
    medianDelay: median(delays),
    maxDelay: delays.length ? Math.max(...delays) : null,
    missedChance: lessons.filter((l) => l.kind === MISSED_CHANCE).length,
    levelledShare: round(games.reduce((a, g) => a + g.levelledShare, 0) / Math.max(1, games.length)),
    msPerUserMove: Math.round(games.reduce((a, g) => a + g.msPerUserMove, 0) / Math.max(1, games.length)),
    consequenceStatus: count(cons.map((l) => l.status)),
    missedStatus: count(lessons.filter((l) => l.kind === MISSED_CHANCE).map((l) => l.status)),
    features: count(lessons.map((l) => l.feature)),
    principles: count(lessons.map((l) => PRINCIPLES[l.principle]!.title)),
  };
}

async function main() {
  const command = args.engine ?? findStockfish();
  const analyst = await NodeUciEngine.start(command);
  const weak = await NodeUciEngine.start(command, { skill: Number(args["opponent-skill"]) });
  const student = await NodeUciEngine.start(command, { skill: Number(args["student-skill"]) });
  // --verify: Stockfish 11's classical evaluation checks strategic lessons (as in the app).
  const classical = args.verify
    ? await NodeUciEngine.start(
        `node ${createRequire(import.meta.url).resolve("stockfish11/src/stockfish.asm.js")}`,
      )
    : undefined;
  const engines: Engines = classical ? { analyst, weak, classical } : { analyst, weak };
  const configs: [string, boolean][] = [["teaching opponent", true]];
  if (args.compare) configs.push(["no level-up (control)", false]);

  const started = performance.now();
  const runs: Record<string, GameRow[]> = {};
  for (const [name, levelUp] of configs) {
    runs[name] = [];
    for (let g = 0; g < Number(args.games); g++) {
      const row = await playGame(g, levelUp, engines, student);
      runs[name].push(row);
      console.log(`[${name}] game ${g + 1}/${args.games}: ${row.plies} plies, ${row.lessons.length} lessons`);
    }
  }
  await Promise.all([analyst.close(), weak.close(), student.close(), classical?.close()]);
  const seconds = (performance.now() - started) / 1000;

  const summaries = Object.fromEntries(Object.entries(runs).map(([k, v]) => [k, summarise(v)]));
  const names = Object.keys(summaries);
  const rows: [keyof ReturnType<typeof summarise>, string][] = [
    ["lessonsPerGame", "Lessons per game"],
    ["consequence", "Consequence lessons"],
    ["landed", "…of which landed in the real game"],
    ["medianDelay", "Median moves from mistake to consequence"],
    ["maxDelay", "Longest delay (moves)"],
    ["missedChance", "Missed-chance lessons"],
    ["levelledShare", "Share of opponent moves levelled up"],
    ["msPerUserMove", "Time per user move incl. engine (ms)"],
  ];
  const md = [
    "# Simulation report (TypeScript core)",
    "",
    `${args.games} games per configuration. Student: Stockfish skill ${args["student-skill"]} ` +
      `(${args["student-movetime"]} ms/move). Opponent normal mode: skill ${args["opponent-skill"]}. ` +
      `Analysis depth ${args.depth}. Max ${args["max-moves"]} moves per game. ` +
      `Strategic lessons ${args.verify ? "checked by the classical evaluation" : "not checked"}. ` +
      `Took ${seconds.toFixed(0)} s.`,
    "",
    `| Metric | ${names.join(" | ")} |`,
    `|---|${names.map(() => "---|").join("")}`,
    ...rows.map(([k, label]) => `| ${label} | ${names.map((n) => String(summaries[n]![k])).join(" | ")} |`),
  ];
  for (const n of names) {
    const s = summaries[n]!;
    md.push(
      "",
      `## ${n}`,
      "",
      `- Consequence lesson outcomes: ${JSON.stringify(s.consequenceStatus)}`,
      `- Missed-chance outcomes: ${JSON.stringify(s.missedStatus)}`,
      `- Features: ${JSON.stringify(s.features)}`,
      `- Principles: ${JSON.stringify(s.principles)}`,
    );
  }
  mkdirSync(args.out!, { recursive: true });
  writeFileSync(join(args.out!, "simulation.md"), md.join("\n") + "\n");
  writeFileSync(join(args.out!, "simulation.json"), JSON.stringify(runs, null, 1));
  console.log(md.slice(0, 6 + rows.length).join("\n"));
  console.log(`\nFull report: ${join(args.out!, "simulation.md")}`);
}

await main();
