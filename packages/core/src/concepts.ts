/**
 * Concepts: what a coach would name as the idea behind a move. Each is a recipe over the
 * claims the probes verified; a lesson names a concept only when its recipe matches.
 *
 * The order follows how coaches explain a mistake: first the tactic that punishes it, then
 * what the move failed to answer, then what the move itself did wrong. A count of attackers
 * is the last resort, because a coach names why the count failed (a pin, a guard pulled
 * away), not the count.
 */

import { VALUES } from "./board.ts";
import type { Claim, LineOutcome, Motif } from "./claims.ts";

/**
 * Every concept a lesson can name, by family. The recipes below reach some of them; the
 * coach (an LLM reading the verified claims) may name any of them.
 */
export const CONCEPT_FAMILIES = {
  material: [
    "hanging_piece",
    "count_attackers",
    "free_material",
    "removed_own_defender",
    "false_defender",
    "greedy_grab",
  ],
  tactics: [
    "fork",
    "pin",
    "skewer",
    "discovered_attack",
    "opened_line",
    "trapped_piece",
    "in_between_move",
    "remove_the_guard",
  ],
  threats: ["missed_threat"],
  king: [
    "mate_threat",
    "back_rank",
    "king_in_centre",
    "king_shelter",
    "escape_square",
    "perpetual_check",
    "stalemate",
    "attack_the_king",
  ],
  tempo: ["tempo_attack", "lost_time", "development"],
  pawns: ["pawn_break", "passed_pawn", "pawn_weakness", "centre_control"],
  pieces: ["rook_activity", "bad_placement", "key_square"],
  trades: ["trade_decisions", "endgame_knowledge"],
} as const;

export type ConceptFamily = keyof typeof CONCEPT_FAMILIES;
export type ConceptId = (typeof CONCEPT_FAMILIES)[ConceptFamily][number];

export const CONCEPT_IDS: readonly ConceptId[] = Object.values(CONCEPT_FAMILIES).flat();

export const isConceptId = (id: unknown): id is ConceptId =>
  typeof id === "string" && (CONCEPT_IDS as readonly string[]).includes(id);

export type MistakeKind = "mated" | "loses_material" | "misses_mate" | "misses_material" | "positional";

const MOTIF_CONCEPT: Partial<Record<Motif, ConceptId>> = {
  fork: "fork",
  pin: "pin",
  skewer: "skewer",
  discoveredAttack: "discovered_attack",
  trappedPiece: "trapped_piece",
  capturingDefender: "remove_the_guard",
};

/** Motifs a lesson can be built around, most specific first. */
const MOTIF_ORDER: Motif[] = [
  "fork",
  "skewer",
  "pin",
  "discoveredAttack",
  "trappedPiece",
  "capturingDefender",
];

function motifConcept(o: LineOutcome, onlyFirstMove = false): ConceptId | null {
  for (const m of MOTIF_ORDER)
    if (o.motifs.some((f) => f.motif === m && (!onlyFirstMove || f.index === 0)))
      return MOTIF_CONCEPT[m] ?? null;
  return null;
}

function find<K extends Claim["kind"]>(claims: Claim[], kind: K): Extract<Claim, { kind: K }> | undefined {
  return claims.find((c): c is Extract<Claim, { kind: K }> => c.kind === kind);
}

type Add = (c: ConceptId | null | undefined) => void;

/**
 * The opponent's threat the move left unanswered: a piece left where it could simply be
 * taken, or a threat that needed seeing. A threat that wins nothing is not one a coach names.
 */
function ignoredThreat(claims: Claim[]): ConceptId | null {
  const threat = find(claims, "threat");
  if (!threat?.ignored || (threat.wins < 1 && !threat.outcome.mates)) return null;
  return threat.outcome.motifs.some((m) => m.motif === "hangingPiece" && m.index === 0)
    ? "hanging_piece"
    : "missed_threat";
}

/** Ideas about the king, in the order a coach would reach for them. */
function king(claims: Claim[], add: Add): void {
  const has = (k: Claim["kind"]) => claims.some((c) => c.kind === k);
  if (has("perpetual")) add("perpetual_check");
  if (has("back_rank")) add("back_rank");
  if (has("king_in_centre")) add("king_in_centre");
  if (has("shelter_weakened") || has("gave_up_king_defender")) add("king_shelter");
}

/** Ideas for a move that lost no material: the king, time, then pawns and rooks. */
function quiet(claims: Claim[], add: Add): void {
  const has = (k: Claim["kind"]) => claims.some((c) => c.kind === k);
  // A pawn taken and given back, with the position worse for it.
  if (has("pawn_grab") && (find(claims, "punishment")?.lost ?? 0) >= 0) add("greedy_grab");
  // A flank pawn pushed before the pieces are out: develop first, whatever else it weakens.
  if (has("neglected_development")) add("development");
  king(claims, add);
  add(ignoredThreat(claims));
  // A piece that gets chased and has to move again has lost time; the better move gaining
  // time on theirs is the same idea seen from the other side.
  if (has("one_move_threat") || claims.some((c) => c.kind === "tempo" && c.by === "opponent"))
    add("lost_time");
  if (claims.some((c) => c.kind === "tempo" && c.by === "user")) add("tempo_attack");
  if (claims.some((c) => c.kind === "passed_pawn" && c.side === "opponent")) add("passed_pawn");
  if (has("pawn_break")) add("pawn_break");
  if (has("rook_seventh")) add("rook_activity");
  if (claims.some((c) => c.kind === "passed_pawn" && c.side === "user")) add("passed_pawn");
  if (has("double_attack")) add("fork");
}

/** Concepts the claims support, the lesson's main one first. */
export function rankConcepts(kind: MistakeKind, claims: Claim[]): ConceptId[] {
  const picked: ConceptId[] = [];
  const add: Add = (c) => {
    if (c && !picked.includes(c)) picked.push(c);
  };
  const threat = find(claims, "threat");
  const punishment = find(claims, "punishment");
  const win = find(claims, "missed_win");
  const count = find(claims, "count");
  const free = find(claims, "free_capture");
  const has = (k: Claim["kind"]) => claims.some((c) => c.kind === k);

  if (kind === "mated") {
    add("mate_threat");
    if (punishment?.outcome.motifs.some((m) => m.motif === "backRankMate")) add("back_rank");
    if (has("removed_defender")) add("removed_own_defender");
    king(claims, add);
  } else if (kind === "loses_material") {
    // Something was there for the taking and the move lost less than it was worth.
    if (free && (punishment?.lost ?? 0) <= VALUES[free.took]) add("free_material");
    if (punishment) add(motifConcept(punishment.outcome));
    // Their threat carried out: the move didn't answer it (grabbing a pawn instead is greed).
    if (threat?.ignored) add(has("pawn_grab") ? "greedy_grab" : "missed_threat");
    if (has("pinned_target")) add("pin");
    if (has("removed_defender")) add("removed_own_defender");
    if (has("opened_line")) add("opened_line");
    if (has("pinned_defender")) add("false_defender");
    // Outnumbered only names the move's own mistake when it moved onto the square; a piece
    // already standing there fell for some other reason.
    if (count && count.defenders === 0 && !count.capture) add("hanging_piece");
    else if (count?.moved) add("count_attackers");
    king(claims, add);
  } else if (kind === "misses_mate") {
    add("mate_threat");
    if (win) add(motifConcept(win.outcome));
  } else if (kind === "misses_material") {
    // The win is the lesson when the better move itself takes something or starts the
    // tactic. When it only comes at the end of a long line, that isn't what the player
    // missed, so the lesson is about what the move itself did.
    if (has("double_attack")) add("fork");
    if (win) add(motifConcept(win.outcome, true));
    if (free) add("free_material");
    quiet(claims, add);
  } else {
    quiet(claims, add);
  }
  return picked;
}

/** The main and secondary concepts the claims support (null where nothing matches). */
export function chooseConcepts(
  kind: MistakeKind,
  claims: Claim[],
): { concept: ConceptId | null; secondary: ConceptId | null } {
  const ranked = rankConcepts(kind, claims);
  return { concept: ranked[0] ?? null, secondary: ranked[1] ?? null };
}
