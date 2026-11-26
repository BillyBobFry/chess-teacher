/**
 * Lesson benchmark: packets for an LLM concept picker. Each flagged dev item gets what the
 * app's narrator would see (the position, the last moves, the move and the verified claims
 * in plain English) and none of the labels or the recipes' own pick. The vocabulary goes in
 * a separate file with each concept's meaning and no examples, since the examples came from
 * annotators' words.
 *
 * Writes `bench/dev/llm/packets-<n>.md`, `bench/dev/llm/vocabulary.md` and
 * `bench/dev/llm/packets.json` (ids per packet, in order). Dev only.
 *
 * Usage: tsx src/bench/llm-packets.ts [--size 15]
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { Game, STANDARD_START, sanOf, variationSan, type Dossier } from "@chess-teacher/core";
import { render } from "./teacher-next.ts";

const { values: args } = parseArgs({
  options: {
    bench: { type: "string", default: "bench" },
    size: { type: "string", default: "15" },
  },
});

interface Item {
  id: string;
  type: string;
  fen: string;
  moves_before: string[];
  played: string;
}

function main() {
  const bench = args.bench ?? "bench";
  const dir = join(bench, "dev");
  const out = join(dir, "llm");
  mkdirSync(out, { recursive: true });
  const items = JSON.parse(readFileSync(join(dir, "items.json"), "utf8")) as Item[];
  const dossiers = JSON.parse(readFileSync(join(dir, "dossiers.json"), "utf8")) as Record<
    string,
    Dossier | null
  >;
  const vocab = JSON.parse(readFileSync(join(bench, "vocabulary.json"), "utf8")) as {
    concepts: { id: string; family: string; means: string }[];
  };

  writeFileSync(
    join(out, "vocabulary.md"),
    "# Concept vocabulary\n\n" +
      vocab.concepts
        .filter((c) => c.id !== "other")
        .map((c) => `- \`${c.id}\` (${c.family}): ${c.means}`)
        .join("\n") +
      "\n",
  );

  const flagged = items.filter((i) => dossiers[i.id]);
  const size = Number(args.size);
  const packets: Record<string, string[]> = {};
  for (let p = 0; p * size < flagged.length; p++) {
    const chunk = flagged.slice(p * size, (p + 1) * size);
    packets[String(p + 1)] = chunk.map((i) => i.id);
    const text = chunk.map((item, n) => {
      const d = dossiers[item.id];
      if (!d) return "";
      const recent = item.moves_before.slice(-6);
      const recentFrom = new Game(STANDARD_START, item.moves_before.slice(0, -6)).fen;
      return [
        `## ${n + 1}. ${item.id}`,
        "",
        `- Position (FEN, before the move): \`${item.fen}\``,
        `- ${d.user === "w" ? "White" : "Black"} to move. The player is ${d.user === "w" ? "White" : "Black"}.`,
        `- Last moves: ${recent.length ? variationSan(recentFrom, recent) : "(start of game)"}`,
        `- The player's move: **${sanOf(item.fen, item.played)}**`,
        `- What the analysis verified: ${render(d, false)}`,
        "",
      ].join("\n");
    });
    writeFileSync(join(out, `packets-${p + 1}.md`), `# Packet ${p + 1}\n\n${text.join("\n")}`);
  }
  writeFileSync(join(out, "packets.json"), JSON.stringify(packets, null, 1));
  console.log(`${flagged.length} items in ${Object.keys(packets).length} packets`);
}

main();
