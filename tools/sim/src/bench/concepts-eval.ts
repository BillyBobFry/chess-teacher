/**
 * Lesson benchmark: re-run the concept recipes over the cached dev dossiers
 * (`dossiers.ts`) and score the main concept and its family against the annotators, by
 * mistake kind. `--misses` lists each item where the concept is wrong, with the claims the
 * recipe saw.
 *
 * Usage: tsx src/bench/concepts-eval.ts [--misses] [--kind positional]
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { CONCEPT_FAMILIES, chooseConcepts, type Claim, type Dossier } from "@chess-teacher/core";

const { values: args } = parseArgs({
  options: {
    bench: { type: "string", default: "bench" },
    misses: { type: "boolean", default: false },
    picks: { type: "boolean", default: false },
    kind: { type: "string" },
  },
});

interface Label {
  agreed: string[];
  families: string[];
}

const familyOf = new Map<string, string>(
  Object.entries(CONCEPT_FAMILIES).flatMap(([f, ids]) => ids.map((id): [string, string] => [id, f])),
);

const brief = (c: Claim): string => {
  switch (c.kind) {
    case "punishment":
      return `punish(lost ${c.lost}${c.outcome.mates ? ", mate" : ""}${c.outcome.motifs.length ? `, ${c.outcome.motifs.map((m) => m.motif).join("/")}` : ""})`;
    case "missed_win":
      return `win(+${c.gained}${c.outcome.mates ? ", mate" : ""}${c.outcome.motifs.length ? `, ${c.outcome.motifs.map((m) => m.motif).join("/")}` : ""})`;
    case "best_line":
      return c.outcome.motifs.length ? `best(${c.outcome.motifs.map((m) => m.motif).join("/")})` : "best";
    case "threat":
      return `threat(${c.outcome.mates ? "mate" : `wins ${c.wins}`}, swing ${Math.round(c.swing)}${c.ignored ? ", ignored" : ""})`;
    case "count":
      return `count(${c.attackers}v${c.defenders}${c.moved ? ", moved" : ""})`;
    case "passed_pawn":
    case "rook_seventh":
      return `${c.kind}(${c.side})`;
    case "tempo":
      return `tempo(${c.by})`;
    default:
      return c.kind;
  }
};

function main() {
  const dir = join(args.bench ?? "bench", "dev");
  const dossiers = JSON.parse(readFileSync(join(dir, "dossiers.json"), "utf8")) as Record<
    string,
    Dossier | null
  >;
  const labels = JSON.parse(readFileSync(join(dir, "concepts.json"), "utf8")) as Record<string, Label>;
  const items = JSON.parse(readFileSync(join(dir, "items.json"), "utf8")) as {
    id: string;
    type: string;
    played_san: string;
  }[];

  // Items labelled in the first round (packets 1-3), the ones the earlier recipes were tuned on.
  const packets = JSON.parse(readFileSync(join(dir, "packets.json"), "utf8")) as Record<string, string[]>;
  const firstRound = new Set(["1", "2", "3"].flatMap((k) => packets[k] ?? []));
  const halves = { first: { c: 0, n: 0 }, later: { c: 0, n: 0 } };
  const tally = new Map<string, { c: number; cn: number; f: number; fn: number; none: number }>();
  const misses: string[] = [];
  const byPick = new Map<string, { n: number; hit: number; fam: number }>();
  for (const item of items) {
    const d = dossiers[item.id];
    const label = labels[item.id];
    if (!d || !label || item.type === "quiet") continue;
    const { concept, secondary } = chooseConcepts(d.kind, d.claims);
    const t = tally.get(d.kind) ?? { c: 0, cn: 0, f: 0, fn: 0, none: 0 };
    const fam = concept ? (familyOf.get(concept) ?? null) : null;
    if (concept === null) t.none += 1;
    if (label.agreed.length) {
      const p = byPick.get(`${d.kind}:${concept ?? "-"}`) ?? { n: 0, hit: 0, fam: 0 };
      p.n += 1;
      if (concept && label.agreed.includes(concept)) p.hit += 1;
      if (fam && label.families.includes(fam)) p.fam += 1;
      byPick.set(`${d.kind}:${concept ?? "-"}`, p);
      t.cn += 1;
      const half = firstRound.has(item.id) ? halves.first : halves.later;
      half.n += 1;
      if (concept && label.agreed.includes(concept)) half.c += 1;
      if (concept && label.agreed.includes(concept)) t.c += 1;
      else if (!args.kind || args.kind === d.kind)
        misses.push(
          `${item.id} ${item.played_san} [${d.kind}] picked ${concept ?? "-"}${secondary ? `+${secondary}` : ""} | agreed ${label.agreed.join(",")} | ${d.claims.map(brief).join(" ")}`,
        );
    }
    if (label.families.length) {
      t.fn += 1;
      if (fam && label.families.includes(fam)) t.f += 1;
    }
    tally.set(d.kind, t);
  }
  const pct = (a: number, b: number) => `${a}/${b} (${b ? Math.round((100 * a) / b) : 0}%)`;
  let c = 0,
    cn = 0,
    f = 0,
    fn = 0;
  for (const [kind, t] of tally) {
    console.log(
      `${kind.padEnd(16)} concept ${pct(t.c, t.cn).padEnd(12)} family ${pct(t.f, t.fn).padEnd(12)} no concept ${t.none}`,
    );
    c += t.c;
    cn += t.cn;
    f += t.f;
    fn += t.fn;
  }
  console.log(`${"all".padEnd(16)} concept ${pct(c, cn).padEnd(12)} family ${pct(f, fn)}`);
  console.log(
    `first-round items ${pct(halves.first.c, halves.first.n)}, later items ${pct(halves.later.c, halves.later.n)}`,
  );
  if (args.picks)
    for (const [k, p] of [...byPick].sort((a, b) => b[1].n - a[1].n))
      console.log(`  ${k.padEnd(36)} ${p.n}  right ${p.hit}  family ${p.fam}`);
  if (args.misses) console.log("\n" + misses.join("\n"));
}

main();
