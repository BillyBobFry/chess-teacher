/**
 * Stockfish in the browser: the WASM "lite, single-threaded" build, each instance in its
 * own Web Worker so analysis never blocks the UI. Two instances: one at full strength
 * for analysis, one weakened for the opponent's normal moves.
 */

import type { ClassicalEval, Engines } from "@chess-teacher/core";
import { UciEngine, type UciTransport } from "@chess-teacher/engine";

const SCRIPT = `${import.meta.env.BASE_URL}stockfish/stockfish-19-lite-single.js`;
const SCRIPT_11 = `${import.meta.env.BASE_URL}stockfish11/stockfish.js`;

function workerTransport(script = SCRIPT): UciTransport {
  const worker = new Worker(script);
  return {
    send: (command) => worker.postMessage(command),
    onLine: (handler) => {
      worker.onmessage = (e: MessageEvent) => {
        for (const line of String(e.data).split("\n")) if (line) handler(line);
      };
    },
    close: () => worker.terminate(),
  };
}

/** A middlegame position used to measure how fast this device analyses. */
const BENCH_FEN = "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 9";

let analyst: Promise<{ engine: UciEngine; depth: number }> | null = null;
let weak: { skill: number; engine: Promise<UciEngine> } | null = null;

/**
 * Analysis depth for this device: 12 normally, 10 if a depth-12 analysis is slow
 * (older phones). Measured once, when the engine first starts.
 */
async function startAnalyst(): Promise<{ engine: UciEngine; depth: number }> {
  const engine = await UciEngine.start(workerTransport(), { hashMb: 16 });
  const t = performance.now();
  await engine.analyse(BENCH_FEN, { depth: 12, multipv: 3 });
  const ms = performance.now() - t;
  return { engine, depth: ms > 1500 ? 10 : 12 };
}

/**
 * Stockfish 11's classical evaluation, the second opinion on strategic lessons. Started on
 * first use (most games need it a few times at most), so its 3.7 MB only loads when needed.
 */
let classicalEngine: Promise<UciEngine> | null = null;
const classical: ClassicalEval = {
  evalTrace: async (fen) => {
    classicalEngine ??= UciEngine.start(workerTransport(SCRIPT_11));
    return (await classicalEngine).evalTrace(fen);
  },
};

export async function getEngines(opponentSkill: number): Promise<{ engines: Engines; depth: number }> {
  analyst ??= startAnalyst();
  if (!weak || weak.skill !== opponentSkill) {
    const previous = weak;
    weak = {
      skill: opponentSkill,
      engine: UciEngine.start(workerTransport(), { skill: opponentSkill, hashMb: 8 }),
    };
    if (previous) void previous.engine.then((e) => e.close());
  }
  const [{ engine, depth }, weakEngine] = await Promise.all([analyst, weak.engine]);
  return { engines: { analyst: engine, weak: weakEngine, classical }, depth };
}
