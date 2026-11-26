/**
 * Lesson benchmark, step 3: choose the items, split them into dev and test, and write a
 * packet per item for the annotators.
 *
 * Kinds of item:
 * - teachable: the move cost 12%+ winning chances at depth 20, from a position that wasn't
 *   already decided (12–88%). Typed by what the engine shows: the player gets mated, loses
 *   material, misses a mate, misses material, or none of those (positional).
 * - quiet: the move cost under 4% at depth 20 although the teacher's depth (12) saw a gap
 *   of 35+ centipawns. The right answer is no lesson.
 *
 * Items are split by game (a game's items all go to the same side), so dev can't leak into
 * test through a shared game.
 *
 * Growing: items already in `<out>/<split>/items.json` keep their id, split and place, and
 * so do their packets and annotations. New items fill the quotas from the games not yet
 * used, in new packets. `<out>/<split>/packets.json` lists which items each packet holds.
 * Games scanned in a later generation (`--first-new`, by place in the pool) are split among
 * themselves, so adding games never moves an old game to the other side.
 *
 * Usage: tsx src/bench/select-items.ts --raw bench/raw --out bench --pool <pool.jsonl> --first-new 35
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { Chess } from "chess.js";

const { values: args } = parseArgs({
  options: {
    raw: { type: "string", default: "bench/raw" },
    out: { type: "string", default: "bench" },
    pool: { type: "string", default: "../../reports/audit/pool.jsonl" },
    "first-new": { type: "string", default: "35" },
  },
});

export type ItemType =
  "mated" | "loses_material" | "misses_mate" | "misses_material" | "positional" | "quiet";

interface Raw {
  band: string;
  site: string;
  white_elo: number;
  black_elo: number;
  opening: string;
  ply: number;
  moves_before: string[];
  fen: string;
  mover: "w" | "b";
  played: string;
  played_san: string;
  scan: { gap12: number; drop12: number; win12: number };
  win_before: number;
  win_after: number;
  drop: number;
  mate_before: number | null;
  mate_after: number | null;
  candidates: { move: string; san: string; win: number; cp: number; line: string[]; uci: string[] }[];
  acceptable: string[];
  punishment: {
    uci: string[];
    san: string[];
    balance_before: number;
    balance_after_move: number;
    balance_end: number;
    balance_worst: number;
  };
  best_line: { balance_end: number; balance_worst: number };
  threat: {
    move: string;
    san: string;
    line: string[];
    win_if_ignored: number;
    balance_end: number | null;
  } | null;
}

/** Lichess tags that describe a puzzle's length, phase or evaluation rather than its idea. */
const NOT_MOTIFS = new Set([
  "oneMove",
  "short",
  "long",
  "veryLong",
  "equality",
  "advantage",
  "crushing",
  "opening",
  "middlegame",
  "endgame",
  "master",
  "masterVsMaster",
  "superGM",
  "quietMove",
  "defensiveMove",
]);

interface TaggedLine {
  tags: string[];
  solution: string;
}

/** Motifs from `tag_motifs.py` output, by `site#ply`: the punishment's for a mistake, the missed line's for a missed win. */
function readMotifs(dir: string): Map<string, { punishment: string[]; missed: string[] }> {
  const out = new Map<string, { punishment: string[]; missed: string[] }>();
  const keep = (t: TaggedLine | null): string[] =>
    t ? t.tags.filter((x) => !NOT_MOTIFS.has(x) && !x.startsWith("error:")) : [];
  for (const f of readdirSync(dir).filter((f) => f.startsWith("motifs") && f.endsWith(".jsonl")))
    for (const l of readFileSync(join(dir, f), "utf8").split("\n").filter(Boolean)) {
      const o = JSON.parse(l) as {
        site: string;
        ply: number;
        punishment: TaggedLine | null;
        missed: TaggedLine | null;
      };
      out.set(`${o.site}#${o.ply}`, { punishment: keep(o.punishment), missed: keep(o.missed) });
    }
  return out;
}

const hash = (s: string): string => createHash("sha256").update(s).digest("hex");

function typeOf(r: Raw): ItemType | null {
  if (r.drop < 4 && r.scan.gap12 >= 35) return "quiet";
  if (r.drop < 12 || r.win_before < 12 || r.win_before > 88) return null;
  const p = r.punishment;
  if (r.mate_after !== null && r.mate_after <= 0) return "mated";
  if (p.balance_end <= p.balance_before - 1) return "loses_material";
  if (r.mate_before !== null && r.mate_before > 0) return "misses_mate";
  if (r.best_line.balance_end >= p.balance_before + 1 && r.best_line.balance_end > p.balance_end + 0.5)
    return "misses_material";
  return "positional";
}

/** Per band, both splits together: how many of each type to take, in order of preference. */
const QUOTA: Record<ItemType, number> = {
  loses_material: 22,
  mated: 6,
  misses_mate: 4,
  misses_material: 13,
  positional: 30,
  quiet: 32,
};

const PACKET_SIZE = 20;

function moveList(moves: string[]): string {
  const c = new Chess();
  const out: string[] = [];
  moves.forEach((m, i) => {
    const s = c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] }).san;
    out.push(i % 2 === 0 ? `${i / 2 + 1}. ${s}` : s);
  });
  return out.join(" ");
}

function packet(id: string, r: Raw): string {
  const board = new Chess(r.fen);
  const colour = r.mover === "w" ? "White" : "Black";
  const rating = r.mover === "w" ? r.white_elo : r.black_elo;
  const moveNo = Math.floor(r.ply / 2) + 1;
  const label = `${moveNo}${r.mover === "w" ? "." : "..."} ${r.played_san}`;
  const lines = [
    `## ${id}`,
    "",
    `${colour} to move, rated ${rating} on Lichess (rapid). Opening: ${r.opening}.`,
    "",
    `Game so far: ${moveList(r.moves_before) || "(start)"}`,
    "",
    `FEN: \`${r.fen}\``,
    "",
    "```",
    board.ascii(),
    "```",
    "",
    `**Played: ${label}.** Winning chances for ${colour} (Stockfish, depth 20): ${r.win_before}% before, ${r.win_after}% after.`,
    "",
    "Engine's top moves here (winning chances for the player):",
    ...r.candidates.map((c) => `- ${c.san} (${c.win}%): ${c.line.join(" ")}`),
    "",
    `After ${r.played_san}, the opponent's best continuation: ${r.punishment.san.join(" ") || "(none: game over)"}`,
    `Material for ${colour} (pawn = 1): ${r.punishment.balance_before} before the move, ${r.punishment.balance_end} at the end of that continuation; ${r.best_line.balance_end} at the end of the top line.`,
  ];
  if (r.threat)
    lines.push(
      `Before ${r.played_san}, if ${colour} had passed, the opponent would play ${r.threat.san} (${r.threat.line.join(" ")}), leaving ${colour} ${r.threat.win_if_ignored}% winning chances.`,
    );
  return lines.join("\n") + "\n";
}

interface Chosen {
  id: string;
  split: "dev" | "test";
  type: ItemType;
  raw: Raw;
}

function main() {
  const out = args.out ?? "bench";
  const raws: Raw[] = readdirSync(args.raw ?? "")
    .filter((f) => /^\d+\.jsonl$/.test(f))
    .flatMap((f) =>
      readFileSync(join(args.raw ?? "", f), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l) as Raw),
    );
  // Each game's place in its band of the pool decides its generation.
  const place = new Map<string, number>();
  const seen: Record<string, number> = {};
  for (const l of readFileSync(args.pool ?? "", "utf8")
    .split("\n")
    .filter(Boolean)) {
    const g = JSON.parse(l) as { band: string; site: string };
    place.set(g.site, seen[g.band] ?? 0);
    seen[g.band] = (seen[g.band] ?? 0) + 1;
  }
  const firstNew = Number(args["first-new"]);
  const generation = (site: string): number => ((place.get(site) ?? 0) < firstNew ? 0 : 1);

  // Items already in the benchmark stay exactly as they are.
  const kept = new Map<string, { id: string; split: "dev" | "test"; type: ItemType }>();
  const order: Record<"dev" | "test", string[]> = { dev: [], test: [] };
  for (const split of ["dev", "test"] as const) {
    const path = join(out, split, "items.json");
    if (!existsSync(path)) continue;
    for (const it of JSON.parse(readFileSync(path, "utf8")) as {
      id: string;
      type: ItemType;
      site: string;
      ply: number;
    }[]) {
      kept.set(`${it.site}#${it.ply}`, { id: it.id, split, type: it.type });
      order[split].push(it.id);
    }
  }

  const chosen: Chosen[] = [];
  for (const raw of raws) {
    const k = kept.get(`${raw.site}#${raw.ply}`);
    if (k) chosen.push({ ...k, raw });
  }
  const keptSplit = new Map(chosen.map((c) => [c.raw.site, c.split]));

  for (const band of [...new Set(raws.map((r) => r.band))].sort()) {
    const pool = raws
      .filter((r) => r.band === band)
      .map((r) => ({ r, type: typeOf(r), key: hash(`${r.site}#${r.ply}`) }))
      .filter((x): x is { r: Raw; type: ItemType; key: string } => x.type !== null)
      .sort((a, b) => a.key.localeCompare(b.key));
    // Games ranked by hash within their generation, two in five to test: a balanced split
    // that no one chooses, and that adding games doesn't change.
    const rank = new Map<string, number>();
    for (const gen of [0, 1]) {
      const sites = [...new Set(pool.filter((x) => generation(x.r.site) === gen).map((x) => x.r.site))].sort(
        (a, b) => hash(a).localeCompare(hash(b)),
      );
      sites.forEach((site, i) => rank.set(site, i));
    }
    const splitOf = (site: string): "dev" | "test" =>
      keptSplit.get(site) ?? ((rank.get(site) ?? 0) % 5 < 2 ? "test" : "dev");
    const perSide = new Map<string, number>();
    for (const c of chosen.filter((c) => c.raw.band === band))
      perSide.set(`${c.raw.site}${c.raw.mover}`, (perSide.get(`${c.raw.site}${c.raw.mover}`) ?? 0) + 1);
    const have = (split: string, type: ItemType) =>
      chosen.filter((c) => c.raw.band === band && c.split === split && c.type === type).length;
    // Prefer the game with the fewest items so far: more games means more kinds of mistake.
    const perGame = (site: string) => chosen.filter((c) => c.raw.site === site).length;
    const take = (split: "dev" | "test", type: ItemType, n: number): number => {
      let got = 0;
      while (got < n) {
        let pick: (typeof pool)[number] | null = null;
        for (const x of pool) {
          if (x.type !== type || splitOf(x.r.site) !== split || chosen.some((c) => c.raw === x.r)) continue;
          if ((perSide.get(`${x.r.site}${x.r.mover}`) ?? 0) >= 2) continue;
          if (!pick || perGame(x.r.site) < perGame(pick.r.site)) pick = x;
        }
        if (!pick) break;
        const side = `${pick.r.site}${pick.r.mover}`;
        perSide.set(side, (perSide.get(side) ?? 0) + 1);
        chosen.push({ id: `b${band}-${pick.key.slice(0, 6)}`, split, type, raw: pick.r });
        got += 1;
      }
      return got;
    };
    // Quotas apply to each split, so test has the same mix of types as dev.
    for (const split of ["dev", "test"] as const) {
      let shortfall = 0;
      for (const [type, n] of Object.entries(QUOTA) as [ItemType, number][]) {
        const share = (split === "test" ? Math.round(n * 0.4) : n - Math.round(n * 0.4)) - have(split, type);
        if (share > 0) shortfall += share - take(split, type, share);
      }
      // Fill any shortfall with positional, then material items: the scarce kinds matter most.
      for (const type of ["positional", "loses_material", "misses_material"] as ItemType[]) {
        if (shortfall > 0) shortfall -= take(split, type, shortfall);
      }
    }
  }

  const motifs = readMotifs(args.raw ?? "");
  for (const split of ["dev", "test"] as const) {
    // Kept items first, in their old order, then the new ones.
    const ids = new Set(order[split]);
    const items = [
      ...order[split].flatMap((id) => chosen.filter((c) => c.id === id)),
      ...chosen.filter((c) => c.split === split && !ids.has(c.id)),
    ];
    mkdirSync(join(out, split), { recursive: true });
    const byId: Record<string, string[]> = {};
    for (const c of items) {
      const m = motifs.get(`${c.raw.site}#${c.raw.ply}`);
      if (!m) continue;
      const losing = c.type === "mated" || c.type === "loses_material";
      const tags = losing
        ? m.punishment
        : c.type === "misses_mate" || c.type === "misses_material"
          ? m.missed
          : [];
      if (tags.length) byId[c.id] = tags;
    }
    writeFileSync(join(out, split, "motifs.json"), JSON.stringify(byId, null, 1));
    writeFileSync(
      join(out, split, "items.json"),
      JSON.stringify(
        items.map((c) => ({ id: c.id, type: c.type, ...c.raw })),
        null,
        1,
      ),
    );

    // Packets: the existing ones as they were (chunks of 20 in the old order when no
    // manifest exists yet), then new packets of 20 for the new items.
    const manifestPath = join(out, split, "packets.json");
    const manifest: Record<string, string[]> = existsSync(manifestPath)
      ? (JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, string[]>)
      : Object.fromEntries(
          Array.from({ length: Math.ceil(order[split].length / PACKET_SIZE) }, (_, k) => [
            String(k + 1),
            order[split].slice(k * PACKET_SIZE, (k + 1) * PACKET_SIZE),
          ]),
        );
    const packed = new Set(Object.values(manifest).flat());
    const fresh = items.filter((c) => !packed.has(c.id));
    let next = Object.keys(manifest).length + 1;
    for (let k = 0; k < fresh.length; k += PACKET_SIZE) {
      const chunk = fresh.slice(k, k + PACKET_SIZE);
      manifest[String(next)] = chunk.map((c) => c.id);
      writeFileSync(
        join(out, split, `packets-${next}.md`),
        chunk.map((c) => packet(c.id, c.raw)).join("\n---\n\n"),
      );
      next += 1;
    }
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  }
  const count = (split: string) => {
    const by: Record<string, number> = {};
    for (const c of chosen.filter((x) => x.split === split))
      by[`${c.raw.band} ${c.type}`] = (by[`${c.raw.band} ${c.type}`] ?? 0) + 1;
    return by;
  };
  console.log("dev", chosen.filter((c) => c.split === "dev").length, count("dev"));
  console.log("test", chosen.filter((c) => c.split === "test").length);
}

main();
