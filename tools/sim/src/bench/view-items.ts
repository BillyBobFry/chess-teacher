/**
 * Lesson benchmark: print dev items the way a coach would read them, with the cached
 * dossier's lines and claims and the three annotators' own words. Dev only.
 *
 * Usage: tsx src/bench/view-items.ts <id> [<id>...]
 */

import { readFileSync, readdirSync } from "node:fs";
import { variationSan, sanOf, nullMoveFen, Game, type Dossier } from "@chess-teacher/core";
const ids = process.argv.slice(2);
const dossiers = JSON.parse(readFileSync("bench/dev/dossiers.json", "utf8")) as Record<
  string,
  Dossier | null
>;
const packets = JSON.parse(readFileSync("bench/dev/packets.json", "utf8")) as Record<string, string[]>;
const anns = new Map<string, string[]>();
for (const f of readdirSync("bench/dev/annotations").sort()) {
  const exp = packets[f.split("-")[0] ?? ""] ?? [];
  readFileSync(`bench/dev/annotations/${f}`, "utf8")
    .split("\n")
    .filter(Boolean)
    .forEach((l, i) => {
      const a = JSON.parse(l);
      const id = exp[i] ?? "";
      anns.set(id, [
        ...(anns.get(id) ?? []),
        `${a.concept} / ${(a.also ?? []).join("; ")} :: ${String(a.coach_says).slice(0, 260)}`,
      ]);
    });
}
for (const id of ids) {
  const d = dossiers[id];
  if (!d) {
    console.log(id, "not flagged");
    continue;
  }
  const g = new Game(d.fenBefore);
  g.push(d.userMove);
  console.log(
    `\n== ${id} ${sanOf(d.fenBefore, d.userMove)} [${d.kind}] best ${sanOf(d.fenBefore, d.bestMove)} ${d.fenBefore}`,
  );
  for (const c of d.claims) {
    if (c.kind === "punishment")
      console.log(
        `  punish: ${variationSan(g.fen, c.outcome.line.slice(0, 6))} lost ${c.lost} motifs ${c.outcome.motifs.map((m) => m.motif + "@" + m.index).join(",")}`,
      );
    else if (c.kind === "missed_win" || c.kind === "best_line")
      console.log(
        `  ${c.kind}: ${variationSan(d.fenBefore, c.outcome.line.slice(0, 6))} motifs ${c.outcome.motifs.map((m) => m.motif + "@" + m.index).join(",")}`,
      );
    else if (c.kind === "threat") {
      const nm = nullMoveFen(d.fenBefore);
      console.log(
        `  threat: ${nm ? variationSan(nm, c.outcome.line.slice(0, 5)) : ""} wins ${c.wins} swing ${Math.round(c.swing)} ignored ${c.ignored} motifs ${c.outcome.motifs.map((m) => m.motif).join(",")}`,
      );
    } else console.log(`  ${JSON.stringify(c)}`);
  }
  for (const a of anns.get(id) ?? []) console.log(`  > ${a}`);
}
