import { gameOf } from "@chess-teacher/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { savedGameQuery } from "../game/storage.ts";
import { principleCopy } from "../lib/principles.ts";
import { resultText } from "../lib/result.ts";
import { goBackTo, usePreviousRoute, type Route } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { GameReview } from "./GameReview.tsx";

/**
 * Where a past game's Back button leads: the principle page it was opened from, or else the
 * list of games.
 */
function useBack(): { route: Route; label: string } {
  const previous = usePreviousRoute();
  const copy =
    previous?.page === "principle" ? principleCopy(previous.source, previous.id, getLocale()) : null;
  return previous?.page === "principle" && copy
    ? { route: previous, label: m.principle_back({ name: copy.title }) }
    : { route: { page: "games" }, label: m.games_back() };
}

/** A finished game from the player's account: its replay and its review. */
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
  const { data: game, isError, isFetching, refetch } = useQuery(savedGameQuery(id));
  const back = useBack();
  const goBack = () => goBackTo(back.route);
  // A retry in flight shows as loading, not as the error it is retrying.
  const error = isError && !isFetching;
  const retry = () => void refetch();
  // The review is what the player came for, so on a phone its drawer starts open.
  const [expanded, setExpanded] = useState(true);

  const board = useMemo(() => (game ? { game: gameOf(game.state) } : null), [game]);

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
    <GameReview
      key={game.id}
      gameId={game.id}
      state={game.state}
      result={resultText(board.game, game.state)}
      boardId="past"
      openLesson={openLesson}
      expanded={expanded}
      onExpandedChange={setExpanded}
      aboveBoard={null}
      belowBoard={null}
      aboveReview={
        <Button variant="link" className="mb-3 self-start" onPress={goBack}>
          {back.label}
        </Button>
      }
      onNewGame={onNewGame}
      onBackToGame={onBackToGame}
      onProgress={onProgress}
    />
  );
}
