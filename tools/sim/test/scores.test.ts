/** The evaluation after each move, recorded as the recorded games are replayed. */

import { describe, expect, it } from "vitest";
import {
  finish,
  newSession,
  opponentMove,
  plyOf,
  startUserTurn,
  userMove,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import { configOf, loadGames } from "./fixtures.ts";

describe("scores", () => {
  for (const { name, game: g } of loadGames()) {
    it(`records an evaluation for every analysed move of ${name}, agreeing with its lessons`, async () => {
      const e = {
        analyst: new RecordedEngine(g.engineCalls.analyst),
        weak: new RecordedEngine(g.engineCalls.weak),
      };
      let state: SessionState = newSession({ userColour: g.userColour, config: configOf(g) });
      for (const step of g.steps) {
        if (step.type === "startUserTurn") state = (await startUserTurn(state, e)).state;
        else if (step.type === "userMove") {
          if (!step.move) throw new Error("A recorded user move has no move");
          state = (await userMove(state, step.move, e)).state;
        } else state = (await opponentMove(state, e)).state;
      }
      state = finish(state);

      // Only an opponent's last move, never followed by the user's turn, may be unscored.
      expect(state.scores.length).toBeGreaterThanOrEqual(state.moves.length - 1);
      expect(state.scores.every((score) => typeof score === "number")).toBe(true);
      for (const lesson of state.lessons) {
        const index = lesson.ply - plyOf(state.startFen);
        expect(state.scores[index], `lesson ${lesson.id}`).toBe(lesson.userScore);
        if (index > 0) expect(state.scores[index - 1], `lesson ${lesson.id}`).toBe(lesson.bestScore);
      }
    });
  }
});
