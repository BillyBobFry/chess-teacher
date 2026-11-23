/**
 * Node adapter: runs a UCI engine as a child process. Works with a native Stockfish
 * binary or the WASM build run under Node (`node stockfish-19-lite-single.js`).
 * Used by tests, simulations and benchmarks; the browser gets a Web Worker adapter.
 */

import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import type { Candidate, Engine } from "@chess-teacher/core";
import { AnalysisCollector } from "./uci.ts";

export interface NodeEngineOptions {
  /** Stockfish "Skill Level" (0–20); omit for full strength. */
  skill?: number;
  threads?: number;
}

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

export class NodeUciEngine implements Engine {
  private readonly proc: ChildProcessWithoutNullStreams;
  private readonly waiters: { match: (line: string) => boolean; resolve: (line: string) => void }[] = [];
  private listener: ((line: string) => void) | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private multipv = 1;

  private constructor(command: string, args: string[]) {
    this.proc = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    const rl = createInterface({ input: this.proc.stdout });
    rl.on("line", (line) => {
      this.listener?.(line);
      const i = this.waiters.findIndex((w) => w.match(line));
      if (i !== -1) this.waiters.splice(i, 1)[0]!.resolve(line);
    });
  }

  /** Start an engine. `command` may include arguments, e.g. "node path/to/stockfish.js". */
  static async start(command = findStockfish(), opts: NodeEngineOptions = {}): Promise<NodeUciEngine> {
    const [cmd, ...args] = command.split(" ");
    const engine = new NodeUciEngine(cmd!, args);
    engine.send("uci");
    await engine.waitFor((l) => l === "uciok");
    engine.send(`setoption name Threads value ${opts.threads ?? 1}`);
    if (opts.skill !== undefined) engine.send(`setoption name Skill Level value ${opts.skill}`);
    await engine.ready();
    return engine;
  }

  analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]> {
    return this.serial(async () => {
      if (opts.multipv !== this.multipv) {
        this.send(`setoption name MultiPV value ${opts.multipv}`);
        this.multipv = opts.multipv;
      }
      const collector = new AnalysisCollector();
      this.listener = (line) => collector.add(line);
      this.send(`position fen ${fen}`);
      this.send(`go depth ${opts.depth}`);
      await this.waitFor((l) => l.startsWith("bestmove"));
      this.listener = null;
      return collector.candidates();
    });
  }

  play(fen: string, opts: { movetimeMs: number }): Promise<string> {
    return this.serial(async () => {
      if (this.multipv !== 1) {
        this.send("setoption name MultiPV value 1");
        this.multipv = 1;
      }
      this.send(`position fen ${fen}`);
      this.send(`go movetime ${opts.movetimeMs}`);
      const line = await this.waitFor((l) => l.startsWith("bestmove"));
      return line.split(/\s+/)[1]!;
    });
  }

  async close(): Promise<void> {
    this.send("quit");
    await new Promise<void>((resolve) => {
      if (this.proc.exitCode !== null) resolve();
      else this.proc.once("exit", () => resolve());
    });
  }

  private send(cmd: string): void {
    this.proc.stdin.write(`${cmd}\n`);
  }

  private async ready(): Promise<void> {
    this.send("isready");
    await this.waitFor((l) => l === "readyok");
  }

  private waitFor(match: (line: string) => boolean): Promise<string> {
    return new Promise((resolve) => this.waiters.push({ match, resolve }));
  }

  /** One command sequence at a time: UCI is a single conversation. */
  private serial<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => undefined);
    return run;
  }
}
