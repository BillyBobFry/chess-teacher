/**
 * Lesson benchmark: score a teacher.
 *
 * Reads `bench/<split>/items.json` and, when present, the labels next to it:
 * `motifs.json` (Lichess tagger, by item id) and `concepts.json` (annotators' consensus in
 * the benchmark vocabulary, by item id). `bench/concept-map.json` maps the teacher's own
 * concept ids to the vocabulary.
 *
 * Dev writes per-item results for iterating. Test prints totals only and writes nothing
 * per item, so it can't be tuned to.
 *
 * Usage: tsx src/bench/score.ts --split dev [--teacher current]
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { Chess } from "chess.js";
import { currentTeacher } from "./teacher-current.ts";
import { nextTeacher } from "./teacher-next.ts";
import type { Teacher, TeacherOutput } from "./teacher.ts";

const { values: args } = parseArgs({
  options: {
    split: { type: "string", default: "dev" },
    teacher: { type: "string", default: "current" },
    bench: { type: "string", default: "bench" },
  },
});

type ItemType = "mated" | "loses_material" | "misses_mate" | "misses_material" | "positional" | "quiet";

interface Item {
  id: string;
  type: ItemType;
  band: string;
  fen: string;
  moves_before: string[];
  played: string;
  played_san: string;
  mover: "w" | "b";
  drop: number;
  acceptable: string[];
  candidates: { move: string; uci: string[] }[];
  punishment: { uci: string[] };
}

interface ConceptLabel {
  /** Vocabulary ids at least two of three annotators agreed on (main or secondary). */
  agreed: string[];
  /** Vocabulary families at least two of three annotators agreed on. */
  families: string[];
  /** How many annotators said this was worth a lesson. */
  teachable_votes: number;
}

/**
 * What the winning side wins along the line that decides the item: equal trades cancel (by
 * value, each loss against the nearest equal win), and the first capture of what's left is
 * the win.
 */
function firstWin(item: Item): { move: string; square: string; piece: string } | null {
  const losing = item.type === "mated" || item.type === "loses_material";
  const start = new Chess(item.fen);
  if (losing)
    start.move({ from: item.played.slice(0, 2), to: item.played.slice(2, 4), promotion: item.played[4] });
  const line = losing ? item.punishment.uci : (item.candidates[0]?.uci ?? []);
  const winner = start.turn();
  const value: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const won: { move: string; square: string; piece: string; index: number }[] = [];
  const lost: { piece: string; index: number }[] = [];
  for (const [index, m] of line.entries()) {
    let mv;
    try {
      mv = start.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] });
    } catch {
      break;
    }
    if (!mv.captured) continue;
    if (mv.color === winner) won.push({ move: m, square: mv.to, piece: mv.captured, index });
    else lost.push({ piece: mv.captured, index });
  }
  // A trade is a capture and its recapture, so each loss cancels the equal win nearest it.
  for (const l of lost) {
    let best = -1;
    won.forEach((w, i) => {
      if (value[w.piece] !== value[l.piece]) return;
      if (best === -1 || Math.abs(w.index - l.index) < Math.abs((won[best]?.index ?? 0) - l.index)) best = i;
    });
    if (best !== -1) won.splice(best, 1);
  }
  const first = won[0];
  return first ? { move: first.move, square: first.square, piece: first.piece } : null;
}

function keyMove(item: Item): string | undefined {
  return item.type === "mated" || item.type === "loses_material"
    ? item.punishment.uci[0]
    : item.candidates[0]?.move;
}

interface Result {
  id: string;
  type: ItemType;
  band: string;
  drop: number;
  out: TeacherOutput;
  checks: Record<string, boolean | null>;
}

/**
 * The teacher's main concept in the vocabulary. `concept-map.json` maps a teacher id to
 * vocabulary ids, or to `family:<name>` when the teacher only names the area.
 */
function mainConcept(
  out: TeacherOutput,
  map: Record<string, string[]>,
  family: Map<string, string>,
): { id: string | null; family: string | null } {
  const first = out.concepts.flatMap((id) =>
    family.has(id) || id.startsWith("family:") ? [id] : (map[id] ?? []),
  )[0];
  if (first === undefined) return { id: null, family: null };
  if (first.startsWith("family:")) return { id: null, family: first.slice("family:".length) };
  return { id: first, family: family.get(first) ?? null };
}

function check(
  item: Item,
  out: TeacherOutput,
  motifs: string[] | null,
  concept: ConceptLabel | null,
  map: Record<string, string[]>,
  family: Map<string, string>,
): Record<string, boolean | null> {
  const quiet = item.type === "quiet";
  const c: Record<string, boolean | null> = {};
  c.flag = quiet ? !out.flagged : out.flagged;
  if (quiet || !out.flagged) return c;
  c.better = out.better !== undefined && item.acceptable.includes(out.better);
  c.severity = item.drop >= 20 ? out.severity !== "small" : null;
  if (item.type !== "positional") {
    const mate = item.type === "mated" || item.type === "misses_mate";
    const win = firstWin(item);
    const key = keyMove(item);
    const namesHow =
      (key !== undefined && out.namedMoves.includes(key)) ||
      (win !== null && out.namedSquares.includes(win.square));
    const namesWhat = mate
      ? out.namedWins.includes("mate")
      : win !== null && out.namedWins.includes(win.piece);
    c.punishment = mate ? namesWhat : namesHow && namesWhat;
  }
  if (motifs && motifs.length) c.motif = out.motifs.some((m) => motifs.includes(m));
  const mine = mainConcept(out, map, family);
  if (concept && concept.agreed.length) c.concept = mine.id !== null && concept.agreed.includes(mine.id);
  if (concept && concept.families.length)
    c.family = mine.family !== null && concept.families.includes(mine.family);
  return c;
}

async function teacherNamed(name: string): Promise<Teacher> {
  if (name === "current") return currentTeacher();
  if (name === "next") return nextTeacher();
  throw new Error(`unknown teacher ${name}`);
}

const readJson = <T>(path: string): T | null =>
  existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : null;

async function main() {
  const dir = join(args.bench ?? "bench", args.split ?? "dev");
  const items = JSON.parse(readFileSync(join(dir, "items.json"), "utf8")) as Item[];
  const motifs = readJson<Record<string, string[]>>(join(dir, "motifs.json"));
  const concepts = readJson<Record<string, ConceptLabel>>(join(dir, "concepts.json"));
  const map = readJson<Record<string, string[]>>(join(args.bench ?? "bench", "concept-map.json")) ?? {};
  const vocab = readJson<{ concepts: { id: string; family: string }[] }>(
    join(args.bench ?? "bench", "vocabulary.json"),
  );
  const family = new Map((vocab?.concepts ?? []).map((c) => [c.id, c.family]));
  const teacher = await teacherNamed(args.teacher ?? "current");

  const results: Result[] = [];
  for (const item of items) {
    const out = await teacher.teach(item);
    results.push({
      id: item.id,
      type: item.type,
      band: item.band,
      drop: item.drop,
      out,
      checks: check(item, out, motifs?.[item.id] ?? null, concepts?.[item.id] ?? null, map, family),
    });
  }
  await teacher.close();

  const rate = (rs: Result[], key: string): string => {
    const vals = rs.map((r) => r.checks[key]).filter((v): v is boolean => typeof v === "boolean");
    return vals.length
      ? `${vals.filter(Boolean).length}/${vals.length} (${Math.round((100 * vals.filter(Boolean).length) / vals.length)}%)`
      : "n/a";
  };
  const teachable = results.filter((r) => r.type !== "quiet");
  const lines = [
    `Teacher: ${teacher.name} · split: ${args.split} · ${results.length} items`,
    "",
    "| Check | Score |",
    "|---|---|",
    `| Lesson on a teachable move | ${rate(teachable, "flag")} |`,
    `| No lesson on a quiet move | ${rate(
      results.filter((r) => r.type === "quiet"),
      "flag",
    )} |`,
    `| Better move is acceptable | ${rate(teachable, "better")} |`,
    `| Honest severity (cost 20%+) | ${rate(teachable, "severity")} |`,
    `| Names the punishment or the win | ${rate(teachable, "punishment")} |`,
    `| Motif matches the tagger | ${rate(teachable, "motif")} |`,
    `| Concept matches the annotators | ${rate(teachable, "concept")} |`,
    `| Concept family matches | ${rate(teachable, "family")} |`,
  ];
  if (args.split !== "test") {
    lines.push(
      "",
      "| Type | Items | Flag | Better | Severity | Punishment | Motif | Concept | Family |",
      "|---|---|---|---|---|---|---|---|---|",
    );
    for (const t of [
      "mated",
      "loses_material",
      "misses_mate",
      "misses_material",
      "positional",
      "quiet",
    ] as ItemType[]) {
      const rs = results.filter((r) => r.type === t);
      if (rs.length)
        lines.push(
          `| ${t} | ${rs.length} | ${rate(rs, "flag")} | ${rate(rs, "better")} | ${rate(rs, "severity")} | ${rate(rs, "punishment")} | ${rate(rs, "motif")} | ${rate(rs, "concept")} | ${rate(rs, "family")} |`,
        );
    }
    writeFileSync(join(dir, `results-${teacher.name}.json`), JSON.stringify(results, null, 1));
  }
  const report = lines.join("\n") + "\n";
  console.log(report);
  writeFileSync(join(dir, `score-${teacher.name}.md`), report);
}

await main();
