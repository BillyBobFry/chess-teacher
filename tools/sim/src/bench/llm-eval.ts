/**
 * Lesson benchmark: score an LLM concept picker's picks (`bench/dev/llm/picks-<n>.jsonl`,
 * from the packets `llm-packets.ts` writes) against the annotators, beside the recipes on
 * the same items. Picks are matched to items by their place in the packet, as annotations
 * are. The main concept is scored the way the scorer scores a teacher's.
 *
 * Usage: tsx src/bench/llm-eval.ts [--misses]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { chooseConcepts, type Dossier } from "@chess-teacher/core";

const { values: args } = parseArgs({
  options: {
    bench: { type: "string", default: "bench" },
    misses: { type: "boolean", default: false },
  },
});

interface Pick {
  id: string;
  main: string;
  also: string[];
  why: string;
}

function main() {
  const bench = args.bench ?? "bench";
  const dir = join(bench, "dev");
  const packets = JSON.parse(readFileSync(join(dir, "llm", "packets.json"), "utf8")) as Record<
    string,
    string[]
  >;
  const labels = JSON.parse(readFileSync(join(dir, "concepts.json"), "utf8")) as Record<
    string,
    { agreed: string[]; families: string[] }
  >;
  const dossiers = JSON.parse(readFileSync(join(dir, "dossiers.json"), "utf8")) as Record<
    string,
    Dossier | null
  >;
  const vocab = JSON.parse(readFileSync(join(bench, "vocabulary.json"), "utf8")) as {
    concepts: { id: string; family: string }[];
  };
  const family = new Map(vocab.concepts.map((c) => [c.id, c.family]));

  const tally = new Map<
    string,
    { n: number; llm: number; rules: number; llmFam: number; rulesFam: number; llmAny: number }
  >();
  const misses: string[] = [];
  let missing = 0;
  let unknown = 0;
  for (const [n, ids] of Object.entries(packets)) {
    const file = join(dir, "llm", `picks-${n}.jsonl`);
    const picks = existsSync(file)
      ? readFileSync(file, "utf8")
          .split("\n")
          .filter((l) => l.trim())
          .map((l) => JSON.parse(l) as Pick)
      : [];
    ids.forEach((id, i) => {
      const pick = picks[i];
      const label = labels[id];
      const d = dossiers[id];
      if (!pick || pick.id.split("-")[1] !== id.split("-")[1]) {
        missing += 1;
        return;
      }
      if (!family.has(pick.main)) unknown += 1;
      if (!d || !label?.agreed.length) return;
      const rules = chooseConcepts(d.kind, d.claims).concept;
      const t = tally.get(d.kind) ?? { n: 0, llm: 0, rules: 0, llmFam: 0, rulesFam: 0, llmAny: 0 };
      t.n += 1;
      const llmRight = label.agreed.includes(pick.main);
      if (llmRight) t.llm += 1;
      if ([pick.main, ...pick.also].some((c) => label.agreed.includes(c))) t.llmAny += 1;
      if (rules && label.agreed.includes(rules)) t.rules += 1;
      if (label.families.includes(family.get(pick.main) ?? "")) t.llmFam += 1;
      if (rules && label.families.includes(family.get(rules) ?? "")) t.rulesFam += 1;
      tally.set(d.kind, t);
      if (!llmRight)
        misses.push(
          `${id} [${d.kind}] llm ${pick.main} | rules ${rules ?? "-"} | agreed ${label.agreed.join(",")} | ${pick.why}`,
        );
    });
  }
  const pct = (a: number, b: number) => `${a}/${b} (${b ? Math.round((100 * a) / b) : 0}%)`.padEnd(13);
  const all = { n: 0, llm: 0, rules: 0, llmFam: 0, rulesFam: 0, llmAny: 0 };
  console.log(
    "kind             concept: llm      rules         family: llm   rules         llm main or also",
  );
  for (const [kind, t] of tally) {
    console.log(
      `${kind.padEnd(16)} ${pct(t.llm, t.n)} ${pct(t.rules, t.n)} ${pct(t.llmFam, t.n)} ${pct(t.rulesFam, t.n)} ${pct(t.llmAny, t.n)}`,
    );
    for (const k of Object.keys(all) as (keyof typeof all)[]) all[k] += t[k];
  }
  console.log(
    `${"all".padEnd(16)} ${pct(all.llm, all.n)} ${pct(all.rules, all.n)} ${pct(all.llmFam, all.n)} ${pct(all.rulesFam, all.n)} ${pct(all.llmAny, all.n)}`,
  );
  console.log(`${missing} items without a pick, ${unknown} picks outside the vocabulary`);
  if (args.misses) console.log("\n" + misses.join("\n"));
}

main();
