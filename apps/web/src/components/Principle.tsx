import type { PrincipleGame, PrincipleSource } from "@chess-teacher/contract";
import type { Lesson } from "@chess-teacher/core";
import { useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { principleQuery } from "../api/queries.ts";
import { principleCopy } from "../lib/principles.ts";
import { outcomeText } from "../lib/result.ts";
import { goBackTo, hrefOf } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { DisclosureGroup, type Key } from "../ui/Disclosure.tsx";
import { Link } from "../ui/Link.tsx";
import { LessonRow } from "./LessonRow.tsx";
import { PrincipleStats } from "./Progress.tsx";

/** A lesson's key in the page's one disclosure group: lesson ids are only unique within a game. */
const keyOf = (gameId: string, lessonId: number) => `${gameId}:${lessonId}`;

/**
 * One principle from the progress page: how the player is doing with it, and every
 * lesson on it across their recent games, newest game first, each opening in place as in a
 * review, so they can be read side by side.
 */
export function Principle({ source, id }: { source: PrincipleSource; id: string }) {
  const locale = getLocale();
  const copy = principleCopy(source, id, locale);
  const { data, isError, isFetching, refetch } = useQuery(principleQuery(source, id));
  // A retry in flight shows as loading, not as the error it is retrying.
  const error = isError && !isFetching;
  const [open, setOpen] = useState<Key | null>(null);
  const retry = () => void refetch();

  return (
    <section>
      <Button variant="link" className="mb-3" onPress={() => goBackTo({ page: "progress" })}>
        {m.progress_back()}
      </Button>
      <h1>{copy?.title}</h1>
      {copy && <p className="max-w-[65ch]">{copy.text}</p>}
      {data?.progress && (
        <p className="mb-4">
          <PrincipleStats progress={data.progress} games={data.games} />
        </p>
      )}
      {error && (
        <Alert className="mb-4">
          {m.principle_error()}{" "}
          <Button variant="link" onPress={retry}>
            {m.games_retry()}
          </Button>
        </Alert>
      )}
      {!data && !error && <p className="muted">{m.loading()}</p>}
      {data?.occurrences.length === 0 && <p className="max-w-[65ch] text-fg-muted">{m.principle_empty()}</p>}
      {data && data.occurrences.length > 0 && (
        <DisclosureGroup expanded={open} onExpandedChange={setOpen}>
          {data.occurrences.map((g) => (
            <GameLessons key={g.game.id} occurrence={g} open={open} />
          ))}
        </DisclosureGroup>
      )}
    </section>
  );
}

/** One game's lessons on the principle, under what the player will remember it by. */
function GameLessons({
  occurrence: { game, lessons },
  open,
}: {
  occurrence: PrincipleGame;
  open: Key | null;
}) {
  const locale = getLocale();
  const headingId = useId();
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  const facts = [
    game.userColour === "w" ? m.games_as_white() : m.games_as_black(),
    game.outcome ? outcomeText(game.outcome) : null,
  ].filter((f) => f !== null);
  // The game's review opens on the lesson open here, or else on its first lesson on this.
  const target = lessons.find((l) => open === keyOf(game.id, l.lesson.id)) ?? lessons[0];
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={headingId} className="m-0 text-base font-semibold">
          {game.finished ? date.format(new Date(game.updatedAt)) : m.principle_current_game()}
        </h2>
        {/* Only one game is ever unfinished: the one being played, which has no review yet. */}
        <Link
          variant="link"
          aria-describedby={headingId}
          href={
            game.finished
              ? hrefOf({ page: "pastGame", id: game.id, lesson: target?.lesson.id })
              : hrefOf({ page: "play" })
          }
        >
          {game.finished ? m.principle_whole_game() : m.principle_go_to_game()}
        </Link>
      </div>
      <p className="mt-0 mb-2 text-sm text-fg-muted">{facts.join(" · ")}</p>
      <ol className="m-0 list-none border-t border-border p-0">
        {lessons.map(({ lesson, played, onGameLine }) => {
          const key = keyOf(game.id, lesson.id);
          return (
            <li key={key}>
              <LessonRow
                id={key}
                // The server sends the core's Lesson, brought up to date (see the contract).
                lesson={lesson as Lesson}
                played={played}
                gameId={game.id}
                open={open === key}
                note={onGameLine ? null : m.principle_earlier_try()}
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
