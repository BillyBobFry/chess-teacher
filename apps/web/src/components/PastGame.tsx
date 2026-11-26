import { gameOf } from "@chess-teacher/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadGame, type SavedGame } from "../game/storage.ts";
import { resultText } from "../lib/result.ts";
import { goBackTo } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { Board, orientationOf } from "./Board.tsx";
import { GameLayout } from "./GameLayout.tsx";
import { Review } from "./Review.tsx";

/** A finished game from the player's account: its final position and its review. */
export function PastGame({
  id,
  onNewGame,
  onBackToGame,
  onProgress,
}: {
  id: string;
  onNewGame: () => void;
  /** Returns to the game in progress; null when there isn't one. */
  onBackToGame: (() => void) | null;
  onProgress: () => void;
}) {
  const [game, setGame] = useState<SavedGame | null>(null);
  const backToGames = () => goBackTo({ page: "games" });
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
        <Button onPress={backToGames}>{m.games_back()}</Button>
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
          <Button variant="link" className="mb-3 self-start" onPress={backToGames}>
            {m.games_back()}
          </Button>
          <Review
            gameId={game.id}
            state={game.state}
            result={resultText(board.game, game.state)}
            onNewGame={onNewGame}
            onBackToGame={onBackToGame}
            onProgress={onProgress}
          />
        </>
      }
    />
  );
}
