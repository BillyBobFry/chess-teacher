import type { ProgressResponse } from "@chess-teacher/contract";
import { PRINCIPLES } from "@chess-teacher/core";
import { useEffect, useState } from "react";
import { api } from "../api/client.ts";
import { m } from "../paraglide/messages.js";

/** Which principles keep coming up, and how you're doing with them. */
export function Progress({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState(false);

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
          {data.principles[0] && (
            <div className="focus">
              <div className="focus-label">{m.progress_focus()}</div>
              <div className="focus-title">{data.principles[0].title}</div>
              <p>{PRINCIPLES[data.principles[0].id]?.text}</p>
            </div>
          )}
          <ul className="principles">
            {data.principles.map((p) => (
              <li key={p.id}>
                <div className="principle-row">
                  <span className="principle-name">{p.title}</span>
                  <span className="principle-count">{m.progress_lessons({ count: p.lessons })}</span>
                </div>
                <div
                  className="bar"
                  style={{ width: `${(100 * p.lessons) / data.principles[0]!.lessons}%` }}
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
