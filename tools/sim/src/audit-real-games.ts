/**
 * Research: what does the teacher say about real human games, next to a deep engine?
 *
 * Replays real Lichess games through the teaching core from each player's side (the other
 * side's moves are the real ones, not the teaching opponent's), and analyses every position
 * with a deep Stockfish as the reference. Writes every move either flags (a lesson, a
 * lesson the classical check rejected, or a drop in winning chances), so the teacher's
 * output can be judged against what actually went wrong.
 *
 * Usage: pnpm --filter @chess-teacher/sim exec tsx src/audit-real-games.ts \
 *          --pool games.jsonl --per-band 10 --out ../../reports/audit
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { Chess } from "chess.js";
import {
  CONSEQUENCE,
  MATE_SCORE,
  awaitedHappened,
  consequenceLanded,
  describeAwaited,
  describeConsequence,
  detectMistake,
  gameOf,
  lessonGap,
  newSession,
  startUserTurn,
  turnOf,
  userMove,
  variationSan,
  verifyLesson,
  Game,
  type Candidate,
  type Colour,
  type Engines,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import { lessonFeatureLabel, lessonIdeaLabel, templateExplanation, triggerText } from "./prototype-text.ts";

const { values: args } = parseArgs({
  options: {
    pool: { type: "string" },
    "per-band": { type: "string", default: "10" },
    offset: { type: "string", default: "0" },
    band: { type: "string" },
    "ref-depth": { type: "string", default: "18" },
    out: { type: "string", default: "reports/audit" },
  },
});

const require = createRequire(import.meta.url);
const SF11 = `node ${require.resolve("stockfish11/src/stockfish.asm.js")}`;

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

/** Lichess's winning chances, 0–100, from centipawns for the side to move. */
const winPct = (cp: number): number => {
  const c = Math.max(-1000, Math.min(1000, Math.abs(cp) >= MATE_SCORE - 500 ? Math.sign(cp) * 1000 : cp));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1);
};

function sanToUci(movetext: string): string[] {
  const chess = new Chess();
  const out: string[] = [];
  for (const tok of movetext.split(" ")) {
    if (/^\d+\.$/.test(tok) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok) || tok === "") continue;
    const m = chess.move(tok);
    out.push(m.lan);
  }
  return out;
}

interface RefPly {
  fen: string;
  cands: Candidate[];
}

/** One reference analysis per position, shared by both sides. */
async function reference(engine: NodeUciEngine, moves: string[], depth: number): Promise<RefPly[]> {
  const game = new Game();
  const out: RefPly[] = [];
  for (let i = 0; i <= moves.length; i++) {
    const fen = game.fen;
    const cands = game.isGameOver() ? [] : await engine.analyse(fen, { depth, multipv: 3 });
    out.push({ fen, cands });
    const m = moves[i];
    if (m !== undefined) game.push(m);
  }
  return out;
}

interface MoveRow {
  ply: number;
  label: string;
  played: string;
  winBefore: number;
  winAfter: number;
  drop: number;
  refBest: string;
  refBestLine: string;
  refReplyLine: string;
  /** Second and third choices, to see whether the best move was the only good one. */
  refAlternatives: string;
  lesson: LessonRow | null;
  rejected: LessonRow | null;
}

interface LessonRow {
  feature: string;
  principle: string;
  kind: string;
  gapCp: number;
  status: string;
  landedAfterPlies: number | null;
  trigger: string;
  verification: string;
  text: string;
}

const lessonRow = (l: Lesson, verification: string): LessonRow => ({
  feature: lessonFeatureLabel(l),
  principle: lessonIdeaLabel(l),
  kind: l.kind,
  gapCp: lessonGap(l),
  status: l.status,
  landedAfterPlies: l.status === "triggered" && l.resolvedPly !== null ? l.resolvedPly - l.ply : null,
  trigger: triggerText(l.trigger),
  verification,
  text: templateExplanation(l),
});

const classOf = (drop: number): string =>
  drop >= 30 ? "blunder" : drop >= 20 ? "mistake" : drop >= 10 ? "inaccuracy" : "ok";

async function teacherPass(
  moves: string[],
  userColour: Colour,
  ref: RefPly[],
  engines: Engines & { analystEngine: NodeUciEngine },
): Promise<MoveRow[]> {
  let state: SessionState = newSession({ userColour });
  const rows: MoveRow[] = [];
  const lessonByPly = new Map<number, Lesson>();
  const rejectedByPly = new Map<number, { lesson: Lesson; reason: string }>();

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i] ?? "";
    const game = gameOf(state);
    if (game.isGameOver()) break;
    if (game.turn === userColour) {
      state = (await startUserTurn(state, engines)).state;
      const cands = state.analysis?.candidates ?? [];
      const unverifiedBefore = state.unverified ?? 0;
      const fenBefore = game.fen;
      const before = state.lessons.length;
      state = (await userMove(state, move, engines)).state;
      const created = state.lessons.length > before ? state.lessons[state.lessons.length - 1] : undefined;
      if (created) lessonByPly.set(i, created);
      else if ((state.unverified ?? 0) > unverifiedBefore) {
        // Rebuild the lesson the classical check turned down, to see what it would have said.
        const after = new Game(fenBefore);
        after.push(move);
        const afterCands = await engines.analystEngine.analyse(after.fen, {
          depth: state.config.analysisDepth,
          multipv: 1,
        });
        const l = detectMistake(0, 0, fenBefore, move, after, cands, afterCands, state.config);
        if (l && engines.classical) {
          const v = await verifyLesson(l, engines.classical);
          rejectedByPly.set(i, { lesson: l, reason: v.reason });
        }
      }
    } else {
      // The real opponent's move, then the same consequence check the session runs.
      const replyFrom = gameOf(state).fen;
      state = { ...state, moves: [...state.moves, move], analysis: null };
      const now = gameOf(state);
      for (const l of state.lessons) {
        if (l.status !== "pending" || l.kind !== CONSEQUENCE) continue;
        const since = now.ply - l.ply;
        if (since < 2) continue;
        if (l.source === "features" ? consequenceLanded(l, now) : awaitedHappened(l, now, move)) {
          l.status = "triggered";
          l.resolvedPly = now.ply;
          l.trigger =
            l.source === "features" ? describeConsequence(l, now) : describeAwaited(l, now, move, replyFrom);
        } else if (since > 2 * state.config.expiryMoves) {
          l.status = "expired";
          l.resolvedPly = now.ply;
        }
      }
    }
  }

  for (let i = 0; i < moves.length; i++) {
    const r = ref[i];
    const next = ref[i + 1];
    const move = moves[i] ?? "";
    if (!r || !next || turnOf(r.fen) !== userColour) continue;
    const best = r.cands[0];
    if (!best) continue;
    const afterGame = new Game(next.fen);
    const afterScore = afterGame.isCheckmate() ? MATE_SCORE : next.cands[0] ? -next.cands[0].score : 0;
    const winBefore = winPct(best.score);
    const winAfter = winPct(afterScore);
    const drop = best.move === move ? 0 : Math.max(0, winBefore - winAfter);
    const lesson = lessonByPly.get(i);
    const rejected = rejectedByPly.get(i);
    if (drop < 8 && !lesson && !rejected) continue;
    const san = new Chess(r.fen).move(move).san;
    rows.push({
      ply: i,
      label: `${Math.floor(i / 2) + 1}${userColour === "w" ? "." : "..."} ${san}`,
      played: san,
      winBefore: Math.round(winBefore),
      winAfter: Math.round(winAfter),
      drop: Math.round(drop),
      refBest: new Chess(r.fen).move(best.move).san,
      refBestLine: variationSan(r.fen, best.pv.slice(0, 10)),
      refReplyLine: next.cands[0] ? variationSan(next.fen, next.cands[0].pv.slice(0, 10)) : "(game over)",
      refAlternatives: r.cands
        .slice(1)
        .map((c) => `${new Chess(r.fen).move(c.move).san} (${winPct(c.score).toFixed(0)}%)`)
        .join(", "),
      lesson: lesson
        ? lessonRow(lesson, lesson.source === "features" ? (lesson.verification ?? "") : "")
        : null,
      rejected: rejected ? lessonRow(rejected.lesson, rejected.reason) : null,
    });
  }
  return rows;
}

async function main() {
  if (!args.pool) throw new Error("--pool is required");
  const perBand = Number(args["per-band"]);
  const offset = Number(args.offset);
  const pool = readFileSync(args.pool, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as PoolGame);
  const bands = args.band ? [args.band] : [...new Set(pool.map((g) => g.band))];
  const chosen = bands.flatMap((b) => pool.filter((g) => g.band === b).slice(offset, offset + perBand));

  const refEngine = await NodeUciEngine.start(findStockfish(), { threads: 5, hashMb: 256 });
  const analyst = await NodeUciEngine.start(findStockfish());
  const classical = await NodeUciEngine.start(SF11);
  const engines = { analyst, weak: analyst, classical, analystEngine: analyst };

  mkdirSync(args.out ?? "reports/audit", { recursive: true });
  const all: { game: PoolGame; index: number; side: Colour; rows: MoveRow[] }[] = [];
  for (const [index, g] of chosen.entries()) {
    const moves = sanToUci(g.moves);
    const ref = await reference(refEngine, moves, Number(args["ref-depth"]));
    for (const side of ["w", "b"] as const) {
      const rows = await teacherPass(moves, side, ref, engines);
      all.push({ game: g, index: index + 1, side, rows });
    }
    console.log(`game ${index + 1}/${chosen.length} (${g.band}) done`);
    writeFileSync(join(args.out ?? "", "audit.json"), JSON.stringify(all, null, 1));
  }
  await Promise.all([refEngine.close(), analyst.close(), classical.close()]);
  writeFileSync(join(args.out ?? "", "audit.md"), report(all));
}

function report(all: { game: PoolGame; index: number; side: Colour; rows: MoveRow[] }[]): string {
  const md: string[] = ["# Teacher audit on real Lichess games", ""];
  const stats = new Map<
    string,
    { mistakes: number; caught: number; lessons: number; onFine: number; strategic: number; rejected: number }
  >();
  for (const s of all) {
    const st = stats.get(s.game.band) ?? {
      mistakes: 0,
      caught: 0,
      lessons: 0,
      onFine: 0,
      strategic: 0,
      rejected: 0,
    };
    for (const r of s.rows) {
      if (r.drop >= 20) {
        st.mistakes += 1;
        if (r.lesson) st.caught += 1;
      }
      if (r.lesson) {
        st.lessons += 1;
        if (r.drop < 10) st.onFine += 1;
        if (r.lesson.feature !== "material" && r.lesson.feature !== "mate") st.strategic += 1;
      }
      if (r.rejected) st.rejected += 1;
    }
    stats.set(s.game.band, st);
  }
  md.push(
    "| Band (Lichess) | Mistakes+blunders (≥20% drop) | …with a lesson | Lessons | Lessons on moves losing <10% | Strategic lessons | Rejected by classical check |",
    "|---|---|---|---|---|---|---|",
    ...[...stats].map(
      ([b, s]) =>
        `| ${b} | ${s.mistakes} | ${s.caught} | ${s.lessons} | ${s.onFine} | ${s.strategic} | ${s.rejected} |`,
    ),
    "",
  );
  for (const s of all) {
    md.push(
      `## Game ${s.index} (${s.game.band}), ${s.side === "w" ? "White" : "Black"}: ${s.game.opening}`,
      "",
      `${s.game.site} · ${s.game.white_elo} vs ${s.game.black_elo} · ${s.game.result}`,
      "",
    );
    for (const r of s.rows) {
      md.push(
        `### ${s.index}${s.side}-${r.ply}: ${r.label} — ${classOf(r.drop)} (${r.winBefore}% → ${r.winAfter}%)`,
        "",
        `- Engine best: **${r.refBest}**; line: ${r.refBestLine}`,
        `- Others: ${r.refAlternatives || "none"}`,
        `- After ${r.played}: ${r.refReplyLine}`,
      );
      if (r.lesson) {
        md.push(
          `- **Lesson:** ${r.lesson.feature} / ${r.lesson.principle} / ${r.lesson.kind}, gap ${r.lesson.gapCp}cp, ` +
            `${r.lesson.status}${r.lesson.landedAfterPlies !== null ? ` after ${r.lesson.landedAfterPlies} plies` : ""}` +
            `${r.lesson.verification ? `; check: ${r.lesson.verification}` : ""}`,
        );
        if (r.lesson.trigger) md.push(`- Trigger: ${r.lesson.trigger}`);
        md.push("", "```", r.lesson.text, "```");
      } else if (r.rejected) {
        md.push(
          `- *Rejected lesson:* ${r.rejected.feature} / ${r.rejected.principle}; ${r.rejected.verification}`,
        );
      } else {
        md.push("- *No lesson.*");
      }
      md.push("");
    }
  }
  return md.join("\n") + "\n";
}

await main();
