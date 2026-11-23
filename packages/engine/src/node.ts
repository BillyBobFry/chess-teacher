/**
 * Node transport: runs a UCI engine as a child process. Works with a native Stockfish
 * binary or the WASM build under Node (`node stockfish-19-lite-single.js`).
 * Used by tests, simulations and benchmarks; the browser uses a Web Worker transport.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { UciEngine, type UciEngineOptions, type UciTransport } from "./uci-engine.ts";

export function findStockfish(): string {
  const candidates = [
    process.env.STOCKFISH_PATH,
    "/usr/games/stockfish",
    "/usr/bin/stockfish",
    "/usr/local/bin/stockfish",
    "/opt/homebrew/bin/stockfish",
  ];
  const found = candidates.find((c) => c && existsSync(c));
  if (!found) {
    throw new Error("Stockfish not found. Install it (apt/brew install stockfish) or set STOCKFISH_PATH.");
  }
  return found;
}

export function processTransport(command: string): UciTransport {
  const [cmd, ...args] = command.split(" ");
  const proc = spawn(cmd!, args, { stdio: ["pipe", "pipe", "pipe"] });
  const lines = createInterface({ input: proc.stdout });
  return {
    send: (c) => void proc.stdin.write(`${c}\n`),
    onLine: (handler) => void lines.on("line", handler),
    close: () =>
      new Promise<void>((resolve) => {
        if (proc.exitCode !== null) resolve();
        else proc.once("exit", () => resolve());
      }),
  };
}

/** A UCI engine running as a child process. `command` may include arguments. */
export const NodeUciEngine = {
  start: (command = findStockfish(), opts: UciEngineOptions = {}): Promise<UciEngine> =>
    UciEngine.start(processTransport(command), opts),
};
export type NodeUciEngine = UciEngine;
