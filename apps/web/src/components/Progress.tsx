import type { ProgressResponse } from "@chess-teacher/contract";
import { isConceptId, isPrincipleId } from "@chess-teacher/core";
import { conceptText, conceptTitle, principleText, principleTitle } from "@chess-teacher/lesson-text";
import { useEffect, useState } from "react";
import { api } from "../api/client.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";

/** Which principles keep coming up, and how you're doing with them. */
export function Progress({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState(false);
  const locale = getLocale();
  // Ids from the server that this version of the core doesn't know are left out.
  const principles = (data?.principles ?? []).flatMap((p) => {
    if (p.kind === "concept" && isConceptId(p.id))
      return [
        { ...p, key: `concept:${p.id}`, title: conceptTitle(p.id, locale), text: conceptText(p.id, locale) },
      ];
    if (p.kind !== "concept" && isPrincipleId(p.id))
      return [{ ...p, key: p.id, title: principleTitle(p.id, locale), text: principleText(p.id, locale) }];
    return [];
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
          <ul className="principles">
            {principles.map((p) => (
              <li key={p.key}>
                <div className="principle-row">
                  <span className="principle-name">{p.title}</span>
                  <span className="principle-count">{m.progress_lessons({ count: p.lessons })}</span>
                </div>
                <div
                  className="bar"
                  style={{ width: `${(100 * p.lessons) / (focus?.lessons ?? p.lessons)}%` }}
                  aria-hidden
                />
                <div className="principle-stats muted small">
                  {p.revealed > 0 && (
                    <span>{m.progress_found({ found: p.foundYourself, revealed: p.revealed })}</span>
                  )}
                  {p.fixed > 0 && <span>{m.progress_fixed({ count: p.fixed })}</span>}
                  {p.recentGames > 0 && (
                    <span>{m.progress_recent({ count: p.recentGames, games: Math.min(5, data.games) })}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Button onPress={onBack}>{m.back()}</Button>
    </section>
  );
}
