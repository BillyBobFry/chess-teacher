import type { PrincipleProgress, ProgressResponse } from "@chess-teacher/contract";
import { useEffect, useState } from "react";
import { api } from "../api/client.ts";
import { principleCopy } from "../lib/principles.ts";
import { hrefOf } from "../lib/router.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { ActionList, ActionListItem } from "../ui/ActionList.tsx";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";

/** Which principles keep coming up, and how you're doing with them. Each opens its lessons. */
export function Progress({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState(false);
  const locale = getLocale();
  const list = new Intl.ListFormat(locale, { style: "narrow", type: "unit" });
  // Ids from the server that this version of the core doesn't know are left out.
  const principles = (data?.principles ?? []).flatMap((p) => {
    const copy = principleCopy(p.kind, p.id, locale);
    return copy ? [{ ...p, ...copy, key: `${p.kind}:${p.id}` }] : [];
  });
  const focus = principles[0];

  useEffect(() => {
    api
      .progress()
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <section className="progress">
      <h1>{m.progress_title()}</h1>
      {error && <Alert>{m.progress_error()}</Alert>}
      {!data && !error && <p className="muted">{m.loading()}</p>}
      {data && data.lessons === 0 && <p className="muted">{m.progress_empty()}</p>}
      {data && data.lessons > 0 && (
        <>
          <p className="muted">{m.progress_summary({ lessons: data.lessons, games: data.games })}</p>
          {focus && (
            <div className="focus">
              <div className="focus-label">{m.progress_focus()}</div>
              <div className="focus-title">{focus.title}</div>
              <p>{focus.text}</p>
            </div>
          )}
          <ActionList label={m.progress_list()} className="mb-6">
            {principles.map((p) => {
              const count = m.progress_lessons({ count: p.lessons });
              return (
                <ActionListItem
                  key={p.key}
                  id={p.key}
                  href={hrefOf({ page: "principle", kind: p.kind, id: p.id })}
                  textValue={list.format([p.title, count])}
                >
                  <span className="flex justify-between gap-4">
                    <span className="font-semibold">{p.title}</span>
                    <span className="whitespace-nowrap text-fg-muted">{count}</span>
                  </span>
                  <span
                    className="my-1.5 block h-1.5 rounded-full bg-primary opacity-70"
                    style={{ width: `${(100 * p.lessons) / (focus?.lessons ?? p.lessons)}%` }}
                    aria-hidden
                  />
                  <PrincipleStats progress={p} games={data.games} />
                </ActionListItem>
              );
            })}
          </ActionList>
        </>
      )}
      <Button onPress={onBack}>{m.back()}</Button>
    </section>
  );
}

/** How the player is doing with one principle, as facts in a row. `games` is how many were counted. */
export function PrincipleStats({ progress: p, games }: { progress: PrincipleProgress; games: number }) {
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
      {p.revealed > 0 && <span>{m.progress_found({ found: p.foundYourself, revealed: p.revealed })}</span>}
      {p.fixed > 0 && <span>{m.progress_fixed({ count: p.fixed })}</span>}
      {p.recentGames > 0 && (
        <span>{m.progress_recent({ count: p.recentGames, games: Math.min(5, games) })}</span>
      )}
    </span>
  );
}
