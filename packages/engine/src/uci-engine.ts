/**
 * A UCI engine over any line-based transport: a child process in Node, a Web Worker
 * running Stockfish WASM in the browser, or a native module on mobile later.
 * Platform-independent: transports are supplied by the caller.
 */

import type { Candidate, Engine } from "@chess-teacher/core";
import { AnalysisCollector } from "./uci.ts";

export interface UciTransport {
  send(command: string): void;
  /** Register the handler for every line the engine prints. Called once. */
  onLine(handler: (line: string) => void): void;
  close(): void | Promise<void>;
}

export interface UciEngineOptions {
  /** Stockfish "Skill Level" (0–20); omit for full strength. */
  skill?: number;
  threads?: number;
  /** Hash table size in MB (keep small in browsers). */
  hashMb?: number;
}

export class UciEngine implements Engine {
  private readonly waiters: { match: (line: string) => boolean; resolve: (line: string) => void }[] = [];
  private listener: ((line: string) => void) | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private multipv = 1;

  private constructor(private readonly transport: UciTransport) {
    transport.onLine((line) => {
      this.listener?.(line);
      const i = this.waiters.findIndex((w) => w.match(line));
      if (i !== -1) this.waiters.splice(i, 1)[0]!.resolve(line);
    });
  }

  static async start(transport: UciTransport, opts: UciEngineOptions = {}): Promise<UciEngine> {
    const engine = new UciEngine(transport);
    engine.transport.send("uci");
    await engine.waitFor((l) => l === "uciok");
    engine.transport.send(`setoption name Threads value ${opts.threads ?? 1}`);
    if (opts.hashMb !== undefined) engine.transport.send(`setoption name Hash value ${opts.hashMb}`);
    if (opts.skill !== undefined) engine.transport.send(`setoption name Skill Level value ${opts.skill}`);
    engine.transport.send("isready");
    await engine.waitFor((l) => l === "readyok");
    return engine;
  }

  analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]> {
    return this.serial(async () => {
      this.setMultipv(opts.multipv);
      const collector = new AnalysisCollector();
      this.listener = (line) => collector.add(line);
      this.transport.send(`position fen ${fen}`);
      this.transport.send(`go depth ${opts.depth}`);
      await this.waitFor((l) => l.startsWith("bestmove"));
      this.listener = null;
      return collector.candidates();
    });
  }

  play(fen: string, opts: { movetimeMs: number }): Promise<string> {
    return this.serial(async () => {
      this.setMultipv(1);
      this.transport.send(`position fen ${fen}`);
      this.transport.send(`go movetime ${opts.movetimeMs}`);
      const line = await this.waitFor((l) => l.startsWith("bestmove"));
      return line.split(/\s+/)[1]!;
    });
  }

  async close(): Promise<void> {
    this.transport.send("quit");
    await this.transport.close();
  }

  private setMultipv(n: number): void {
    if (n !== this.multipv) {
      this.transport.send(`setoption name MultiPV value ${n}`);
      this.multipv = n;
    }
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
