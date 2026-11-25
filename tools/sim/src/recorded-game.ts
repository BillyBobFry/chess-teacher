/** A game recorded by record-games.ts, for the replay tests. */

import type { Colour, TeachingConfig } from "@chess-teacher/core";
import type { RecordedCall } from "@chess-teacher/engine";

export type RecordedStep =
  { type: "startUserTurn" } | { type: "userMove"; move: string } | { type: "opponentMove" };

export interface RecordedGame {
  userColour: Colour;
  config: TeachingConfig;
  steps: RecordedStep[];
  engineCalls: { analyst: RecordedCall[]; weak: RecordedCall[] };
}
