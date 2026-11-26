/**
 * Record whole games for the replay tests (takeback, rewind, resume, verification): a weak
 * Stockfish "student" plays the teaching opponent through the TypeScript core, and every
 * engine call the core makes is saved with its result. The tests replay those results with
 * RecordedEngine, so they are fast, need no engine, and give the same game every time.
 *
 * Re-record when a change to the core changes which positions it asks the engine about
 * (the replay then fails with "no recorded analysis"):
 *
 *   pnpm --filter @chess-teacher/sim exec tsx src/record-games.ts --engine "node <stockfish.js>"
 */

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  DEFAULT_CONFIG,
  gameOf,
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  type Candidate,
  type Engine,
  type Engines,
  type SessionState,
  type TeachingConfig,
} from "@chess-teacher/core";
import type { RecordedCall } from "@chess-teacher/engine";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { lessonFeatureLabel } from "./prototype-text.ts";
import type { RecordedGame, RecordedStep } from "./recorded-game.ts";

const { values: args } = parseArgs({
  options: {
    games: { type: "string", default: "8" },
    "student-skill": { type: "string", default: "4" },
    "opponent-skill": { type: "string", default: "3" },
    depth: { type: "string", default: "10" },
    "max-moves": { type: "string", default: "40" },
    engine: { type: "string" },
    out: { type: "string", default: join(import.meta.dirname, "..", "games") },
  },
});

class RecordingEngine implements Engine {
  readonly calls: RecordedCall[] = [];
  constructor(private readonly engine: Engine) {}

  async analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]> {
    const result = await this.engine.analyse(fen, opts);
    this.calls.push({ op: "analyse", fen, ...opts, result });
    return result;
  }

  async play(fen: string, opts: { movetimeMs: number; history: readonly string[] }): Promise<string> {
    const result = await this.engine.play(fen, opts);
    this.calls.push({ op: "play", fen, movetimeMs: opts.movetimeMs, result });
    return result;
  }
}

async function recordGame(n: number, analystEngine: Engine, weakEngine: Engine, student: Engine) {
  const userColour = n % 2 === 0 ? "w" : "b";
  const config: TeachingConfig = { ...DEFAULT_CONFIG, analysisDepth: Number(args.depth) };
  const analyst = new RecordingEngine(analystEngine);
  const weak = new RecordingEngine(weakEngine);
  const engines: Engines = { analyst, weak };
  const steps: RecordedStep[] = [];
  let state: SessionState = newSession({ userColour, config });
  for (;;) {
    const game = gameOf(state);
    if (game.isGameOver() || Number(game.fen.split(" ")[5]) > Number(args["max-moves"])) break;
    if (game.turn === userColour) {
      state = (await startUserTurn(state, engines)).state;
      steps.push({ type: "startUserTurn" });
      const move = await student.play(game.fen, { movetimeMs: 10, history: game.previousFens() });
      state = (await userMove(state, move, engines)).state;
      steps.push({ type: "userMove", move });
    } else {
      state = (await opponentMove(state, engines)).state;
      steps.push({ type: "opponentMove" });
    }
  }
  const recorded: RecordedGame = {
    userColour,
    config,
    steps,
    engineCalls: { analyst: analyst.calls, weak: weak.calls },
  };
  return { recorded, lessons: state.lessons };
}

async function main() {
  const command = args.engine ?? findStockfish();
  const analyst = await NodeUciEngine.start(command);
  const weak = await NodeUciEngine.start(command, { skill: Number(args["opponent-skill"]) });
  const student = await NodeUciEngine.start(command, { skill: Number(args["student-skill"]) });
  mkdirSync(args.out, { recursive: true });
  for (const f of readdirSync(args.out)) if (f.startsWith("game-")) rmSync(join(args.out, f));
  for (let g = 0; g < Number(args.games); g++) {
    const { recorded, lessons } = await recordGame(g, analyst, weak, student);
    const name = `game-${String(g + 1).padStart(2, "0")}.json`;
    writeFileSync(join(args.out, name), JSON.stringify(recorded) + "\n");
    const summary = lessons.map((l) => `${lessonFeatureLabel(l)}/${l.kind}/${l.status}`).join(", ");
    console.log(`${name}: ${recorded.steps.length} steps; lessons: ${summary || "none"}`);
  }
  await Promise.all([analyst.close(), weak.close(), student.close()]);
}

await main();
