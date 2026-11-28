/**
 * Lesson benchmark, step 1: find candidate positions in real games and label them with a
 * deep engine.
 *
 * Scans each game at the teacher's depth (12) to find moves worth a closer look, then
 * labels each candidate at depth 20: how much the move cost, the acceptable moves, the
 * opponent's punishment and what it wins, the line the better move carries out, and the
 * opponent's threat before the move (a null-move probe). Labels use plain material counts
 * along the engine's lines, never the teacher's own features, so the benchmark doesn't
 * share the teacher's mistakes.
 *
 * Usage: tsx src/bench/build-items.ts --pool ../../reports/audit/pool.jsonl --band 1400 \
 *          --offset 10 --games 25 --out bench/raw
 */

import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { Chess } from "chess.js";
import { MATE_SCORE, turnOf, type Candidate } from "@chess-teacher/core";
import { UciEngine } from "@chess-teacher/engine";
import { NodeUciEngine, findStockfish, processTransport } from "@chess-teacher/engine/node";
import { sanToUci, winPct } from "../lichess.ts";

const { values: args } = parseArgs({
  options: {
    pool: { type: "string" },
    band: { type: "string" },
    offset: { type: "string", default: "10" },
    games: { type: "string", default: "25" },
    depth: { type: "string", default: "20" },
    out: { type: "string", default: "bench/raw" },
    append: { type: "boolean", default: false },
  },
});

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

const mateIn = (cp: number): number | null =>
  Math.abs(cp) >= MATE_SCORE - 500 ? Math.sign(cp) * Math.ceil((MATE_SCORE - Math.abs(cp)) / 2) : null;

/** Material for `colour` minus the opponent's, plain piece values. */
function balance(fen: string, colour: "w" | "b"): number {
  let s = 0;
  for (const row of new Chess(fen).board())
    for (const sq of row) if (sq) s += (sq.color === colour ? 1 : -1) * (VALUE[sq.type] ?? 0);
  return s;
}

function san(fen: string, line: string[]): string[] {
  const c = new Chess(fen);
  const out: string[] = [];
  for (const m of line) {
    try {
      out.push(c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] }).san);
    } catch {
      break;
    }
  }
  return out;
}

function fenAfter(fen: string, line: string[]): string[] {
  const c = new Chess(fen);
  const out = [fen];
  for (const m of line) {
    try {
      c.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] });
    } catch {
      break;
    }
    out.push(c.fen());
  }
  return out;
}

/**
 * The lowest balance `colour` holds for two plies along a line: the line may give material
 * back later through a trick, and a single ply mid-exchange isn't the result.
 */
function heldBalance(fen: string, line: string[], colour: "w" | "b"): { end: number; worst: number } {
  const fens = fenAfter(fen, line);
  const vals = fens.map((f) => balance(f, colour));
  const held = vals.map((v, i) => Math.max(v, vals[i + 1] ?? v));
  return { end: held[held.length - 1] ?? 0, worst: Math.min(...held.slice(1)) };
}

/** The same position with the other side to move (a null move), or null when that's illegal. */
function nullMove(fen: string): string | null {
  const c = new Chess(fen);
  if (c.inCheck()) return null;
  const parts = fen.split(" ");
  parts[1] = parts[1] === "w" ? "b" : "w";
  parts[3] = "-";
  const flipped = parts.join(" ");
  try {
    const f = new Chess(flipped);
    return f.inCheck() ? null : flipped;
  } catch {
    return null;
  }
}

interface PoolGame {
  band: string;
  white_elo: number;
  black_elo: number;
  site: string;
  result: string;
  time_control: string;
  opening: string;
  moves: string;
}

const pvOf = (c: Candidate | undefined): string[] => c?.pv ?? [];

async function main() {
  if (!args.pool || !args.band) throw new Error("--pool and --band are required");
  const depth = Number(args.depth);
  const games = readFileSync(args.pool, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as PoolGame)
    .filter((g) => g.band === args.band)
    .slice(Number(args.offset), Number(args.offset) + Number(args.games));

  const scan = await NodeUciEngine.start(findStockfish(), { threads: 1, hashMb: 64 });
  // Some positions full of checks blow up at depth 20 (one stalled at depth 14 for hours),
  // so every deep search also stops after a minute, keeping whatever depth it reached.
  const transport = processTransport(findStockfish());
  const capped = {
    ...transport,
    send: (c: string) => transport.send(c.startsWith("go depth") ? `${c} movetime 60000` : c),
  };
  const deep = await UciEngine.start(capped, { threads: Number(process.env.DEEP_THREADS ?? 5), hashMb: 256 });
  const outDir = args.out ?? "bench/raw";
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${args.band}.jsonl`);
  if (!args.append) writeFileSync(file, "");

  for (const [gi, g] of games.entries()) {
    const moves = sanToUci(g.moves);
    const fens = fenAfter(new Chess().fen(), moves);
    // Scan at the teacher's depth: best score in every position (side to move's view).
    const scores: (number | null)[] = [];
    for (const fen of fens) {
      const c = new Chess(fen);
      if (c.isGameOver()) scores.push(c.isCheckmate() ? -MATE_SCORE : 0);
      else scores.push((await scan.analyse(fen, { depth: 12, multipv: 1 }))[0]?.score ?? null);
    }
    let kept = 0;
    for (let i = 0; i < moves.length; i++) {
      const before = scores[i];
      const afterOpp = scores[i + 1];
      if (before == null || afterOpp == null) continue;
      const after = -afterOpp;
      const gap12 = before - after;
      const drop12 = winPct(before) - winPct(after);
      const w12 = winPct(before);
      const teachable = drop12 >= 10 && w12 >= 10 && w12 <= 90;
      const tempting = gap12 >= 35 && drop12 < 6 && w12 >= 10 && w12 <= 90;
      if (!teachable && !tempting) continue;

      const fen = fens[i] ?? "";
      const move = moves[i] ?? "";
      const mover = turnOf(fen);
      const cands = await deep.analyse(fen, { depth, multipv: 5 });
      const best = cands[0];
      if (!best) continue;
      const afterFen = fens[i + 1] ?? "";
      const afterGame = new Chess(afterFen);
      const reply = afterGame.isGameOver() ? [] : await deep.analyse(afterFen, { depth, multipv: 1 });
      const afterScore = afterGame.isCheckmate()
        ? MATE_SCORE
        : afterGame.isGameOver()
          ? 0
          : -(reply[0]?.score ?? 0);
      const winBefore = winPct(best.score);
      const winAfter = best.move === move ? winBefore : winPct(afterScore);
      const drop = Math.max(0, winBefore - winAfter);

      // The opponent's threat before the move: pass the turn and see what they'd do.
      const nm = nullMove(fen);
      const threat = nm ? (await deep.analyse(nm, { depth: 16, multipv: 1 }))[0] : undefined;
      const baseBalance = balance(fen, mover);
      const punish = pvOf(reply[0]);
      const punishHeld = heldBalance(afterFen, punish, mover);
      const bestHeld = heldBalance(fen, best.pv, mover);
      const playedNow = balance(afterFen, mover);
      const threatHeld = threat ? heldBalance(nm ?? fen, threat.pv, mover) : null;

      const item = {
        band: g.band,
        site: g.site,
        white_elo: g.white_elo,
        black_elo: g.black_elo,
        opening: g.opening,
        ply: i,
        moves_before: moves.slice(0, i),
        fen,
        mover,
        played: move,
        played_san: san(fen, [move])[0],
        scan: { gap12, drop12: Math.round(drop12), win12: Math.round(w12) },
        win_before: Math.round(winBefore),
        win_after: Math.round(winAfter),
        drop: Math.round(drop),
        mate_before: mateIn(best.score),
        mate_after: afterGame.isCheckmate() ? 0 : reply[0] ? mateIn(-reply[0].score) : null,
        candidates: cands.map((c) => ({
          move: c.move,
          san: san(fen, [c.move])[0],
          win: Math.round(winPct(c.score)),
          cp: c.score,
          line: san(fen, c.pv.slice(0, 12)),
          uci: c.pv.slice(0, 12),
        })),
        acceptable: cands.filter((c) => winBefore - winPct(c.score) <= 3).map((c) => c.move),
        punishment: {
          uci: punish.slice(0, 14),
          san: san(afterFen, punish.slice(0, 14)),
          // Material for the mover: before their move, right after it, and held along the punishment.
          balance_before: baseBalance,
          balance_after_move: playedNow,
          balance_end: punishHeld.end,
          balance_worst: punishHeld.worst,
        },
        best_line: { balance_end: bestHeld.end, balance_worst: bestHeld.worst },
        threat: threat
          ? {
              move: threat.move,
              san: san(nm ?? fen, [threat.move])[0],
              line: san(nm ?? fen, threat.pv.slice(0, 8)),
              // How much worse the mover's position is if the opponent got a free move.
              win_if_ignored: Math.round(100 - winPct(threat.score)),
              balance_end: threatHeld?.end ?? null,
            }
          : null,
      };
      appendFileSync(file, JSON.stringify(item) + "\n");
      kept += 1;
    }
    console.log(`${args.band} game ${gi + 1}/${games.length}: ${kept} candidates`);
  }
  await Promise.all([scan.close(), deep.close()]);
}

await main();
