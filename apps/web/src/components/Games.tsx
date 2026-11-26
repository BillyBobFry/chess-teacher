import { useQuery } from "@tanstack/react-query";
import { finishedGamesQuery } from "../api/queries.ts";
import { outcomeText } from "../lib/result.ts";
import { hrefOf } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { ActionList, ActionListItem } from "../ui/ActionList.tsx";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";

/** The player's finished games, newest first; each opens its review. */
export function Games({
  onNewGame,
  onBackToGame,
  onBack,
}: {
  onNewGame: () => void;
  /** Returns to the game in progress; null when there isn't one. */
  onBackToGame: (() => void) | null;
  onBack: () => void;
}) {
  const { data: games, isError, isFetching, refetch } = useQuery(finishedGamesQuery);
  // A retry in flight shows as loading, not as the error it is retrying.
  const error = isError && !isFetching;
  const locale = getLocale();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const list = new Intl.ListFormat(locale, { style: "narrow", type: "unit" });

  const retry = () => void refetch();

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
          {/* Finishing the game in progress is what fills this list (UX-17). */}
          <Button variant="primary" className="mb-4" onPress={onBackToGame ?? onNewGame}>
            {onBackToGame ? m.game_back_to_current() : m.nav_new_game()}
          </Button>
        </>
      )}
      {games && games.length > 0 && (
        <ActionList label={m.games_list()} className="mb-4">
          {games.map((g) => {
            const when = date.format(new Date(g.updatedAt));
            const facts = [
              g.userColour === "w" ? m.games_as_white() : m.games_as_black(),
              g.outcome ? outcomeText(g.outcome) : null,
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
