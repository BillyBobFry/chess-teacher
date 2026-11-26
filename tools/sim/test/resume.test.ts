/**
 * A game can be resumed later on any device: saving and reloading the session state as
 * JSON after every step changes nothing, and saves from earlier versions still load: version
 * 1 (lesson text in English) and version 3 (feature lessons that didn't say so).
 */

import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONFIG,
  Game,
  STANDARD_START,
  detectMistake,
  finish,
  newSession,
  upgradeSession,
  type FeatureLesson,
  type Lesson,
  type SavedSessionState,
  type SessionState,
} from "@chess-teacher/core";
import { detailText, triggerText } from "../src/prototype-text.ts";
import { enginesFor, loadGames, startOf, step } from "./games.ts";
import type { RecordedGame } from "../src/recorded-game.ts";

async function replay(g: RecordedGame, roundTrip: boolean): Promise<SessionState> {
  const engines = enginesFor(g);
  let state = startOf(g);
  for (const s of g.steps) {
    state = (await step(state, s, engines)).state;
    if (roundTrip) state = JSON.parse(JSON.stringify(state)) as SessionState;
  }
  return finish(state);
}

describe.each(loadGames())("$name", ({ game }) => {
  it("is unchanged by saving and reloading the state after every step", async () => {
    expect(await replay(game, true)).toEqual(await replay(game, false));
  });
});

describe("saves from before diagnosed lessons", () => {
  // 1. e4 e5 2. Ba6, which the knight simply takes: a feature lesson about material.
  const moves = ["e2e4", "e7e5", "f1a6"];
  const before = new Game(STANDARD_START, moves.slice(0, 2));
  const after = new Game(STANDARD_START, moves);
  const made = detectMistake(
    1,
    0,
    before.fen,
    "f1a6",
    after,
    [{ move: "g1f3", score: 40, pv: ["g1f3", "b8c6", "f1c4"] }],
    [{ move: "b8a6", score: 320, pv: ["b8a6", "g1f3", "d7d6"] }],
    DEFAULT_CONFIG,
  );
  if (!made) throw new Error("expected a lesson for 2. Ba6");
  const lesson: FeatureLesson = made;
  const state: SessionState = { ...newSession({ userColour: "w" }), moves, lessons: [lesson] };

  /** The state as it was saved before lessons said where they came from. */
  const withoutSource = <T>(value: T): T =>
    JSON.parse(JSON.stringify(value, (key, v: unknown) => (key === "source" ? undefined : v))) as T;

  it("upgrades a version 3 save, whose lessons are feature lessons", () => {
    const saved = withoutSource({ ...state, version: 3 }) as SavedSessionState;
    const upgraded = upgradeSession(saved);
    expect(upgraded.lessons).toEqual([lesson]);
  });

  it("upgrades from a version 1 save, where lesson text was English", () => {
    // A version 1 save kept the trigger only as English text.
    const asV1 = (l: Lesson) => ({ ...l, trigger: triggerText(l.trigger) });
    const { trigger, ...rest } = withoutSource(lesson);
    const saved: SavedSessionState = {
      ...state,
      version: 1,
      lessons: [
        {
          ...rest,
          baselineDetail: detailText(rest.baselineDetail),
          userDetail: detailText(rest.userDetail),
          bestDetail: detailText(rest.bestDetail),
          triggerText: triggerText(trigger),
        },
      ],
    };
    const upgraded = upgradeSession(JSON.parse(JSON.stringify(saved)) as SavedSessionState);
    expect(upgraded.lessons.map(asV1)).toEqual([lesson].map(asV1));
  });
});
