import type { SessionState } from "@chess-teacher/core";
import type { ReactNode } from "react";
import { useReplay } from "../game/useReplay.ts";
import { m } from "../paraglide/messages.js";
import { GameLayout } from "./GameLayout.tsx";
import { ReplayBoard } from "./ReplayBoard.tsx";
import { Review } from "./Review.tsx";

/**
 * Under the replay's board: the stepper (2.75rem), the room kept for a note (3rem), the key
 * hint (a line) and the gaps between them. With the balance of power, also its value (a line)
 * and its graph (2.75rem).
 */
const REPLAY_CONTROLS = { plain: "8.75rem", balance: "13.5rem" };

/**
 * A finished game: its replay on the board, and its review in the panel, linked both ways.
 * Give it a `key` per game, so a new game starts its replay afresh.
 */
export function GameReview({
  gameId,
  state,
  result,
  boardId,
  openLesson,
  expanded,
  onExpandedChange,
  aboveBoard,
  belowBoard,
  aboveReview,
  onNewGame,
  onBackToGame,
  onProgress,
}: {
  gameId: string;
  state: SessionState;
  result: string;
  boardId: string;
  /** A lesson to start open, with the board at its mistake (a link to it), or null. */
  openLesson: number | null;
  /** The panel's drawer on a phone (`GameLayout`). */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  aboveBoard: ReactNode;
  belowBoard: ReactNode;
  aboveReview: ReactNode;
  onNewGame: () => void;
  /** Returns to the game in progress when this is an earlier game's review; null otherwise. */
  onBackToGame: (() => void) | null;
  onProgress: () => void;
}) {
  const replay = useReplay(state, openLesson);
  const balance = replay.scores.some((score) => score !== null);
  return (
    <GameLayout
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      panelLabel={m.review_title()}
      under={balance ? REPLAY_CONTROLS.balance : REPLAY_CONTROLS.plain}
      board={
        <>
          {aboveBoard}
          <ReplayBoard
            id={boardId}
            state={state}
            replay={replay}
            balance={balance}
            // On a phone the review is in the drawer, so a lesson shown from the board opens it.
            onShowLesson={() => onExpandedChange(true)}
          />
          {belowBoard}
        </>
      }
      panel={
        <>
          {aboveReview}
          <Review
            gameId={gameId}
            state={state}
            result={result}
            replay={replay}
            openLesson={openLesson}
            onNewGame={onNewGame}
            onBackToGame={onBackToGame}
            onProgress={onProgress}
          />
        </>
      }
    />
  );
}
