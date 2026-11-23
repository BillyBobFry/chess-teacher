import type { ProgressResponse } from "@chess-teacher/contract";
import { PRINCIPLES } from "@chess-teacher/core";
import { useEffect, useState } from "react";
import { api } from "../api/client.ts";

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
      <h1>Your progress</h1>
      {error && <p className="error">Couldn't load your progress. Please try again.</p>}
      {!data && !error && <p className="muted">Loading…</p>}
      {data && data.lessons === 0 && (
        <p className="muted">
          Nothing yet. Play a game: every lesson you meet is counted here by the principle it teaches.
        </p>
      )}
      {data && data.lessons > 0 && (
        <>
          <p className="muted">
            {data.lessons} lessons across your last {data.games} {data.games === 1 ? "game" : "games"}.
          </p>
          {data.principles[0] && (
            <div className="focus">
              <div className="focus-label">Your focus</div>
              <div className="focus-title">{data.principles[0].title}</div>
              <p>{PRINCIPLES[data.principles[0].id]?.text}</p>
            </div>
          )}
          <ul className="principles">
            {data.principles.map((p) => (
              <li key={p.id}>
                <div className="principle-row">
                  <span className="principle-name">{p.title}</span>
                  <span className="principle-count">
                    {p.lessons} {p.lessons === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
                <div
                  className="bar"
                  style={{ width: `${(100 * p.lessons) / data.principles[0]!.lessons}%` }}
                  aria-hidden
                />
                <div className="principle-stats muted small">
                  {p.revealed > 0 && (
                    <span>
                      Found the cause yourself {p.foundYourself} of {p.revealed}
                    </span>
                  )}
                  {p.fixed > 0 && <span>Fixed in time {p.fixed}×</span>}
                  {p.recentGames > 0 && (
                    <span>
                      In {p.recentGames} of your last {Math.min(5, data.games)} games
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={onBack}>Back</button>
    </section>
  );
}
