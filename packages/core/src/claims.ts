/**
 * Claims: what the probes found about a move, as plain data. Each claim was checked by the
 * engine or by code before it is stored, and carries the moves and squares that show it.
 * The apps turn claims into sentences; the core never does.
 */

import { Chess } from "chess.js";
import { Position, VALUES, opposite, parseSquare, squareName, type Colour, type PieceType } from "./board.ts";
import { material, settledBalance } from "./features.ts";
import { uciParts } from "./game.ts";

/** A capture along an engine line. */
export interface LineCapture {
  /** Index in the line (0 = its first move). */
  index: number;
  move: string;
  by: Colour;
  /** The capturing piece. */
  piece: PieceType;
  /** Where it captured. */
  square: string;
  /** What it took. */
  took: PieceType;
}

/** Tactical patterns found along a line, named as Lichess's puzzle tagger names them. */
export type Motif =
  | "fork"
  | "pin"
  | "skewer"
  | "discoveredAttack"
  | "hangingPiece"
  | "capturingDefender"
  | "trappedPiece"
  | "backRankMate"
  | "mate"
  | "promotion";

export interface MotifFound {
  motif: Motif;
  /** Index in the line of the move that carries it out. */
  index: number;
  /** The squares involved: the piece that does it first, then its targets. */
  squares: string[];
}

/** What an engine line does for one side. */
export interface LineOutcome {
  /** The line, from its start position (legal moves only). */
  line: string[];
  /** The side the line is judged for. */
  side: Colour;
  /** It ends in mate for `side`. */
  mates: boolean;
  /** Material balance for `side` (pawn = 1) when the line is quiet, held for two plies. */
  balanceEnd: number;
  captures: LineCapture[];
  /** The capture by `side` that banks the gain (null when nothing is gained). */
  key: LineCapture | null;
  motifs: MotifFound[];
}

export type Claim =
  /** The opponent's best reply to the move, and what it wins. */
  | { kind: "punishment"; outcome: LineOutcome; lost: number }
  /** The better move's line, and what it wins that the move didn't. */
  | { kind: "missed_win"; outcome: LineOutcome; gained: number }
  /** The better line, when it wins nothing outright (kept for the motifs and plans it shows). */
  | { kind: "best_line"; outcome: LineOutcome }
  /** What the opponent threatened before the move (the turn passed to them): material, mate, or a big swing in winning chances. */
  | { kind: "threat"; outcome: LineOutcome; wins: number; swing: number; ignored: boolean }
  /** The move took away a defender of the square the opponent then wins. */
  | { kind: "removed_defender"; defender: string; square: string }
  /** The move opened a line that the opponent's capture goes through. */
  | { kind: "opened_line"; from: string; attacker: string; square: string }
  /** The square looked defended, but its only defender was pinned. */
  | { kind: "pinned_defender"; defender: string; square: string }
  /** The piece that falls was pinned (to the king, or to the queen), so it couldn't get away. */
  | { kind: "pinned_target"; square: string; by: string; behind: string }
  /** Attackers against defenders on the square where material is lost or won. */
  | { kind: "count"; square: string; attackers: number; defenders: number; moved: boolean; capture: boolean }
  /** A move attacks a piece, which must move (a gain of time): the better move, or the opponent's reply. */
  | { kind: "tempo"; move: string; target: string; by: "user" | "opponent" }
  /** The user's king is still in the centre, uncastled, and the punishment comes at it. */
  | { kind: "king_in_centre"; king: string; checks: number }
  /** The move weakened the pawns in front of the user's king. */
  | { kind: "shelter_weakened"; pawn: string; king: string }
  /** The punishment is a run of checks the user can't escape. */
  | { kind: "perpetual"; checks: number }
  /** The user's king on its back rank with no way out, and an enemy rook or queen reaching it. */
  | { kind: "back_rank"; king: string; by: string }
  /** A passed pawn runs: the opponent's in the punishment, or the user's in the better line. */
  | { kind: "passed_pawn"; side: "user" | "opponent"; from: string; to: string }
  /** A rook reaches the seventh rank (the opponent's second): the opponent's in the punishment, or the user's in the better line. */
  | { kind: "rook_seventh"; side: "user" | "opponent"; square: string }
  /** The better move is a pawn lever against an enemy pawn. */
  | { kind: "pawn_break"; move: string; target: string }
  /** The better move just takes a piece or pawn, and keeps it. */
  | { kind: "free_capture"; square: string; took: PieceType }
  /** The move attacked a piece that simply stepped away, gaining time against the piece that moved. */
  | { kind: "one_move_threat"; move: string; target: string; reply: string }
  /** The move traded off a minor piece that guarded the squares around the user's king. */
  | { kind: "gave_up_king_defender"; piece: string; squares: number }
  /** The better move attacks two pieces at once. */
  | { kind: "double_attack"; move: string; targets: string[] }
  /** The move took a pawn, and the opponent's activity is worth more. */
  | { kind: "pawn_grab"; square: string }
  /** In the opening, a flank pawn move while minor pieces still sit at home. */
  | { kind: "neglected_development"; pawn: string; undeveloped: number };

// --------------------------------------------------------------------------- lines

const balance = (pos: Position, side: Colour): number => material(pos, side) - material(pos, opposite(side));

/** Positions along a line: index 0 is the start, i + 1 is after line[i]. */
function walk(fen: string, line: readonly string[]): { fens: string[]; moves: ReturnType<Chess["move"]>[] } {
  const chess = new Chess(fen);
  const fens = [chess.fen()];
  const moves: ReturnType<Chess["move"]>[] = [];
  for (const uci of line) {
    let m;
    try {
      m = chess.move(uciParts(uci));
    } catch {
      break;
    }
    moves.push(m);
    fens.push(chess.fen());
  }
  return { fens, moves };
}

/**
 * Judge a line for `side`: the material it holds once quiet, the captures, the capture that
 * banks the gain over `startBalance`, and the motifs along the way.
 */
export function judgeLine(
  fen: string,
  rawLine: readonly string[],
  side: Colour,
  startBalance: number,
  mateScore: boolean,
): LineOutcome {
  const { fens, moves } = walk(fen, rawLine);
  const line = moves.map((m) => m.lan);
  const last = fens.length - 1;
  const settledAt = (i: number) => settledBalance(fens[i] ?? fen, side);
  // The two last positions settle to the same balance unless the line stops mid-exchange,
  // and the lower of them is what the side can count on.
  const balanceEnd = last >= 1 ? Math.min(settledAt(last), settledAt(last - 1)) : settledAt(last);
  const captures: LineCapture[] = moves.flatMap((m, index) =>
    m.captured ? [{ index, move: m.lan, by: m.color, piece: m.piece, square: m.to, took: m.captured }] : [],
  );
  const key = balanceEnd >= startBalance + 1 || mateScore ? netKey(captures, side) : null;
  const chessEnd = new Chess(fens[last] ?? fen);
  const mates = mateScore || (chessEnd.isCheckmate() && chessEnd.turn() !== side);
  const outcome: LineOutcome = { line, side, mates, balanceEnd, captures, key, motifs: [] };
  outcome.motifs = findMotifs(fens, moves, outcome);
  return outcome;
}

/**
 * The capture that wins what the line wins: equal trades along the way cancel out (a knight
 * for a bishop, a queen for a queen), and the first capture of what's left is the win. A
 * trade is the capture and the recapture, so each loss cancels the equal capture nearest it
 * in the line, not the first one: a pawn won early is still won after a pawn swap later.
 */
export function netKey(captures: readonly LineCapture[], side: Colour): LineCapture | null {
  const won = captures.filter((c) => c.by === side);
  for (const lost of captures.filter((c) => c.by !== side)) {
    let best = -1;
    won.forEach((w, i) => {
      if (VALUES[w.took] !== VALUES[lost.took]) return;
      if (best === -1 || Math.abs(w.index - lost.index) < Math.abs((won[best]?.index ?? 0) - lost.index))
        best = i;
    });
    if (best !== -1) won.splice(best, 1);
  }
  return won[0] ?? null;
}

// --------------------------------------------------------------------------- motifs

const DIRS: Record<"r" | "b", [number, number][]> = {
  r: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
  b: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
};

const fileRank = (s: number): [number, number] => [s & 7, s >> 3];
const onBoard = (f: number, r: number) => f >= 0 && f < 8 && r >= 0 && r < 8;

/** The first two pieces along a ray from a slider, if any. */
function rayPieces(pos: Position, from: number, d: [number, number]): number[] {
  const out: number[] = [];
  let [f, r] = fileRank(from);
  for (;;) {
    f += d[0];
    r += d[1];
    if (!onBoard(f, r)) return out;
    const s = f + 8 * r;
    if (pos.pieceAt(s)) {
      out.push(s);
      if (out.length === 2) return out;
    }
  }
}

const sliderDirs = (t: PieceType): [number, number][] =>
  t === "r" ? DIRS.r : t === "b" ? DIRS.b : t === "q" ? [...DIRS.r, ...DIRS.b] : [];

const worth = (t: PieceType): number => (t === "k" ? 100 : VALUES[t]);

/** Enemy pieces `side` attacks from `s` that are worth winning: the king, a more valuable piece, or an undefended one. */
function targetsFrom(pos: Position, s: number, side: Colour): number[] {
  const me = pos.pieceAt(s);
  if (!me) return [];
  return pos.attacks(s).filter((t) => {
    const p = pos.pieceAt(t);
    if (!p || p.color === side) return false;
    if (p.type === "k") return true;
    return worth(p.type) > worth(me.type) || pos.attackers(p.color, t).length === 0;
  });
}

/** Pieces of `victim` pinned by `side`'s sliders to their king or to a more valuable piece. */
function pinned(pos: Position, side: Colour): { pinned: number; by: number; behind: number }[] {
  const out: { pinned: number; by: number; behind: number }[] = [];
  for (let s = 0; s < 64; s++) {
    const p = pos.pieceAt(s);
    if (!p || p.color !== side) continue;
    for (const d of sliderDirs(p.type)) {
      const [a, b] = rayPieces(pos, s, d);
      if (a === undefined || b === undefined) continue;
      const pa = pos.pieceAt(a);
      const pb = pos.pieceAt(b);
      if (!pa || !pb || pa.color === side || pb.color === side) continue;
      // Pinned to the king, or to the queen by a cheaper piece: pins a coach would name.
      if (
        pb.type === "k" ||
        (pb.type === "q" && worth(p.type) < worth(pb.type) && worth(pa.type) < worth(pb.type))
      )
        out.push({ pinned: a, by: s, behind: b });
    }
  }
  return out;
}

function backRankMate(fen: string, mated: Colour): boolean {
  const pos = new Position(fen);
  const k = pos.king(mated);
  if (k === null) return false;
  const home = mated === "w" ? 0 : 7;
  if (k >> 3 !== home) return false;
  // Boxed in by its own pieces, and mated along the back rank.
  const up = mated === "w" ? 1 : -1;
  for (const df of [-1, 0, 1]) {
    const f = (k & 7) + df;
    if (f < 0 || f > 7) continue;
    if (pos.pieceAt(f + 8 * (home + up))?.color !== mated) return false;
  }
  return pos.attackers(opposite(mated), k).some((c) => {
    const p = pos.pieceAt(c);
    return (p?.type === "r" || p?.type === "q") && c >> 3 === home;
  });
}

/**
 * Motifs along a line, for the side it is judged for. Only patterns that lead to the gain
 * count: a fork whose target is later taken, a pin on a piece that is later taken, and so on.
 */
function findMotifs(fens: string[], moves: ReturnType<Chess["move"]>[], o: LineOutcome): MotifFound[] {
  const found: MotifFound[] = [];
  const add = (m: MotifFound) => {
    if (!found.some((f) => f.motif === m.motif)) found.push(m);
  };
  // Look only as far as the gain is banked (or the whole line for mate).
  // Only patterns that win something count: up to the capture that banks the gain, or mate.
  const horizon = o.key ? o.key.index : o.mates ? moves.length - 1 : -1;
  if (horizon < 0) return found;
  const keyFrom = o.key ? parseSquare(uciParts(o.key.move).from) : -1;
  const takenLater = (from: number, squares: number[]) =>
    o.captures.some(
      (c) =>
        c.by === o.side &&
        c.index > from &&
        c.index <= horizon + 2 &&
        squares.includes(parseSquare(c.square)),
    );

  for (let i = 0; i <= horizon && i < moves.length; i++) {
    const m = moves[i];
    if (!m || m.color !== o.side) continue;
    const before = new Position(fens[i] ?? "");
    const after = new Position(fens[i + 1] ?? "");
    const to = parseSquare(m.to);

    // Fork: the moved piece attacks two targets, and one of them falls.
    const targets = targetsFrom(after, to, o.side);
    if (
      targets.length >= 2 &&
      (takenLater(i, targets) || (o.mates && targets.some((t) => after.pieceAt(t)?.type === "k")))
    )
      add({ motif: "fork", index: i, squares: [m.to, ...targets.map(squareName)] });

    // Discovered attack: moving this piece uncovers another's attack on something that falls.
    for (let s = 0; s < 64; s++) {
      const p = after.pieceAt(s);
      if (!p || p.color !== o.side || s === to || sliderDirs(p.type).length === 0) continue;
      const newly = after.attacks(s).filter((t) => {
        const q = after.pieceAt(t);
        return q && q.color !== o.side && !before.attacks(s).includes(t);
      });
      const check = newly.some((t) => after.pieceAt(t)?.type === "k");
      const wins =
        o.key !== null && i < o.key.index && keyFrom === s && newly.includes(parseSquare(o.key.square));
      if (check || wins)
        add({ motif: "discoveredAttack", index: i, squares: [squareName(s), ...newly.map(squareName)] });
    }

    // Skewer: a slider attacks a valuable piece; it moves and the piece behind it falls.
    const mover = after.pieceAt(to);
    if (mover) {
      for (const d of sliderDirs(mover.type)) {
        const [a, b] = rayPieces(after, to, d);
        if (a === undefined || b === undefined) continue;
        const pa = after.pieceAt(a);
        const pb = after.pieceAt(b);
        if (!pa || !pb || pa.color === o.side || pb.color === o.side) continue;
        const next = moves[i + 2];
        if (
          worth(pa.type) > worth(pb.type) &&
          next &&
          next.from === m.to &&
          parseSquare(next.to) === b &&
          moves[i + 1]?.from === squareName(a)
        )
          add({ motif: "skewer", index: i, squares: [m.to, squareName(a), squareName(b)] });
      }
    }

    // A capture: of a pinned piece, of a defender, of a loose piece, or of a piece with nowhere to go.
    if (m.captured) {
      const victim = to;
      if (
        o.key &&
        i === o.key.index &&
        m.captured !== "p" &&
        worth(m.piece) < worth(m.captured) &&
        pinned(before, o.side).some((p) => p.pinned === victim)
      )
        add({ motif: "pin", index: i, squares: [m.to] });
      const defended = before.attackers(opposite(o.side), victim);
      if (defended.length === 0 && o.key && i === o.key.index && i <= 1)
        add({ motif: "hangingPiece", index: i, squares: [m.to] });
      // Capturing a defender: the piece taken was guarding what is taken next.
      const next = o.captures.find((c) => c.by === o.side && c.index > i && c.index <= horizon + 2);
      if (
        next &&
        o.key &&
        next.index === o.key.index &&
        before.attacks(victim).includes(parseSquare(next.square)) &&
        next.square !== m.to
      )
        add({ motif: "capturingDefender", index: i, squares: [m.to, next.square] });
    }
    // A pin set up by this move, on a piece that then falls.
    for (const p of pinned(after, o.side)) {
      if (p.by === to && takenLater(i, [p.pinned, p.behind]))
        add({ motif: "pin", index: i, squares: [m.to, squareName(p.pinned), squareName(p.behind)] });
    }
    if (m.promotion) add({ motif: "promotion", index: i, squares: [m.to] });
  }
  if (o.mates) {
    const lastFen = fens[fens.length - 1] ?? "";
    const chess = new Chess(lastFen);
    if (chess.isCheckmate() && backRankMate(lastFen, chess.turn()))
      add({ motif: "backRankMate", index: moves.length - 1, squares: [] });
    add({ motif: "mate", index: moves.length - 1, squares: [] });
  }
  return found;
}

// --------------------------------------------------------------------------- move facts

/** Position just before the capture at `index` of a line from `fen`. */
export function positionBefore(fen: string, line: readonly string[], index: number): Position {
  return new Position(walk(fen, line.slice(0, index)).fens.at(-1) ?? fen);
}

/**
 * What the move itself did to the square where material is then lost: took away its
 * defender, opened the line the capture goes through, or left it to a pinned defender.
 * `line` starts with the move.
 */
export function moveFacts(
  fenBefore: string,
  line: readonly string[],
  key: LineCapture,
  user: Colour,
): Claim[] {
  const claims: Claim[] = [];
  const move = uciParts(line[0] ?? "");
  const target = parseSquare(key.square);
  const start = new Position(fenBefore);
  const atCapture = positionBefore(fenBefore, line, key.index);
  const moverFrom = parseSquare(move.from);
  const moverTo = parseSquare(move.to);

  // A defender that guarded the piece before the move and no longer does when it falls.
  const stood = start.pieceAt(target);
  const defendersBefore = start.attackers(user, target);
  const defendersAt = atCapture.attackers(user, target);
  if (stood?.color === user && target !== moverTo && defendersAt.length < defendersBefore.length) {
    const defender = defendersBefore.includes(moverFrom)
      ? moverFrom
      : (defendersBefore.find((d) => !defendersAt.includes(d)) ?? moverFrom);
    claims.push({ kind: "removed_defender", defender: squareName(defender), square: key.square });
  }

  // The capturing piece's line to the square runs through where the moved piece stood.
  const attackerFrom = parseSquare(uciParts(key.move).from);
  if (target !== moverTo && between(attackerFrom, target).includes(moverFrom)) {
    claims.push({
      kind: "opened_line",
      from: move.from,
      attacker: squareName(attackerFrom),
      square: key.square,
    });
  }

  // Its defenders, and whether the only one is pinned.
  const attackers = atCapture.attackers(opposite(user), target).length;
  const pins = pinned(atCapture, opposite(user)).map((p) => p.pinned);
  const real = defendersAt.filter((d) => !pins.includes(d));
  if (defendersAt.length > 0 && real.length === 0) {
    claims.push({ kind: "pinned_defender", defender: squareName(defendersAt[0] ?? 0), square: key.square });
  }
  // The piece that falls was pinned, just after the move or when it is taken.
  const afterMove = positionBefore(fenBefore, line, 1);
  const pin = [afterMove, atCapture]
    .flatMap((pos) => pinned(pos, opposite(user)))
    .find((p) => p.pinned === target);
  if (pin)
    claims.push({
      kind: "pinned_target",
      square: key.square,
      by: squareName(pin.by),
      behind: squareName(pin.behind),
    });
  const capture = start.pieceAt(moverTo) !== null;
  claims.push({
    kind: "count",
    square: key.square,
    attackers,
    defenders: defendersAt.length,
    moved: target === moverTo,
    capture,
  });
  return claims;
}

/** Squares strictly between two squares on a rank, file or diagonal (empty otherwise). */
function between(a: number, b: number): number[] {
  const [fa, ra] = fileRank(a);
  const [fb, rb] = fileRank(b);
  const df = Math.sign(fb - fa);
  const dr = Math.sign(rb - ra);
  if (!(fa === fb || ra === rb || Math.abs(fb - fa) === Math.abs(rb - ra)) || a === b) return [];
  const out: number[] = [];
  let f = fa + df;
  let r = ra + dr;
  while (f !== fb || r !== rb) {
    out.push(f + 8 * r);
    f += df;
    r += dr;
  }
  return out;
}

/** Facts about a missed win: the count on the square it wins, and whether its first move attacks a piece. */
export function winFacts(fenBefore: string, o: LineOutcome): Claim[] {
  const claims: Claim[] = [];
  const first = o.line[0];
  if (!first) return claims;
  if (o.key) {
    const at = positionBefore(fenBefore, o.line, o.key.index);
    const target = parseSquare(o.key.square);
    claims.push({
      kind: "count",
      square: o.key.square,
      attackers: at.attackers(o.side, target).length,
      defenders: at.attackers(opposite(o.side), target).length,
      moved: false,
      capture: false,
    });
  }
  const after = positionBefore(fenBefore, o.line, 1);
  const to = parseSquare(uciParts(first).to);
  const hit = targetsFrom(after, to, o.side).filter((t) => after.pieceAt(t)?.type !== "k");
  const isCapture = new Position(fenBefore).pieceAt(to) !== null;
  if (hit.length > 0 && !isCapture)
    claims.push({ kind: "tempo", move: first, target: squareName(hit[0] ?? 0), by: "user" });
  return claims;
}

/** The position with the turn passed (null when that would be illegal or meaningless). */
export function nullMoveFen(fen: string): string | null {
  const c = new Chess(fen);
  if (c.inCheck()) return null;
  const parts = fen.split(" ");
  parts[1] = parts[1] === "w" ? "b" : "w";
  parts[3] = "-";
  try {
    const flipped = new Chess(parts.join(" "));
    return flipped.inCheck() ? null : flipped.fen();
  } catch {
    return null;
  }
}

export const plainBalance = (fen: string, side: Colour): number => balance(new Position(fen), side);

// --------------------------------------------------------------------------- positional facts

const homeRank = (c: Colour): number => (c === "w" ? 0 : 7);
const relRank = (s: number, c: Colour): number => (c === "w" ? s >> 3 : 7 - (s >> 3));

function isPassed(pos: Position, s: number, c: Colour): boolean {
  const f = s & 7;
  const r = s >> 3;
  for (const ef of [f - 1, f, f + 1]) {
    if (ef < 0 || ef > 7) continue;
    for (const e of pos.pieces("p", opposite(c))) {
      if ((e & 7) !== ef) continue;
      if (c === "w" ? e >> 3 > r : e >> 3 < r) return false;
    }
  }
  return true;
}

/** Passed pawns of `c` that advance at least two squares along a line from `fen`. */
function passedRuns(fen: string, line: readonly string[], c: Colour): { from: string; to: string }[] {
  const { fens, moves } = walk(fen, line);
  const runs = new Map<string, { from: string; to: string; steps: number }>();
  moves.forEach((m, i) => {
    if (m.color !== c || m.piece !== "p" || m.captured) return;
    const pos = new Position(fens[i] ?? fen);
    const from = parseSquare(m.from);
    if (!isPassed(pos, from, c)) return;
    // Follow the same pawn: a run is keyed by where it currently stands.
    const prev = runs.get(m.from);
    runs.delete(m.from);
    const steps = (prev?.steps ?? 0) + Math.abs((parseSquare(m.to) >> 3) - (from >> 3));
    runs.set(m.to, { from: prev?.from ?? m.from, to: m.to, steps });
  });
  return [...runs.values()].filter((r) => r.steps >= 2).map(({ from, to }) => ({ from, to }));
}

function rookSeventh(fen: string, line: readonly string[], c: Colour): string | null {
  const { moves } = walk(fen, line);
  for (const m of moves) {
    if (
      m.color === c &&
      (m.piece === "r" || m.piece === "q") &&
      relRank(parseSquare(m.to), c) === 6 &&
      m.piece === "r"
    )
      return m.to;
  }
  return null;
}

/** The king can't step off its back rank: every square in front is its own piece or attacked. */
function noLuft(pos: Position, c: Colour): boolean {
  const k = pos.king(c);
  if (k === null || k >> 3 !== homeRank(c)) return false;
  const up = c === "w" ? 1 : -1;
  for (const df of [-1, 0, 1]) {
    const f = (k & 7) + df;
    if (f < 0 || f > 7) continue;
    const s = f + 8 * ((k >> 3) + up);
    const p = pos.pieceAt(s);
    if (p && p.color === c) continue;
    if (pos.attackers(opposite(c), s).length > 0) continue;
    return false;
  }
  return true;
}

/**
 * Positional facts about a move: what the punishment (from after the move) and the better
 * line (from before it) show about kings, pawns, rooks and time.
 */
export function positionalFacts(
  fenBefore: string,
  userMove: string,
  punishLine: readonly string[],
  bestLine: readonly string[],
  user: Colour,
  recapture: boolean,
): Claim[] {
  const claims: Claim[] = [];
  const opp = opposite(user);
  const start = new Position(fenBefore);
  const { fens: pFens, moves: pMoves } = walk(fenBefore, [userMove, ...punishLine]);
  const after = new Position(pFens[1] ?? fenBefore);
  const move = pMoves[0];
  if (!move) return claims;
  const oppMoves = pMoves.filter((m) => m.color === opp);
  const checks = oppMoves.filter((m) => m.san.includes("+")).length;

  // The king in the centre: uncastled on c-f with no castling done, and the punishment checks it.
  const k = after.king(user);
  if (
    k !== null &&
    (k & 7) >= 2 &&
    (k & 7) <= 5 &&
    relRank(k, user) <= 1 &&
    start.fullmoveNumber >= 6 &&
    checks >= 2
  ) {
    claims.push({ kind: "king_in_centre", king: squareName(k), checks });
  }

  // The shelter: a pawn move next to the user's king, on the king's side of the board.
  const king = start.king(user);
  if (
    king !== null &&
    move.piece === "p" &&
    Math.abs((parseSquare(move.from) & 7) - (king & 7)) <= 1 &&
    relRank(parseSquare(move.from), user) <= 2 &&
    (king & 7) !== 3 &&
    (king & 7) !== 4
  ) {
    claims.push({ kind: "shelter_weakened", pawn: move.from, king: squareName(king) });
  }

  // Perpetual check: the opponent's moves are nearly all checks.
  if (oppMoves.length >= 3 && checks >= Math.max(3, oppMoves.length - 1))
    claims.push({ kind: "perpetual", checks });

  // The back rank: a king with no way out, and an enemy heavy piece landing on that rank.
  const landing = oppMoves.find(
    (m) => (m.piece === "r" || m.piece === "q") && parseSquare(m.to) >> 3 === homeRank(user),
  );
  if (k !== null && noLuft(after, user) && landing)
    claims.push({ kind: "back_rank", king: squareName(k), by: landing.to });

  for (const r of passedRuns(pFens[1] ?? fenBefore, punishLine, opp))
    claims.push({ kind: "passed_pawn", side: "opponent", ...r });
  for (const r of passedRuns(fenBefore, bestLine, user))
    claims.push({ kind: "passed_pawn", side: "user", ...r });
  const r7o = rookSeventh(pFens[1] ?? fenBefore, punishLine, opp);
  if (r7o) claims.push({ kind: "rook_seventh", side: "opponent", square: r7o });
  const r7u = rookSeventh(fenBefore, bestLine.slice(0, 5), user);
  if (r7u) claims.push({ kind: "rook_seventh", side: "user", square: r7u });

  // The better move as a pawn lever, or as a move that attacks a piece.
  const best = bestLine[0];
  if (best) {
    const bm = walk(fenBefore, [best]).moves[0];
    const bAfter = new Position(walk(fenBefore, [best]).fens[1] ?? fenBefore);
    if (bm && bm.piece === "p" && !bm.captured) {
      const to = parseSquare(bm.to);
      const levers = bAfter
        .attacks(to)
        .filter((t) => bAfter.pieceAt(t)?.type === "p" && bAfter.pieceAt(t)?.color === opp);
      if (levers.length) claims.push({ kind: "pawn_break", move: best, target: squareName(levers[0] ?? 0) });
    }
    if (bm && !bm.captured) {
      const hit = targetsFrom(bAfter, parseSquare(bm.to), user).filter((t) => {
        const tp = bAfter.pieceAt(t);
        return tp !== null && tp.type !== "k" && tp.type !== "p";
      });
      if (hit.length) claims.push({ kind: "tempo", move: best, target: squareName(hit[0] ?? 0), by: "user" });
    }
  }
  // The opponent's reply chases a piece (often the one just moved, or the queen).
  const reply = pMoves[1];
  if (reply && !reply.captured) {
    const pos = new Position(pFens[2] ?? fenBefore);
    const hit = targetsFrom(pos, parseSquare(reply.to), opp).filter((t) => {
      const tp = pos.pieceAt(t);
      return tp !== null && tp.type !== "k" && tp.type !== "p" && worth(tp.type) > worth(reply.piece);
    });
    if (hit.length)
      claims.push({ kind: "tempo", move: reply.lan, target: squareName(hit[0] ?? 0), by: "opponent" });
  }

  // A one-move threat: the move attacks a piece, and the reply moves that piece away while
  // attacking the piece that moved.
  if (reply && !move.captured) {
    const hitByMove = targetsFrom(after, parseSquare(move.to), user);
    const replyAttacks = new Position(pFens[2] ?? fenBefore).attacks(parseSquare(reply.to));
    if (hitByMove.includes(parseSquare(reply.from)) && replyAttacks.includes(parseSquare(move.to)))
      claims.push({ kind: "one_move_threat", move: move.lan, target: reply.from, reply: reply.lan });
  }

  // The king's defender: a minor piece that guarded squares around the king, traded off.
  if (
    king !== null &&
    move.captured &&
    (move.piece === "b" || move.piece === "n") &&
    reply &&
    reply.to === move.to
  ) {
    const around = start.attacks(king);
    const guarded = start.attacks(parseSquare(move.from)).filter((sq) => around.includes(sq)).length;
    if (guarded >= 2) claims.push({ kind: "gave_up_king_defender", piece: move.from, squares: guarded });
  }

  // The better move attacks two pieces at once.
  if (best) {
    const { fens: bf, moves: bm } = walk(fenBefore, [best]);
    const b0 = bm[0];
    if (b0) {
      const pos = new Position(bf[1] ?? fenBefore);
      const targets = targetsFrom(pos, parseSquare(b0.to), user).filter((t) => pos.pieceAt(t)?.type !== "p");
      if (targets.length >= 2)
        claims.push({ kind: "double_attack", move: best, targets: targets.map(squareName) });
    }
  }

  // Development: early on, a pawn move off the centre files while two or more knights and
  // bishops are still on their first squares.
  const homeMinors = [1, 2, 5, 6].filter((f) => {
    const p = start.pieceAt(f + 8 * homeRank(user));
    return p?.color === user && (p.type === "n" || p.type === "b");
  }).length;
  const file = parseSquare(move.from) & 7;
  if (
    start.fullmoveNumber <= 15 &&
    move.piece === "p" &&
    !move.captured &&
    (file < 2 || file > 4) &&
    homeMinors >= 2
  ) {
    claims.push({ kind: "neglected_development", pawn: move.from, undeveloped: homeMinors });
  }

  // A pawn grab: the move took a pawn and nothing was lost back, yet it cost a lot.
  if (move.captured === "p" && !recapture) claims.push({ kind: "pawn_grab", square: move.to });
  return claims;
}
