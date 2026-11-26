/**
 * The redesigned core as a benchmark teacher: `diagnose` (confirm, probe, choose concepts),
 * with a plain English rendering of the dossier for reading results. The app will render
 * dossiers from its message catalogue instead.
 */

import {
  DIAGNOSE_CONFIG,
  Game,
  STANDARD_START,
  type Engine,
  diagnose,
  nullMoveFen,
  sanOf,
  variationSan,
  type Claim,
  type Dossier,
  type LineOutcome,
} from "@chess-teacher/core";
import { NodeUciEngine, findStockfish } from "@chess-teacher/engine/node";
import type { BenchItemInput, Teacher, TeacherOutput } from "./teacher.ts";

const PIECE: Record<string, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

function find<K extends Claim["kind"]>(d: Dossier, kind: K): Extract<Claim, { kind: K }> | undefined {
  return d.claims.find((c): c is Extract<Claim, { kind: K }> => c.kind === kind);
}

/** The line the lesson is about: the punishment for a loss, the better line for a missed win. */
function decisive(d: Dossier): { outcome: LineOutcome; fen: string } | null {
  const win = find(d, "missed_win");
  if (win) return { outcome: win.outcome, fen: d.fenBefore };
  // A free capture is about the better line, even when the move also lost something.
  const best = find(d, "best_line");
  if (best && d.concept === "free_material") return { outcome: best.outcome, fen: d.fenBefore };
  const p = find(d, "punishment");
  if (!p) return null;
  return { outcome: p.outcome, fen: fenAfter(d.fenBefore, d.userMove) };
}

const fenAfter = (fen: string, move: string): string => {
  const g = new Game(fen);
  g.push(move);
  return g.fen;
};

/** The dossier as plain English; `withConcept` adds the concepts the recipes chose. */
export function render(d: Dossier, withConcept: boolean): string {
  const out: string[] = [];
  const played = sanOf(d.fenBefore, d.userMove);
  const best = sanOf(d.fenBefore, d.bestMove);
  const p = find(d, "punishment");
  const after = fenAfter(d.fenBefore, d.userMove);
  out.push(
    `${played} [${d.kind}; ${Math.round(d.winBefore)}% → ${Math.round(d.winAfter)}%].` +
      (withConcept ? ` Concept: ${d.concept ?? "—"}${d.secondary ? ` (+ ${d.secondary})` : ""}.` : ""),
  );
  if (p && p.outcome.line.length) {
    const what = p.outcome.mates
      ? "mate"
      : p.outcome.key
        ? `wins your ${PIECE[p.outcome.key.took]} on ${p.outcome.key.square}`
        : p.lost >= 1
          ? `wins ${p.lost} pawns' worth`
          : "is better for them";
    out.push(`After ${played}, ${variationSan(after, p.outcome.line.slice(0, 6))} ${what}.`);
  }
  for (const c of d.claims) {
    if (c.kind === "threat") {
      const nm = nullMoveFen(d.fenBefore);
      const line = nm ? variationSan(nm, c.outcome.line.slice(0, 4)) : "";
      out.push(
        `Their threat before the move: ${line} (${c.outcome.mates ? "mate" : `wins ${c.wins}`})${c.ignored ? ", and the move ignored it" : ""}.`,
      );
    }
    if (c.kind === "removed_defender")
      out.push(`The move took the defender on ${c.defender} away from ${c.square}.`);
    if (c.kind === "opened_line")
      out.push(`Moving off ${c.from} opened the line from ${c.attacker} to ${c.square}.`);
    if (c.kind === "pinned_defender") out.push(`${c.square}'s defender on ${c.defender} was pinned.`);
    if (c.kind === "pinned_target")
      out.push(`Your piece on ${c.square} was pinned by ${c.by} to ${c.behind}, so it couldn't get away.`);
    if (c.kind === "count") out.push(`${c.square}: attacked ${c.attackers}, defended ${c.defenders}.`);
    if (c.kind === "tempo") out.push(`${c.by === "user" ? "Your" : "Their"} ${c.move} attacks ${c.target}.`);
  }
  for (const c of d.claims) {
    if (c.kind === "king_in_centre")
      out.push(`Your king on ${c.king} is still in the centre and gets checked ${c.checks}x.`);
    if (c.kind === "shelter_weakened")
      out.push(`The pawn move from ${c.pawn} weakens the shelter of your king on ${c.king}.`);
    if (c.kind === "perpetual") out.push(`They give ${c.checks} checks in a row: a perpetual.`);
    if (c.kind === "back_rank")
      out.push(`Your king on ${c.king} has no way off the back rank and ${c.by} lands on it.`);
    if (c.kind === "passed_pawn")
      out.push(`${c.side === "user" ? "Your" : "Their"} passed pawn runs ${c.from}-${c.to}.`);
    if (c.kind === "rook_seventh")
      out.push(`${c.side === "user" ? "Your" : "Their"} rook reaches the seventh on ${c.square}.`);
    if (c.kind === "pawn_break") out.push(`${sanOf(d.fenBefore, c.move)} hits the pawn on ${c.target}.`);
    if (c.kind === "pawn_grab") out.push(`The move grabbed the pawn on ${c.square}.`);
    if (c.kind === "neglected_development")
      out.push(`The pawn move from ${c.pawn} came with ${c.undeveloped} knights and bishops still at home.`);
  }
  const w = find(d, "missed_win");
  if (w)
    out.push(
      `Better: ${variationSan(d.fenBefore, w.outcome.line.slice(0, 6))}${w.outcome.mates ? " (mate)" : w.outcome.key ? `, winning the ${PIECE[w.outcome.key.took]} on ${w.outcome.key.square}` : ""}.`,
    );
  else out.push(`Better: ${best}.`);
  const dec = decisive(d);
  if (dec?.outcome.motifs.length) out.push(`Motifs: ${dec.outcome.motifs.map((m) => m.motif).join(", ")}.`);
  return out.join(" ");
}

export async function nextTeacher(): Promise<Teacher> {
  return {
    name: "next",
    async teach(item: BenchItemInput): Promise<TeacherOutput> {
      // A fresh engine per item: its hash table would otherwise carry lines from one item to
      // the next, and the same run would give different answers.
      const engine = await NodeUciEngine.start(findStockfish(), { threads: 1, hashMb: 64 });
      try {
        return await teachWith(engine, item);
      } finally {
        await engine.close();
      }
    },
    close: async () => undefined,
  };
}

async function teachWith(engine: Engine, item: BenchItemInput): Promise<TeacherOutput> {
  const last = item.moves_before.at(-1);
  const previous =
    last === undefined
      ? null
      : { fen: new Game(STANDARD_START, item.moves_before.slice(0, -1)).fen, move: last };
  const d = await diagnose(engine, item.fen, item.played, previous, DIAGNOSE_CONFIG);
  if (!d)
    return {
      flagged: false,
      concepts: [],
      namedMoves: [],
      namedSquares: [],
      namedWins: [],
      motifs: [],
      text: "",
    };
  const dec = decisive(d);
  const o = dec?.outcome;
  const key = o?.key ?? null;
  return {
    flagged: true,
    better: d.bestMove,
    severity: d.winBefore - d.winAfter < 12 ? "small" : "normal",
    concepts: [d.concept, d.secondary].filter((c): c is NonNullable<typeof c> => c !== null),
    namedMoves: [o?.line[0], key?.move].filter((m): m is string => m !== undefined),
    namedSquares: key ? [key.square] : [],
    namedWins: [...(o?.mates ? ["mate"] : []), ...(key ? [key.took] : [])],
    motifs: (o?.motifs ?? []).map((m) => m.motif),
    text: render(d, true),
  };
}
