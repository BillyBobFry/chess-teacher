/** The evaluation after each move, recorded as the recorded games are replayed. */

import { describe, expect, it } from "vitest";
import { finish, plyOf } from "@chess-teacher/core";
import { enginesFor, loadGames, startOf, step } from "./games.ts";

describe("scores", () => {
  for (const { name, game: g } of loadGames()) {
    it(`records an evaluation for every analysed move of ${name}, agreeing with its lessons`, async () => {
      const e = enginesFor(g);
      let state = startOf(g);
      for (const s of g.steps) state = (await step(state, s, e)).state;
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
