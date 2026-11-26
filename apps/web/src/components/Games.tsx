import type { GameOutcome, GameSummary } from "@chess-teacher/contract";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client.ts";
import { hrefOf } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { ActionList, ActionListItem } from "../ui/ActionList.tsx";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";

const OUTCOME: Record<GameOutcome, () => string> = {
  won: m.games_won,
  lost: m.games_lost,
  drawn: m.games_drawn,
  ended: m.games_ended,
};

/** The player's finished games, newest first; each opens its review. */
export function Games({ onNewGame, onBack }: { onNewGame: () => void; onBack: () => void }) {
  const [games, setGames] = useState<GameSummary[] | null>(null);
  const [error, setError] = useState(false);
  const locale = getLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const list = new Intl.ListFormat(locale, { style: "narrow", type: "unit" });

  const fetchGames = useCallback(
    () =>
      api
        .finishedGames()
        .then(setGames)
        .catch(() => setError(true)),
    [],
  );
  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);
  const retry = () => {
    setError(false);
    void fetchGames();
  };

  return (
    <section>
      <h1>{m.games_title()}</h1>
      {error && (
        <Alert className="mb-4">
          {m.games_error()}{" "}
          <Button variant="link" onPress={retry}>
            {m.games_retry()}
          </Button>
        </Alert>
      )}
      {!games && !error && <p className="muted">{m.loading()}</p>}
      {games?.length === 0 && (
        <>
          <p className="max-w-[65ch]">{m.games_empty()}</p>
          <Button variant="primary" className="mb-4" onPress={onNewGame}>
            {m.nav_new_game()}
          </Button>
        </>
      )}
      {games && games.length > 0 && (
        <ActionList label={m.games_list()} className="mb-4">
          {games.map((g) => {
            const when = date.format(new Date(g.updatedAt));
            const facts = [
              g.userColour === "w" ? m.games_as_white() : m.games_as_black(),
              g.outcome ? OUTCOME[g.outcome]() : null,
              m.games_lessons({ count: g.lessons }),
            ].filter((f) => f !== null);
            return (
              <ActionListItem
                key={g.id}
                id={g.id}
                href={hrefOf({ page: "pastGame", id: g.id })}
                textValue={list.format([when, ...facts])}
              >
                <span className="block font-semibold">{when}</span>
                <span className="block text-sm text-fg-muted">{facts.join(" · ")}</span>
              </ActionListItem>
            );
          })}
        </ActionList>
      )}
      <Button onPress={onBack}>{m.back()}</Button>
    </section>
  );
}
