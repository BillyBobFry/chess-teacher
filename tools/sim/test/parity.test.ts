/**
 * Whole-game parity: replaying the Python prototype's recorded engine output through the
 * TypeScript core must produce the same opponent moves, the same events at every step,
 * and the same lessons (facts, explanations, hints and all).
 *
 * A second pass saves and reloads the session state (as JSON) after every step, which
 * must change nothing: that's what lets a game be resumed later on any device.
 */

import { describe, expect, it } from "vitest";
import {
  finish,
  newSession,
  opponentMove,
  startUserTurn,
  userMove,
  type Engines,
  type GameEvent,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import { configOf, lessonAsFixture, loadGames, pyEventKind, type FixtureGame } from "./fixtures.ts";

const games = loadGames();

async function replay(g: FixtureGame, roundTrip: boolean) {
  const analyst = new RecordedEngine(g.engineCalls.analyst, "analyst");
  const weak = new RecordedEngine(g.engineCalls.weak, "weak");
  const engines: Engines = { analyst, weak };
  let state: SessionState = newSession({ userColour: g.userColour, config: configOf(g) });
  const save = (s: SessionState): SessionState =>
    roundTrip ? (JSON.parse(JSON.stringify(s)) as SessionState) : s;
  const asPy = (events: GameEvent[]) =>
    events.map((e) => ({ kind: e.kind, lessonId: e.lessonId, text: e.text }));

  for (const [i, step] of g.steps.entries()) {
    const expected = step.events.map((e) => ({ ...e, kind: pyEventKind(e.kind) }));
    const where = `step ${i} (${step.type}${step.move ? " " + step.move : ""})`;
    if (step.type === "startUserTurn") {
      const r = await startUserTurn(state, engines);
      expect(asPy(r.events), where).toEqual(expected);
      state = save(r.state);
    } else if (step.type === "userMove") {
      const r = await userMove(state, step.move!, engines);
      expect(asPy(r.events), where).toEqual(expected);
      state = save(r.state);
    } else {
      const r = await opponentMove(state, engines);
      expect({ move: r.move, mode: r.mode }, where).toEqual({ move: step.move, mode: step.mode });
      expect(asPy(r.events), where).toEqual(expected);
      state = save(r.state);
    }
  }
  state = finish(state);
  return { state, analyst, weak };
}

describe("game parity with the Python prototype", () => {
  for (const { name, game } of games) {
    describe(name, () => {
      it("produces the same moves, events and lessons", async () => {
        const { state, analyst, weak } = await replay(game, false);
        const lessons = state.lessons.map((l) => lessonAsFixture(state, l));
        expect(lessons.length).toBe(game.lessons.length);
        lessons.forEach((l, i) => expect(l, `lesson ${i + 1}`).toEqual(game.lessons[i]));
        expect(analyst.unused() + weak.unused(), "every recorded engine call was used").toBe(0);
      });

      it("is unchanged by saving and reloading the state after every step", async () => {
        const { state } = await replay(game, true);
        const lessons = state.lessons.map((l) => lessonAsFixture(state, l));
        lessons.forEach((l, i) => expect(l, `lesson ${i + 1}`).toEqual(game.lessons[i]));
      });
    });
  }
});
