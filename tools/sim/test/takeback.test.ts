/** Taking back the user's latest move, at every point of the recorded games. */

import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  canTakeBack,
  detectMistake,
  gameOf,
  isUserTurn,
  newSession,
  playedLine,
  plyOf,
  takeBack,
  type GameEvent,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import { enginesFor, loadGames, startOf, step } from "./games.ts";

interface Point {
  /** The state at the start of the user's turn, before their move. */
  before: SessionState;
  /** Lesson events from the user's move. */
  events: GameEvent[];
  /** After the user's move, and after the opponent's reply. */
  afterMove: SessionState;
  afterReply: SessionState | null;
}

function defined<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`Expected ${what}`);
  return value;
}

const lessonIn = (s: SessionState, id: number): Lesson =>
  defined(
    s.lessons.find((l) => l.id === id),
    `lesson ${id}`,
  );

async function replay(name: string): Promise<{ first: SessionState; points: Point[] }> {
  const { game: g } = defined(
    loadGames().find((x) => x.name === name),
    name,
  );
  const e = enginesFor(g);
  let state = startOf(g);
  const first = state;
  const points: Point[] = [];
  for (const s of g.steps) {
    const r = await step(state, s, e);
    if (s.type === "userMove") {
      points.push({ before: state, events: r.events, afterMove: r.state, afterReply: null });
    } else if (s.type === "opponentMove") {
      const last = points.at(-1);
      if (last && !last.afterReply) last.afterReply = r.state;
    }
    state = r.state;
  }
  return { first, points };
}

describe("takeBack", () => {
  it("returns to the user's turn before their latest move, whether or not the opponent replied", async () => {
    for (const name of ["game-01.json", "game-02.json"]) {
      const { first, points } = await replay(name);
      expect(canTakeBack(first)).toBe(false);
      expect(takeBack(first)).toBeNull();
      for (const p of points) {
        for (const after of [p.afterMove, p.afterReply]) {
          if (!after) continue;
          const back = defined(takeBack(after), "a takeback");
          expect(back.moves).toEqual(p.before.moves);
          expect(back.opponentModes).toEqual(p.before.opponentModes);
          expect(back.scores).toEqual(p.before.scores);
          expect(isUserTurn(back)).toBe(true);
          expect(gameOf(back).fen).toBe(gameOf(p.before).fen);
          for (const { kind, lessonId } of p.events) {
            if (kind !== "created") continue;
            // A lesson the move made no longer counts, unless the reply already revealed it.
            const revealed = lessonIn(after, lessonId).status === "triggered";
            expect(lessonIn(back, lessonId).status).toBe(revealed ? "triggered" : "rewound");
          }
        }
      }
    }
  });

  it("makes a lesson pending again when the taken-back move had fixed it", () => {
    // 1. e4 e5 2. Ba6 left the bishop to the knight; 3. Bc4, after 2...d6, saved it.
    const moves = ["e2e4", "e7e5", "f1a6", "d7d6", "a6c4", "g8f6"];
    const lesson = defined(
      detectMistake(
        1,
        0,
        gameOf({ ...newSession({ userColour: "w" }), moves: moves.slice(0, 2) }).fen,
        "f1a6",
        gameOf({ ...newSession({ userColour: "w" }), moves: moves.slice(0, 3) }),
        [{ move: "g1f3", score: 40, pv: ["g1f3", "b8c6", "f1c4"] }],
        [{ move: "b8a6", score: 320, pv: ["b8a6", "g1f3", "d7d6"] }],
        DEFAULT_CONFIG,
      ),
      "a lesson for 2. Ba6",
    );
    // Resolved as of the position after 3. Bc4, as the session records it.
    const state: SessionState = {
      ...newSession({ userColour: "w" }),
      moves,
      lessons: [{ ...lesson, status: "fixed", resolvedPly: 5 }],
    };
    const back = defined(takeBack(state), "a takeback");
    expect(back.moves).toEqual(moves.slice(0, 4));
    expect(lessonIn(back, lesson.id)).toMatchObject({ status: "pending", resolvedPly: null });
  });

  it("keeps the line as a branch when it undoes the moves of a lesson the player was shown, and only then", async () => {
    let kept = 0;
    for (const { name } of loadGames()) {
      const { points } = await replay(name);
      for (const p of points) {
        for (const after of [p.afterMove, p.afterReply]) {
          if (!after) continue;
          const back = defined(takeBack(after), "a takeback");
          const start = plyOf(after.startFen);
          const shown = after.lessons.filter(
            (l) =>
              l.status === "triggered" && l.resolvedPly !== null && l.resolvedPly - start > back.moves.length,
          );
          if (shown.length === 0) {
            expect(back.line).toBe(after.line);
            expect(back.branches).toEqual(after.branches);
            continue;
          }
          kept++;
          expect(back.branches.at(-1)).toEqual({ id: after.line, moves: after.moves, scores: after.scores });
          expect(back.line).not.toBe(after.line);
          // The review still shows what really happened after each of those mistakes.
          for (const l of shown) expect(playedLine(back, lessonIn(back, l.id))).toEqual(playedLine(after, l));
        }
      }
    }
    expect(kept).toBeGreaterThan(0);
  });
});
