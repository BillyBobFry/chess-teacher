/**
 * Lesson benchmark: turn the annotators' concepts into the labels the scorer reads.
 *
 * Reads `bench/<split>/annotations/<chunk>-<annotator>.jsonl` (the annotators' own words) and
 * `bench/<split>/mapped.jsonl` (the same lines mapped to `bench/vocabulary.json` by a
 * separate agent), and writes `bench/<split>/concepts.json`: per item, the concepts and
 * families at least two of the three annotators named (as their main idea or a secondary
 * one), and how many said the move was worth a lesson.
 *
 * Annotations are matched to items by their place in the packet (`packets.json`), not by
 * the id an annotator wrote, so a mistyped id can't move a label to another item. Test prints totals
 * only.
 *
 * Usage: tsx src/bench/agree.ts --split dev
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    split: { type: "string", default: "dev" },
    bench: { type: "string", default: "bench" },
  },
});

interface Annotation {
  id: string;
  worth_a_lesson: "yes" | "no" | "unsure";
}

interface Mapped {
  file: string;
  line: number;
  main: string;
  also: string[];
}

interface Vocabulary {
  concepts: { id: string; family: string }[];
}

const lines = (path: string): string[] =>
  readFileSync(path, "utf8")
    .split("\n")
    .filter((l) => l.trim());

function main() {
  const bench = args.bench ?? "bench";
  const dir = join(bench, args.split ?? "dev");
  const packets = JSON.parse(readFileSync(join(dir, "packets.json"), "utf8")) as Record<string, string[]>;
  const vocab = JSON.parse(readFileSync(join(bench, "vocabulary.json"), "utf8")) as Vocabulary;
  const family = new Map(vocab.concepts.map((c) => [c.id, c.family]));
  const mapped = new Map(
    lines(join(dir, "mapped.jsonl")).map((l) => {
      const m = JSON.parse(l) as Mapped;
      return [`${m.file}#${m.line}`, m];
    }),
  );

  const votes = new Map<string, { worth: number; concepts: string[][] }>();
  let unmapped = 0;
  let misfiled = 0;
  for (const file of readdirSync(join(dir, "annotations"))
    .filter((f) => f.endsWith(".jsonl"))
    .sort()) {
    const chunk = Number(file.split("-")[0]);
    const expected = packets[String(chunk)] ?? [];
    const anns = lines(join(dir, "annotations", file)).map((l) => JSON.parse(l) as Annotation);
    if (anns.length !== expected.length)
      throw new Error(`${file}: ${anns.length} lines for ${expected.length} items`);
    anns.forEach((a, i) => {
      const id = expected[i] ?? "";
      // The hash part of the id must match; the band prefix is the part annotators mistype.
      if (a.id !== id) {
        if (a.id.split("-")[1] !== id.split("-")[1])
          throw new Error(`${file} line ${i + 1}: ${a.id} where ${id} was expected`);
        misfiled += 1;
      }
      const m = mapped.get(`${file}#${i + 1}`);
      if (!m) unmapped += 1;
      const v = votes.get(id) ?? { worth: 0, concepts: [] };
      v.worth += a.worth_a_lesson === "yes" ? 1 : 0;
      v.concepts.push(
        m ? [...new Set([m.main, ...m.also].filter((c) => c !== "other" && c !== "none"))] : [],
      );
      votes.set(id, v);
    });
  }

  const out: Record<string, { agreed: string[]; families: string[]; teachable_votes: number }> = {};
  for (const [id, v] of votes) {
    const count = (keys: string[][]) => {
      const n = new Map<string, number>();
      for (const ks of keys) for (const k of new Set(ks)) n.set(k, (n.get(k) ?? 0) + 1);
      return [...n].filter(([, c]) => c >= 2).map(([k]) => k);
    };
    out[id] = {
      agreed: count(v.concepts),
      families: count(v.concepts.map((cs) => cs.map((c) => family.get(c) ?? "other"))),
      teachable_votes: v.worth,
    };
  }
  writeFileSync(join(dir, "concepts.json"), JSON.stringify(out, null, 1));
  const withConcept = Object.values(out).filter((o) => o.agreed.length > 0).length;
  console.log(
    `${args.split}: ${votes.size} items, ${withConcept} with an agreed concept; ${unmapped} annotations unmapped, ${misfiled} ids corrected`,
  );
}

main();
