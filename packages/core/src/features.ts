/**
 * Strategic features measured in code, from one player's point of view.
 *
 * Every feature returns [value, detail]: a number where HIGHER IS BETTER for the player
 * being measured, and a short human-readable detail used in explanations. The LLM never
 * does this analysis; it only phrases what these functions found.
 */

import {
  FILE_NAMES,
  PIECE_NAMES,
  Position,
  VALUES,
  fileOf,
  legalCaptures,
  makeCapture,
  neg,
  opposite,
  rankOf,
  square,
  squareName,
  type Colour,
  type PieceType,
} from "./board.ts";

export type Measurement = [value: number, detail: string];

const CENTRE = [27, 28, 35, 36]; // d4, e4, d5, e5

const pieceDesc = (pos: Position, s: number): string => {
  const p = pos.pieceAt(s);
  return p ? `${PIECE_NAMES[p.type]} on ${squareName(s)}` : squareName(s);
};
const list = (squares: number[]): string => squares.map(squareName).join(", ");

// --------------------------------------------------------------------------- material

export function material(pos: Position, color: Colour): number {
  let total = 0;
  for (const p of pos.squares) if (p && p.color === color) total += VALUES[p.type];
  return total;
}

/**
 * Material balance for `color` after pending captures are resolved: a small capture-only
 * quiescence search, so that a position in the middle of an exchange isn't mistaken for
 * one side being a piece up.
 */
export function settledBalance(fen: string, color: Colour, depth = 6): number {
  const pos = new Position(fen);
  const squares = [...pos.squares];
  const mat: Record<Colour, number> = { w: material(pos, "w"), b: material(pos, "b") };
  const q = (turn: Colour, ep: number | null, alpha: number, beta: number, d: number): number => {
    const stand = mat[turn] - mat[opposite(turn)];
    if (d === 0 || stand >= beta) return stand;
    alpha = Math.max(alpha, stand);
    const captures = legalCaptures(squares, turn, ep)
      .map((c) => ({ c, key: VALUES[c.victim] * 10 - VALUES[c.attacker] }))
      .sort((a, b) => b.key - a.key);
    for (const { c } of captures) {
      const gained = VALUES[c.victim];
      const promoted = c.promotion ? VALUES[c.promotion] - VALUES.p : 0;
      const undo = makeCapture(squares, c);
      mat[opposite(turn)] -= gained;
      mat[turn] += promoted;
      const score = neg(q(opposite(turn), null, neg(beta), neg(alpha), d - 1));
      mat[opposite(turn)] += gained;
      mat[turn] -= promoted;
      undo();
      if (score >= beta) return score;
      alpha = Math.max(alpha, score);
    }
    return alpha;
  };
  const result = q(pos.turn, pos.epSquare, -1000, 1000, depth);
  return pos.turn === color ? result : neg(result);
}

/** Pieces attacked and undefended, or attacked by a cheaper piece (h8 → a1 order). */
export function hanging(pos: Position, color: Colour): number[] {
  const out: number[] = [];
  for (let s = 63; s >= 0; s--) {
    const p = pos.pieceAt(s);
    if (!p || p.color !== color || p.type === "k") continue;
    const attackers = pos.attackers(opposite(color), s);
    if (attackers.length === 0) continue;
    const cheapest = Math.min(
      ...attackers.map((a) => {
        const t = pos.pieceAt(a)!.type;
        return t === "k" ? 100 : VALUES[t];
      }),
    );
    if (pos.attackers(color, s).length === 0 || cheapest < VALUES[p.type]) out.push(s);
  }
  return out;
}

// --------------------------------------------------------------------------- development / king

const HOME_MINORS: Record<Colour, [number, PieceType][]> = {
  w: [
    [1, "n"],
    [6, "n"],
    [2, "b"],
    [5, "b"],
  ],
  b: [
    [57, "n"],
    [62, "n"],
    [58, "b"],
    [61, "b"],
  ],
};

export function undeveloped(pos: Position, color: Colour): number[] {
  return HOME_MINORS[color]
    .filter(([s, t]) => {
      const p = pos.pieceAt(s);
      return p && p.color === color && p.type === t;
    })
    .map(([s]) => s);
}

export function kingShield(pos: Position, color: Colour): number {
  const k = pos.king(color);
  if (k === null) return 0;
  const kf = fileOf(k);
  const kr = rankOf(k);
  const step = color === "w" ? 1 : -1;
  let count = 0;
  for (const f of [kf - 1, kf, kf + 1]) {
    for (const dr of [1, 2]) {
      const r = kr + step * dr;
      if (f >= 0 && f < 8 && r >= 0 && r < 8) {
        const p = pos.pieceAt(square(f, r));
        if (p && p.color === color && p.type === "p") count += 1;
      }
    }
  }
  return count;
}

export function kingZoneAttacks(pos: Position, color: Colour): number {
  const k = pos.king(color);
  if (k === null) return 0;
  const zone = [...pos.attacks(k), k];
  return zone.reduce((n, s) => n + pos.attackers(opposite(color), s).length, 0);
}

// --------------------------------------------------------------------------- activity

/** Pseudo-legal moves of knights, bishops, rooks and queens. */
export function mobility(pos: Position, color: Colour): number {
  let n = 0;
  for (let s = 0; s < 64; s++) {
    const p = pos.pieceAt(s);
    if (!p || p.color !== color || p.type === "p" || p.type === "k") continue;
    for (const t of pos.attacks(s)) if (pos.pieceAt(t)?.color !== color) n += 1;
  }
  return n;
}

export function centreControl(pos: Position, color: Colour): number {
  let score = 0;
  for (const s of CENTRE) {
    score += pos.attackers(color, s).length;
    const p = pos.pieceAt(s);
    if (p && p.color === color) score += p.type === "p" ? 2 : 1;
  }
  return score;
}

// --------------------------------------------------------------------------- pawns

const ahead = (color: Colour, rank: number, ofRank: number): boolean =>
  color === "w" ? rank > ofRank : rank < ofRank;

export interface PawnStructure {
  isolated: number[];
  doubled: number[];
  backward: number[];
  passed: number[];
}

export function pawnStructure(pos: Position, color: Colour): PawnStructure {
  const own = pos.pieces("p", color);
  const opp = pos.pieces("p", opposite(color));
  const files = new Array<number>(8).fill(0);
  for (const s of own) files[fileOf(s)]! += 1;
  const ps: PawnStructure = { isolated: [], doubled: [], backward: [], passed: [] };
  for (const s of own) {
    const f = fileOf(s);
    const r = rankOf(s);
    const adj = [f - 1, f + 1].filter((x) => x >= 0 && x < 8);
    if (files[f]! > 1) ps.doubled.push(s);
    const isIsolated = adj.every((a) => files[a] === 0);
    if (isIsolated) ps.isolated.push(s);
    if (!opp.some((o) => Math.abs(fileOf(o) - f) <= 1 && ahead(color, rankOf(o), r))) {
      ps.passed.push(s);
    } else if (!isIsolated) {
      const supportedLater = own.some((p) => adj.includes(fileOf(p)) && !ahead(color, rankOf(p), r));
      const stop = color === "w" ? s + 8 : s - 8;
      if (
        stop >= 0 &&
        stop < 64 &&
        !supportedLater &&
        pos.attackers(opposite(color), stop).some((a) => pos.pieceAt(a)?.type === "p")
      ) {
        ps.backward.push(s);
      }
    }
  }
  return ps;
}

export function pawnWeaknessCount(ps: PawnStructure): number {
  const doubledFiles = new Set(ps.doubled.map(fileOf));
  return ps.isolated.length + (ps.doubled.length - doubledFiles.size) + ps.backward.length;
}

export function describePawns(ps: PawnStructure): string {
  const parts: string[] = [];
  if (ps.isolated.length) parts.push(`isolated pawn(s) on ${list(ps.isolated)}`);
  if (ps.doubled.length) {
    const files = [...new Set(ps.doubled.map((s) => FILE_NAMES[fileOf(s)]!))].sort();
    parts.push(`doubled pawns on the ${files.map((f) => `${f}-file`).join(", ")}`);
  }
  if (ps.backward.length) parts.push(`backward pawn(s) on ${list(ps.backward)}`);
  return parts.join("; ") || "no pawn weaknesses";
}

export function outposts(pos: Position, color: Colour): number[] {
  const opp = pos.pieces("p", opposite(color));
  return pos.pieces("n", color).filter((s) => {
    const f = fileOf(s);
    const r = rankOf(s);
    const rel = color === "w" ? r : 7 - r;
    if (rel < 3 || rel > 5) return false;
    if (!pos.attackers(color, s).some((a) => pos.pieceAt(a)?.type === "p")) return false;
    return !opp.some((o) => Math.abs(fileOf(o) - f) === 1 && ahead(color, rankOf(o), r));
  });
}

export function rooksOnOpenFiles(pos: Position, color: Colour): number[] {
  const ownPawnFiles = new Set(pos.pieces("p", color).map(fileOf));
  return pos.pieces("r", color).filter((s) => !ownPawnFiles.has(fileOf(s)));
}

export function isEndgame(pos: Position): boolean {
  if (pos.pieces("q", "w").length || pos.pieces("q", "b").length) return false;
  let pieces = 0;
  for (const p of pos.squares) if (p && p.type !== "p") pieces += VALUES[p.type];
  return pieces <= 26;
}

export const centreDistance = (s: number): number =>
  Math.floor(Math.max(Math.abs(2 * fileOf(s) - 7), Math.abs(2 * rankOf(s) - 7)) / 2);

// --------------------------------------------------------------------------- registry

export type FeatureName =
  | "material"
  | "development"
  | "king_safety"
  | "centre"
  | "mobility"
  | "own_pawns"
  | "their_pawns"
  | "passed_pawns"
  | "outposts"
  | "open_files"
  | "king_activity";

export interface Feature {
  name: FeatureName;
  /** How big a change counts as "one significant step". */
  unit: number;
  principle: string;
  measure(pos: Position, color: Colour): Measurement;
}

const sides = (mine: number[], theirs: number[], label: string): string =>
  `your ${label}: ${list(mine) || "none"}; theirs: ${list(theirs) || "none"}`;

export const FEATURES: Feature[] = [
  {
    name: "material",
    unit: 1,
    principle: "safety",
    measure: (pos, c) => {
      const v = settledBalance(pos.fen, c);
      return [v, `material balance ${v >= 0 ? "+" : ""}${v}`];
    },
  },
  {
    name: "development",
    unit: 1,
    principle: "develop",
    measure: (pos, c) => {
      if (pos.fullmoveNumber > 20) return [0, "opening phase over"];
      const u = undeveloped(pos, c);
      return [
        neg(u.length),
        u.length
          ? `undeveloped: ${u.map((s) => pieceDesc(pos, s)).join(", ")}`
          : "all minor pieces developed",
      ];
    },
  },
  {
    name: "king_safety",
    unit: 1.5,
    principle: "king_safety",
    measure: (pos, c) => {
      // Without the enemy queen a mating attack is unlikely: treat the king as safe,
      // otherwise trading queens would look like a king-safety *loss*.
      if (pos.pieces("q", opposite(c)).length === 0)
        return [3, "the enemy queen is gone, so your king is fairly safe"];
      const shield = kingShield(pos, c);
      const attacks = kingZoneAttacks(pos, c);
      return [
        shield - 0.5 * attacks,
        `${shield} pawn(s) shielding the king, ${attacks} enemy attack(s) on the squares around it`,
      ];
    },
  },
  {
    name: "centre",
    unit: 3,
    principle: "centre",
    measure: (pos, c) => {
      const mine = centreControl(pos, c);
      const theirs = centreControl(pos, opposite(c));
      return [mine - theirs, `centre control ${mine} vs ${theirs}`];
    },
  },
  {
    name: "mobility",
    unit: 1.5,
    principle: "activity",
    measure: (pos, c) => {
      const mine = mobility(pos, c);
      const theirs = mobility(pos, opposite(c));
      return [(mine - theirs) / 5, `${mine} piece moves available vs opponent's ${theirs}`];
    },
  },
  {
    name: "own_pawns",
    unit: 1,
    principle: "pawn_weaknesses",
    measure: (pos, c) => {
      const ps = pawnStructure(pos, c);
      return [neg(pawnWeaknessCount(ps)), describePawns(ps)];
    },
  },
  {
    name: "their_pawns",
    unit: 1,
    principle: "target_weaknesses",
    measure: (pos, c) => {
      const ps = pawnStructure(pos, opposite(c));
      return [pawnWeaknessCount(ps), `opponent's pawns: ${describePawns(ps)}`];
    },
  },
  {
    name: "passed_pawns",
    unit: 1,
    principle: "passed_pawns",
    measure: (pos, c) => {
      const mine = pawnStructure(pos, c).passed;
      const theirs = pawnStructure(pos, opposite(c)).passed;
      return [mine.length - theirs.length, sides(mine, theirs, "passed pawns")];
    },
  },
  {
    name: "outposts",
    unit: 1,
    principle: "outposts",
    measure: (pos, c) => {
      const mine = outposts(pos, c);
      const theirs = outposts(pos, opposite(c));
      return [mine.length - theirs.length, sides(mine, theirs, "knight outposts")];
    },
  },
  {
    name: "open_files",
    unit: 1,
    principle: "open_files",
    measure: (pos, c) => {
      const mine = rooksOnOpenFiles(pos, c);
      const theirs = rooksOnOpenFiles(pos, opposite(c));
      return [mine.length - theirs.length, sides(mine, theirs, "rooks on open files")];
    },
  },
  {
    name: "king_activity",
    unit: 1,
    principle: "king_activity",
    measure: (pos, c) => {
      if (!isEndgame(pos)) return [0, "not an endgame yet"];
      const mine = pos.king(c);
      const theirs = pos.king(opposite(c));
      if (mine === null || theirs === null) return [0, ""];
      const dMine = centreDistance(mine);
      const dTheirs = centreDistance(theirs);
      return [
        dTheirs - dMine,
        `your king on ${squareName(mine)} is ${dMine} step(s) from the centre; ` +
          `theirs on ${squareName(theirs)} is ${dTheirs}`,
      ];
    },
  },
];

export const FEATURES_BY_NAME = Object.fromEntries(FEATURES.map((f) => [f.name, f])) as Record<
  FeatureName,
  Feature
>;

export type Measurements = Record<FeatureName, Measurement>;

export function measureAll(pos: Position, color: Colour): Measurements {
  return Object.fromEntries(FEATURES.map((f) => [f.name, f.measure(pos, color)])) as Measurements;
}
