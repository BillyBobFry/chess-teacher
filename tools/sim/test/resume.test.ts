/**
 * A game can be resumed later on any device: saving and reloading the session state as
 * JSON after every step changes nothing, and saves from version 1 (when lesson text was
 * English) still load.
 */

import { describe, expect, it } from "vitest";
import {
  finish,
  upgradeSession,
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

// A version 1 save kept the trigger only as English text.
const asV1 = (l: Lesson) => ({ ...l, trigger: triggerText(l.trigger) });

describe.each(loadGames())("$name", ({ game }) => {
  it("is unchanged by saving and reloading the state after every step", async () => {
    expect(await replay(game, true)).toEqual(await replay(game, false));
  });

  it("upgrades from a version 1 save, where lesson text was English", async () => {
    const state = await replay(game, false);
    const saved: SavedSessionState = {
      ...state,
      version: 1,
      lessons: state.lessons.map(({ trigger, ...l }) => ({
        ...l,
        baselineDetail: detailText(l.baselineDetail),
        userDetail: detailText(l.userDetail),
        bestDetail: detailText(l.bestDetail),
        triggerText: triggerText(trigger),
      })),
    };
    const upgraded = upgradeSession(JSON.parse(JSON.stringify(saved)) as SavedSessionState);
    expect(upgraded.lessons.map(asV1)).toEqual(state.lessons.map(asV1));
  });
});
