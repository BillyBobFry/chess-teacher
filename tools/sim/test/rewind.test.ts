/** Rewinding to a lesson's mistake, using a recorded game. */

import { describe, expect, it } from "vitest";
import {
  gameOf,
  isUserTurn,
  playedLine,
  recentUserMoves,
  rewind,
  startUserTurn,
  type SessionState,
} from "@chess-teacher/core";
import { enginesFor, loadGames, startOf, step } from "./games.ts";

describe("rewind", () => {
  it("returns to the position before the mistake, and the game can continue", async () => {
    // The first consequence revealed by an opponent's move in the recorded games.
    const { g, state, triggeredId } = await (async () => {
      for (const { game: g } of loadGames()) {
        const e = enginesFor(g);
        let state: SessionState = startOf(g);
        for (const s of g.steps) {
          const r = await step(state, s, e);
          state = r.state;
          const t = s.type === "opponentMove" && r.events.find((ev) => ev.kind === "triggered");
          if (t) return { g, state, triggeredId: t.lessonId };
        }
      }
      throw new Error("no consequence revealed in the recorded games");
    })();
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
    const next = await startUserTurn(rewound, enginesFor(g));
    expect(next.state.analysis?.fen).toBe(lesson.fenBefore);
  });
});
