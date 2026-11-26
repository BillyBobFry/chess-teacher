/**
 * Lesson benchmark: run `diagnose` on every dev item and keep the dossiers, so the concept
 * recipes (which read only the mistake kind and the claims) can be re-run in seconds with
 * `concepts-eval.ts` instead of searching again. Re-run this after changing the probes.
 *
 * Dev only: test is never cached per item.
 *
 * Usage: tsx src/bench/dossiers.ts [--jobs 6]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { DIAGNOSE_CONFIG, Game, STANDARD_START, diagnose, type Dossier } from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import type { BenchItemInput } from "./teacher.ts";

const { values: args } = parseArgs({
  options: {
    bench: { type: "string", default: "bench" },
    jobs: { type: "string", default: "6" },
  },
});

async function dossierFor(item: BenchItemInput): Promise<Dossier | null> {
  const engine = await NodeUciEngine.start(findStockfish(), { threads: 1, hashMb: 64 });
  try {
    const last = item.moves_before.at(-1);
    const previous =
      last === undefined
        ? null
        : { fen: new Game(STANDARD_START, item.moves_before.slice(0, -1)).fen, move: last };
    return await diagnose(engine, item.fen, item.played, previous, DIAGNOSE_CONFIG);
  } finally {
    await engine.close();
  }
}

async function main() {
  const dir = join(args.bench ?? "bench", "dev");
  const items = JSON.parse(readFileSync(join(dir, "items.json"), "utf8")) as (BenchItemInput & {
    type: string;
  })[];
  const out: Record<string, Dossier | null> = {};
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const item = items[next++];
      if (item) out[item.id] = await dossierFor(item);
    }
  };
  await Promise.all(Array.from({ length: Number(args.jobs) }, worker));
  writeFileSync(join(dir, "dossiers.json"), JSON.stringify(out));
  console.log(`${Object.keys(out).length} dossiers, ${Object.values(out).filter(Boolean).length} flagged`);
}

await main();
