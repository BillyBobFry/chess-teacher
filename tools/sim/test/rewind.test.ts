/** Rewinding to a lesson's mistake, using a recorded game. */

import { describe, expect, it } from "vitest";
import {
  gameOf,
  isUserTurn,
  newSession,
  opponentMove,
  playedLine,
  recentUserMoves,
  rewind,
  startUserTurn,
  userMove,
  type Engines,
  type SessionState,
} from "@chess-teacher/core";
import { RecordedEngine } from "@chess-teacher/engine";
import { configOf, loadGames } from "./fixtures.ts";

describe("rewind", () => {
  it("returns to the position before the mistake, and the game can continue", async () => {
    const { game: g } = loadGames()[0]!;
    const engines = (): Engines => ({
      analyst: new RecordedEngine(g.engineCalls.analyst),
      weak: new RecordedEngine(g.engineCalls.weak),
    });
    const e = engines();
    let state: SessionState = newSession({ userColour: g.userColour, config: configOf(g) });
    let triggeredId: number | null = null;
    for (const step of g.steps) {
      if (step.type === "startUserTurn") state = (await startUserTurn(state, e)).state;
      else if (step.type === "userMove") state = (await userMove(state, step.move!, e)).state;
      else {
        const r = await opponentMove(state, e);
        state = r.state;
        const t = r.events.find((ev) => ev.kind === "triggered");
        if (t) {
          triggeredId = t.lessonId;
          break;
        }
      }
    }
    expect(triggeredId).not.toBeNull();
    const lesson = state.lessons.find((l) => l.id === triggeredId)!;
    expect(recentUserMoves(state, lesson).some(([ply]) => ply === lesson.ply)).toBe(true);

    // "What happened": the real moves from the mistake to the reveal, not the prediction.
    const played = playedLine(state, lesson);
    expect(played[0]).toBe(lesson.userMove);
    expect(played).toEqual(state.moves.slice(lesson.ply, lesson.resolvedPly!));
    expect(played.at(-1)).toBe(state.moves.at(-1));

    const rewound = rewind(state, lesson.id);
    expect(gameOf(rewound).fen).toBe(lesson.fenBefore);
    expect(isUserTurn(rewound)).toBe(true);
    expect(rewound.lessons.find((l) => l.id === lesson.id)!.status).toBe("triggered");
    for (const l of rewound.lessons) if (l.ply > lesson.ply) expect(l.status).not.toBe("pending");

    // The position before the mistake was analysed in the recording, so a fresh replay engine can continue.
    const next = await startUserTurn(rewound, engines());
    expect(next.state.analysis?.fen).toBe(lesson.fenBefore);
  });
});
