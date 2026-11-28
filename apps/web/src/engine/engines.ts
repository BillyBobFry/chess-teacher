/**
 * The engines a game runs on, all in Web Workers so they never block the UI:
 * - Stockfish at full strength for analysis, and for the opponent's moves while it punishes
 *   a mistake (the WASM "lite, single-threaded" build).
 * - Maia-3 for the opponent's normal moves, at the game's rating (maia.ts).
 * - Stockfish 11's classical evaluation, the second opinion on strategic lessons.
 */

import type { ClassicalEval, Engines } from "@chess-teacher/core";
import { MaiaEngine, UciEngine, type MaiaNetwork, type UciTransport } from "@chess-teacher/engine";
import { startMaiaNetwork } from "./maia.ts";

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
let maia: Promise<MaiaNetwork> | null = null;

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

function started(): { analyst: Promise<{ engine: UciEngine; depth: number }>; maia: Promise<MaiaNetwork> } {
  analyst ??= startAnalyst();
  if (!maia) {
    const network = startMaiaNetwork();
    maia = network;
    // A failed download is reported when a game needs the opponent, and tried again then.
    network.catch(() => {
      if (maia === network) maia = null;
    });
  }
  return { analyst, maia };
}

/**
 * Start the engines without waiting for them, so they're ready by the time the player has
 * chosen their game: the opponent's network is a 9 MB download the first time.
 */
export function startEngines(): void {
  started();
}

export async function getEngines(opponentRating: number): Promise<{ engines: Engines; depth: number }> {
  const engines = started();
  const [{ engine, depth }, network] = await Promise.all([engines.analyst, engines.maia]);
  // Temperature 1: Maia samples its move as it was trained to, so it errs like a player of
  // that rating. It assumes the player is rated the same.
  const opponent = new MaiaEngine(network, opponentRating, 1);
  return { engines: { analyst: engine, opponent, classical }, depth };
}
