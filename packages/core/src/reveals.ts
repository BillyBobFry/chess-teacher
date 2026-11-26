/**
 * Diagnosed lessons in play: the event each one waits for, whether the opponent has made it
 * happen, and what to tell the player happened. The loop is the one concept §3 describes;
 * only the trigger changes, from a measured feature crossing a threshold to an event the
 * dossier predicted (the material falls, the threat is played, the piece is chased).
 */

import { Position, opposite, parseSquare, type Colour } from "./board.ts";
import type { Claim } from "./claims.ts";
import type { Dossier } from "./diagnose.ts";
import { settledBalance } from "./features.ts";
import type { Game } from "./game.ts";
import { fullmoveOf, plyOf, sanOf, uciParts } from "./game.ts";
import {
  CONSEQUENCE,
  MISSED_CHANCE,
  lostMaterial,
  type Awaited,
  type DiagnosedLesson,
  type TeachingConfig,
} from "./lessons.ts";
import type { ConceptId } from "./concepts.ts";
import type { MoveRef, Trigger } from "./text.ts";

function find<K extends Claim["kind"]>(claims: Claim[], kind: K): Extract<Claim, { kind: K }> | undefined {
  return claims.find((c): c is Extract<Claim, { kind: K }> => c.kind === kind);
}

/**
 * A lesson from a dossier, waiting for the event its claims predict. `scores` are the
 * game's own evaluations (user's side) with the better move and after the move: the ones
 * the evaluation graph shows and later moves are compared with to see if the player fixed it.
 */
export function lessonFromDossier(
  id: number,
  /** The line of play it was made on (`SessionState.line`). */
  line: number,
  d: Dossier,
  scores: { best: number; user: number },
  cfg: TeachingConfig,
): DiagnosedLesson {
  const punishment = find(d.claims, "punishment");
  const better = find(d.claims, "missed_win") ?? find(d.claims, "best_line");
  const missed = d.kind === "misses_material" || d.kind === "misses_mate";
  return {
    source: "diagnosis",
    id,
    line,
    ply: plyOf(d.fenBefore),
    userColour: d.user,
    fenBefore: d.fenBefore,
    userMove: d.userMove,
    bestMove: d.bestMove,
    bestScore: scores.best,
    userScore: scores.user,
    kind: missed ? MISSED_CHANCE : CONSEQUENCE,
    userLine: [d.userMove, ...(punishment?.outcome.line ?? [])].slice(0, cfg.linePlies),
    bestLine: (better?.outcome.line.length ? better.outcome.line : [d.bestMove]).slice(0, cfg.linePlies),
    status: "pending",
    resolvedPly: null,
    trigger: null,
    deferred: false,
    foundCause: null,
    chanceMove: null,
    mistake: d.kind,
    claims: d.claims,
    concept: d.concept,
    secondary: d.secondary,
    awaits: awaitedFor(d),
    winBefore: d.winBefore,
    winAfter: d.winAfter,
  };
}

/**
 * What a positional mistake waits for, in the order a coach would point at it, with the
 * concepts each event shows. The event that shows the lesson's own concept comes first.
 */
function positionalEvents(claims: Claim[]): { awaits: Awaited; shows: ConceptId[] }[] {
  const out: { awaits: Awaited; shows: ConceptId[] }[] = [];
  for (const c of claims) {
    if (c.kind === "threat" && c.ignored && c.outcome.line[0])
      out.push({
        awaits: { kind: "move", move: c.outcome.line[0], why: "threat" },
        shows: ["missed_threat", "hanging_piece"],
      });
    if (c.kind === "tempo" && c.by === "opponent")
      out.push({
        awaits: { kind: "move", move: c.move, why: "chase", target: c.target },
        shows: ["lost_time", "tempo_attack", "bad_placement"],
      });
    if (c.kind === "one_move_threat")
      out.push({
        awaits: { kind: "move", move: c.reply, why: "chase", target: c.target },
        shows: ["lost_time"],
      });
    if (c.kind === "king_in_centre")
      out.push({ awaits: { kind: "check" }, shows: ["king_in_centre", "attack_the_king", "king_shelter"] });
    if (c.kind === "passed_pawn" && c.side === "opponent")
      out.push({ awaits: { kind: "pawn_moves", from: c.from }, shows: ["passed_pawn"] });
    if (c.kind === "rook_seventh" && c.side === "opponent")
      out.push({ awaits: { kind: "rook_on", square: c.square }, shows: ["rook_activity"] });
  }
  return out;
}

function awaitedFor(d: Dossier): Awaited {
  if (d.kind === "mated") return { kind: "mate" };
  if (d.kind === "misses_material" || d.kind === "misses_mate") return { kind: "chance" };
  if (d.kind === "loses_material") {
    const lost = find(d.claims, "punishment")?.lost ?? 1;
    // Most of it, so a pawn won back along the way doesn't keep the lesson waiting.
    return { kind: "material", balance: d.balanceBefore - 0.75 * lost };
  }
  const events = positionalEvents(d.claims);
  const own = events.find((e) => d.concept !== null && e.shows.includes(d.concept));
  return (own ?? events[0])?.awaits ?? { kind: "reply" };
}

/** Has the opponent's latest move (`last`, already played in `game`) made the event happen? */
export function awaitedHappened(lesson: DiagnosedLesson, game: Game, last: string): boolean {
  const a = lesson.awaits;
  switch (a.kind) {
    case "mate":
      return game.isCheckmate() && game.turn === lesson.userColour;
    case "material":
      return settledBalance(game.fen, lesson.userColour) <= a.balance;
    case "move":
      return last === a.move;
    case "check":
      return game.turn === lesson.userColour && game.chess.inCheck();
    case "pawn_moves":
      return uciParts(last).from === a.from;
    case "rook_on": {
      const p = new Position(game.fen).pieceAt(parseSquare(a.square));
      return p?.type === "r" && p.color !== lesson.userColour;
    }
    case "reply":
      return true;
    case "chance":
      return false;
  }
}

/** The opponent's latest move, as the player saw it. */
function moveRef(fenBefore: string, move: string, colour: Colour): MoveRef {
  return { moveNumber: fullmoveOf(fenBefore), colour, san: sanOf(fenBefore, move) };
}

/** What happened when the awaited event did: `fenBefore` is the position before `last`. */
export function describeAwaited(
  lesson: DiagnosedLesson,
  game: Game,
  last: string,
  fenBefore: string,
): Trigger {
  const them = opposite(lesson.userColour);
  const move = moveRef(fenBefore, last, them);
  const a = lesson.awaits;
  switch (a.kind) {
    case "mate":
      return { kind: "checkmated" };
    case "material":
      return lostMaterial(
        lesson.fenBefore,
        lesson.userColour,
        game,
        settledBalance(lesson.fenBefore, lesson.userColour),
      );
    case "move":
      if (a.why === "threat") return { kind: "threat_played", move };
      return {
        kind: "piece_chased",
        move,
        target: {
          piece: new Position(game.fen).pieceAt(parseSquare(a.target))?.type ?? "p",
          square: a.target,
        },
      };
    case "check":
      return { kind: "king_checked", move };
    case "pawn_moves":
      return { kind: "pawn_advanced", move };
    case "rook_on":
      return { kind: "rook_invaded", square: a.square };
    case "reply":
    case "chance":
      return { kind: "replied", move };
  }
}

/**
 * The missed chance is still on the board when the best move now keeps most of what the
 * better move was worth: the evaluation is nearer the one with the better move than the one
 * after the mistake.
 */
export const chanceStillThere = (lesson: DiagnosedLesson, bestNow: number): boolean =>
  bestNow >= (lesson.bestScore + lesson.userScore) / 2;
