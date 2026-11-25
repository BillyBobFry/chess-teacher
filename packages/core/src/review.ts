/**
 * The post-game review as a tree: the line the game ended on, with each line the player left
 * behind (`SessionState.branches`) hanging off it where they went back, and every lesson on
 * the line where its mistake was played.
 */

import { Game, fullmoveOf, plyOf, sanOf, turnOf } from "./game.ts";
import type { Lesson, LessonStatus } from "./lessons.ts";
import type { SessionState } from "./session.ts";
import type { MoveRef } from "./text.ts";

export interface ReviewLine {
  /** The line's id (`SessionState.line`, `Branch.id`). */
  id: number;
  /** Index in its moves where it leaves the line it hangs off; 0 for the line the game ended on. */
  from: number;
  /** Its first move of its own: where it leaves the line it hangs off. Null for the game's line. */
  firstMove: MoveRef | null;
  /** Its lessons, and the lines hanging off it, in the order they happen along it. */
  items: ReviewItem[];
}

export type ReviewItem = { kind: "lesson"; lesson: Lesson } | { kind: "line"; line: ReviewLine };

const commonPrefix = (a: string[], b: string[]): number => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

/** Lessons the player can review: all but those whose moves were undone before they counted. */
export const reviewLessons = <L extends { status: LessonStatus }>(s: { lessons: L[] }): L[] =>
  s.lessons.filter((l) => l.status !== "rewound");

export function reviewTree(s: SessionState): ReviewLine {
  const start = plyOf(s.startFen);
  const lines = [{ id: s.line, moves: s.moves }, ...s.branches];

  // A line hangs off the later line it shares most moves with: the one the player went on to
  // play from where they went back. Later lines have larger ids, so this can't loop. On a tie,
  // the latest, so two tries from the same move sit side by side.
  const parent = new Map<number, { id: number; from: number }>();
  for (const b of s.branches) {
    let best: { id: number; from: number } | null = null;
    for (const other of lines) {
      if (other.id <= b.id) continue;
      const from = commonPrefix(b.moves, other.moves);
      if (!best || from > best.from || (from === best.from && other.id > best.id)) {
        best = { id: other.id, from };
      }
    }
    // Only a malformed save has no later line: hang it off the game's line, so nothing is lost.
    parent.set(b.id, best ?? { id: s.line, from: commonPrefix(b.moves, s.moves) });
  }

  const nodes = new Map<number, ReviewLine>();
  for (const l of lines) {
    const from = parent.get(l.id)?.from ?? 0;
    const own = l.moves[from];
    const fen = new Game(s.startFen, l.moves.slice(0, from)).fen;
    nodes.set(l.id, {
      id: l.id,
      from,
      firstMove:
        l.id === s.line || own === undefined
          ? null
          : { moveNumber: fullmoveOf(fen), colour: turnOf(fen), san: sanOf(fen, own) },
      items: [],
    });
  }
  const node = (id: number) => {
    const n = nodes.get(id);
    if (!n) throw new Error(`No line ${id}`);
    return n;
  };

  // Items carry their position along the line, for ordering.
  const placed = new Map<number, { at: number; order: number; item: ReviewItem }[]>();
  const place = (lineId: number, at: number, order: number, item: ReviewItem) => {
    const list = placed.get(lineId) ?? [];
    list.push({ at, order, item });
    placed.set(lineId, list);
  };

  // A lesson sits where its mistake was played: on a shared stretch of moves, that's the line
  // nearest the game's own.
  for (const lesson of reviewLessons(s)) {
    const at = lesson.ply - start;
    let lineId = nodes.has(lesson.line) ? lesson.line : s.line;
    for (let p = parent.get(lineId); p && at < p.from; p = parent.get(lineId)) lineId = p.id;
    // After a line hanging off at the same move: that one was played first.
    place(lineId, at, 1, { kind: "lesson", lesson });
  }

  // Lines with no lessons of their own anywhere down them have nothing to review.
  const build = (id: number): boolean => {
    let any = (placed.get(id) ?? []).length > 0;
    for (const b of s.branches) {
      if (parent.get(b.id)?.id !== id) continue;
      if (build(b.id)) {
        const child = node(b.id);
        place(id, child.from, 0, { kind: "line", line: child });
        any = true;
      }
    }
    node(id).items = (placed.get(id) ?? [])
      .sort((a, b) => a.at - b.at || a.order - b.order || idOf(a.item) - idOf(b.item))
      .map((p) => p.item);
    return any;
  };
  build(s.line);

  return node(s.line);
}

const idOf = (item: ReviewItem): number => (item.kind === "lesson" ? item.lesson.id : item.line.id);
