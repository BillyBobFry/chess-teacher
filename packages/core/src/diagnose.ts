/**
 * Diagnose a move: confirm it was a mistake with a deeper search, then run the probes and
 * build the dossier of verified claims and the concepts they support.
 */

import { Position, opposite, parseSquare, type Colour } from "./board.ts";
import { settledBalance } from "./features.ts";
import {
  judgeLine,
  moveFacts,
  nullMoveFen,
  plainBalance,
  positionalFacts,
  winFacts,
  type Claim,
  type LineCapture,
  type LineOutcome,
} from "./claims.ts";
import { chooseConcepts, type ConceptId, type MistakeKind } from "./concepts.ts";
import { balanceOf, type Candidate, type Engine } from "./engine.ts";
import { Game, turnOf, uciParts } from "./game.ts";

export interface DiagnoseConfig {
  /** Depth of the search every move gets. */
  scanDepth: number;
  /** Candidates considered at scan depth. */
  scanMultipv: number;
  /** A move is looked at more closely when it loses this much at scan depth (centipawns). */
  scanGap: number;
  /** Depth of the search that confirms a mistake and supplies the lines. */
  confirmDepth: number;
  /** Depth of the threat probe. */
  threatDepth: number;
  /** A free move that would gain the opponent this many points of winning chances is a threat. */
  threatSwing: number;
  /** A mistake costs at least this many points of winning chances at confirm depth. */
  minDrop: number;
  /** Don't teach in positions already decided either way (winning chances, %). */
  decidedBelow: number;
  decidedAbove: number;
}

export const DIAGNOSE_CONFIG: DiagnoseConfig = {
  scanDepth: 12,
  scanMultipv: 3,
  scanGap: 35,
  confirmDepth: 16,
  threatDepth: 12,
  threatSwing: 20,
  minDrop: 8,
  decidedBelow: 8,
  decidedAbove: 92,
};

/** Winning chances (%) from centipawns, Lichess's formula. */
export const winChance = (cp: number): number => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);

const isMate = (score: number): boolean => balanceOf(score).kind === "mate";

export interface Dossier {
  fenBefore: string;
  userMove: string;
  user: Colour;
  bestMove: string;
  /** Winning chances for the user before and after the move, at confirm depth. */
  winBefore: number;
  winAfter: number;
  /** The material balance the user starts from (pawns; settled first when mid-exchange). */
  balanceBefore: number;
  kind: MistakeKind;
  claims: Claim[];
  concept: ConceptId | null;
  secondary: ConceptId | null;
}

export interface ScanResult {
  before: Candidate[];
  after: Candidate[];
}

/** The opponent's move before the user's (null at the start of a game). */
export interface PreviousMove {
  fen: string;
  move: string;
}

/**
 * Diagnose the user's move. Returns null when it wasn't a mistake worth a lesson. `scan` is
 * the analysis the game already ran at scan depth (searched here when missing).
 */
export async function diagnose(
  engine: Engine,
  fenBefore: string,
  userMove: string,
  previous: PreviousMove | null,
  cfg: DiagnoseConfig = DIAGNOSE_CONFIG,
  scan?: ScanResult,
): Promise<Dossier | null> {
  const user = turnOf(fenBefore);
  const opp = opposite(user);
  const game = new Game(fenBefore);
  game.push(userMove);
  if (game.isCheckmate()) return null;
  const over = game.isGameOver();

  const before =
    scan?.before ?? (await engine.analyse(fenBefore, { depth: cfg.scanDepth, multipv: cfg.scanMultipv }));
  const after =
    scan?.after ?? (over ? [] : await engine.analyse(game.fen, { depth: cfg.scanDepth, multipv: 1 }));
  const best = before[0];
  if (!best || best.move === userMove) return null;
  const gap = best.score - (over ? 0 : -(after[0]?.score ?? 0));
  if (gap < cfg.scanGap) return null;

  // Confirm deeper: depth-12 gaps are often noise the deeper search doesn't see.
  const deepBefore = await engine.analyse(fenBefore, { depth: cfg.confirmDepth, multipv: 1 });
  const deepBest = deepBefore[0];
  if (!deepBest || deepBest.move === userMove) return null;
  const deepAfter = over ? [] : await engine.analyse(game.fen, { depth: cfg.confirmDepth, multipv: 1 });
  const afterScore = over ? 0 : -(deepAfter[0]?.score ?? 0);
  const winBefore = winChance(deepBest.score);
  const winAfter = winChance(afterScore);
  if (winBefore < cfg.decidedBelow || winBefore > cfg.decidedAbove) return null;
  if (winBefore - winAfter < cfg.minDrop) return null;

  // The material the user starts from. Mid-exchange (the opponent just captured), taking back
  // is owed, not won, so the exchange is settled first.
  const midExchange =
    previous !== null && new Position(previous.fen).pieceAt(parseSquare(uciParts(previous.move).to)) !== null;
  const s0 = midExchange ? settledBalance(fenBefore, user) : plainBalance(fenBefore, user);
  const punish = judgeLine(
    game.fen,
    deepAfter[0]?.pv ?? [],
    opp,
    -s0,
    isMate(deepAfter[0]?.score ?? 0) && (deepAfter[0]?.score ?? 0) > 0,
  );
  const bestLine = judgeLine(fenBefore, deepBest.pv, user, s0, isMate(deepBest.score) && deepBest.score > 0);
  const lost = s0 + punish.balanceEnd;
  const gained = bestLine.balanceEnd + punish.balanceEnd;

  const kind: MistakeKind = punish.mates
    ? "mated"
    : lost >= 1
      ? "loses_material"
      : bestLine.mates
        ? "misses_mate"
        : gained >= 1 && bestLine.balanceEnd >= s0 + 1
          ? "misses_material"
          : "positional";

  const claims: Claim[] = [{ kind: "punishment", outcome: punish, lost }];
  if (kind === "misses_mate" || kind === "misses_material")
    claims.push({ kind: "missed_win", outcome: bestLine, gained });

  // The threat: what the opponent would do with a free move, and whether the move ignored it.
  const nm = nullMoveFen(fenBefore);
  if (nm) {
    const t = (await engine.analyse(nm, { depth: cfg.threatDepth, multipv: 1 }))[0];
    if (t) {
      const threat = judgeLine(nm, t.pv, opp, -s0, isMate(t.score) && t.score > 0);
      const wins = s0 + threat.balanceEnd;
      // How much a free move would be worth to them: beyond the normal value of a tempo, a threat.
      const swing = winBefore - (100 - winChance(t.score));
      if (threat.mates || wins >= 1 || swing >= cfg.threatSwing)
        claims.push({ kind: "threat", outcome: threat, wins, swing, ignored: sameIdea(threat, punish) });
    }
  }

  if ((kind === "loses_material" || kind === "mated") && punish.key) {
    claims.push(...moveFacts(fenBefore, [userMove, ...punish.line], shift(punish.key), user));
  }
  if (kind === "misses_material" || kind === "misses_mate") claims.push(...winFacts(fenBefore, bestLine));
  else claims.push({ kind: "best_line", outcome: bestLine });
  claims.push(...positionalFacts(fenBefore, userMove, punish.line, bestLine.line, user, midExchange));
  // The better move simply takes something the move left on the board.
  if (bestLine.key?.index === 0 && gained >= 1 && kind !== "mated")
    claims.push({ kind: "free_capture", square: bestLine.key.square, took: bestLine.key.took });

  const { concept, secondary } = chooseConcepts(kind, claims);
  return {
    fenBefore,
    userMove,
    user,
    bestMove: deepBest.move,
    winBefore,
    winAfter,
    balanceBefore: s0,
    kind,
    claims,
    concept,
    secondary,
  };
}

/** A capture from the punishment line, indexed from the user's move instead. */
const shift = (c: LineCapture): LineCapture => ({ ...c, index: c.index + 1 });

/** The punishment carries out the threat: the same first move, or the same capture. */
function sameIdea(threat: LineOutcome, punish: LineOutcome): boolean {
  if (threat.line[0] !== undefined && threat.line[0] === punish.line[0]) return true;
  if (
    threat.key &&
    punish.key &&
    threat.key.square === punish.key.square &&
    threat.key.took === punish.key.took
  )
    return true;
  return threat.mates && punish.mates;
}
