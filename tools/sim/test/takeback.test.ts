/** Taking back the user's latest move, at every point of the recorded games. */

import { describe, expect, it } from "vitest";
import {
  canTakeBack,
  gameOf,
  isUserTurn,
  newSession,
  opponentMove,
  startUserTurn,
  takeBack,
  userMove,
  type GameEvent,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import { configOf, loadGames } from "./fixtures.ts";

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
  const e = {
    analyst: new RecordedEngine(g.engineCalls.analyst),
    weak: new RecordedEngine(g.engineCalls.weak),
  };
  let state: SessionState = newSession({ userColour: g.userColour, config: configOf(g) });
  const first = state;
  const points: Point[] = [];
  for (const step of g.steps) {
    if (step.type === "startUserTurn") state = (await startUserTurn(state, e)).state;
    else if (step.type === "userMove") {
      const r = await userMove(state, defined(step.move, "a recorded move"), e);
      points.push({ before: state, events: r.events, afterMove: r.state, afterReply: null });
      state = r.state;
    } else {
      state = (await opponentMove(state, e)).state;
      const last = points.at(-1);
      if (last && !last.afterReply) last.afterReply = state;
    }
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

  it("makes a lesson pending again when the taken-back move had fixed it", async () => {
    let checked = 0;
    for (const { name } of loadGames()) {
      const { points } = await replay(name);
      for (const p of points) {
        for (const { kind, lessonId } of p.events) {
          if (kind !== "fixed" || !p.afterReply) continue;
          const lesson = lessonIn(defined(takeBack(p.afterReply), "a takeback"), lessonId);
          expect(lesson.status).toBe("pending");
          expect(lesson.resolvedPly).toBeNull();
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
