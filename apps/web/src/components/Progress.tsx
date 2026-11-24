import type { ProgressResponse } from "@chess-teacher/contract";
import { isPrincipleId } from "@chess-teacher/core";
import { principleText, principleTitle } from "@chess-teacher/lesson-text";
import { useEffect, useState } from "react";
import { api } from "../api/client.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";

/** Which principles keep coming up, and how you're doing with them. */
export function Progress({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState(false);
  const locale = getLocale();
  // Ids from the server that this version of the curriculum doesn't know are left out.
  const principles = (data?.principles ?? []).flatMap((p) =>
    isPrincipleId(p.id) ? [{ ...p, id: p.id }] : [],
  );
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
      {error && <p className="error">{m.progress_error()}</p>}
      {!data && !error && <p className="muted">{m.loading()}</p>}
      {data && data.lessons === 0 && <p className="muted">{m.progress_empty()}</p>}
      {data && data.lessons > 0 && (
        <>
          <p className="muted">{m.progress_summary({ lessons: data.lessons, games: data.games })}</p>
          {focus && (
            <div className="focus">
              <div className="focus-label">{m.progress_focus()}</div>
              <div className="focus-title">{principleTitle(focus.id, locale)}</div>
              <p>{principleText(focus.id, locale)}</p>
            </div>
          )}
          <ul className="principles">
            {principles.map((p) => (
              <li key={p.id}>
                <div className="principle-row">
                  <span className="principle-name">{principleTitle(p.id, locale)}</span>
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
      <button onClick={onBack}>{m.back()}</button>
    </section>
  );
}
