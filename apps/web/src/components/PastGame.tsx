import { gameOf } from "@chess-teacher/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadGame, type SavedGame } from "../game/storage.ts";
import { principleCopy } from "../lib/principles.ts";
import { resultText } from "../lib/result.ts";
import { goBackTo, usePreviousRoute, type Route } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { Board, orientationOf } from "./Board.tsx";
import { GameLayout } from "./GameLayout.tsx";
import { Review } from "./Review.tsx";

/**
 * Where a past game's Back button leads: the principle page it was opened from, or else the
 * list of games.
 */
function useBack(): { route: Route; label: string } {
  const previous = usePreviousRoute();
  const copy = previous?.page === "principle" ? principleCopy(previous.kind, previous.id, getLocale()) : null;
  return previous?.page === "principle" && copy
    ? { route: previous, label: m.principle_back({ name: copy.title }) }
    : { route: { page: "games" }, label: m.games_back() };
}

/** A finished game from the player's account: its final position and its review. */
export function PastGame({
  id,
  openLesson,
  onNewGame,
  onBackToGame,
  onProgress,
}: {
  id: string;
  /** A lesson to start open in the review, or null. */
  openLesson: number | null;
  onNewGame: () => void;
  /** Returns to the game in progress; null when there isn't one. */
  onBackToGame: (() => void) | null;
  onProgress: () => void;
}) {
  const [game, setGame] = useState<SavedGame | null>(null);
  const back = useBack();
  const goBack = () => goBackTo(back.route);
  const [error, setError] = useState(false);
  // The review is what the player came for, so on a phone its drawer starts open.
  const [expanded, setExpanded] = useState(true);

  const fetchGame = useCallback(
    () =>
      loadGame(id)
        .then(setGame)
        .catch(() => setError(true)),
    [id],
  );
  useEffect(() => {
    void fetchGame();
  }, [fetchGame]);
  const retry = () => {
    setError(false);
    void fetchGame();
  };

  const board = useMemo(() => {
    if (!game) return null;
    const replay = gameOf(game.state);
    return {
      game: replay,
      fen: replay.fen,
      lastMove: replay.chess.history({ verbose: true }).at(-1) ?? null,
    };
  }, [game]);

  if (!game || !board) {
    return (
      <main className="page">
        {error ? (
          <Alert className="mb-4">
            {m.game_load_error()}{" "}
            <Button variant="link" onPress={retry}>
              {m.games_retry()}
            </Button>
          </Alert>
        ) : (
          <p className="muted">{m.loading()}</p>
        )}
        <Button onPress={goBack}>{back.label}</Button>
      </main>
    );
  }

  return (
    <GameLayout
      expanded={expanded}
      onExpandedChange={setExpanded}
      panelLabel={m.review_title()}
      board={
        <Board
          id="past"
          label={m.board_game()}
          fen={board.fen}
          orientation={orientationOf(game.state.userColour)}
          focusable={false}
          lastMove={board.lastMove}
        />
      }
      panel={
        <>
          <Button variant="link" className="mb-3 self-start" onPress={goBack}>
            {back.label}
          </Button>
          <Review
            gameId={game.id}
            state={game.state}
            result={resultText(board.game, game.state)}
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
