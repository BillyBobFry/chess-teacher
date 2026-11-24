import { lessonMove, playedLine, type Lesson, type SessionState } from "@chess-teacher/core";
import { moveText, principleTitle } from "@chess-teacher/lesson-text";
import { useState } from "react";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";

/** What became of a lesson; `tick` marks the outcomes the player can be pleased with. */
function outcome(l: Lesson): { text: string; tick: boolean } {
  const plain = (text: string) => ({ text, tick: false });
  if (l.status === "fixed") return { text: m.outcome_fixed(), tick: true };
  if (l.status === "triggered" && l.deferred) return plain(m.outcome_deferred());
  if (l.status === "triggered" && l.foundCause === true) return { text: m.outcome_found(), tick: true };
  if (l.status === "triggered" && l.foundCause === false) return plain(m.outcome_revealed());
  if (l.status === "triggered")
    return plain(l.kind === "missed_chance" ? m.outcome_shown() : m.outcome_not_shown());
  if (l.status === "superseded") return plain(m.outcome_superseded());
  if (l.kind === "consequence") return plain(m.outcome_got_away());
  return plain(m.outcome_missed());
}

/** Post-game review: every lesson, with its explanation and futures on demand. */
export function Review({
  gameId,
  state,
  result,
  onNewGame,
  onProgress,
}: {
  gameId: string;
  state: SessionState;
  result: string;
  onNewGame: () => void;
  onProgress?: () => void;
}) {
  const lessons = state.lessons.filter((l) => l.status !== "rewound");
  const [open, setOpen] = useState<number | null>(null);
  const locale = getLocale();
  return (
    <section className="review">
      <h2>{m.review_title()}</h2>
      <p className="muted">{result}</p>
      {lessons.length === 0 ? (
        <p>{m.review_none()}</p>
      ) : (
        <ul className="review-list">
          {lessons.map((l) => {
            const o = outcome(l);
            return (
              <li key={l.id}>
                <button
                  className="review-item"
                  aria-expanded={open === l.id}
                  onClick={() => setOpen(open === l.id ? null : l.id)}
                >
                  <span className="review-move">{moveText(lessonMove(l), locale)}</span>
                  <span className="review-principle">{principleTitle(l.principle, locale)}</span>
                  <span className="review-outcome">
                    {o.text}
                    {o.tick && <span aria-hidden> ✓</span>}
                  </span>
                </button>
                {open === l.id && (
                  <div className="review-detail">
                    <Explanation lesson={l} />
                    <Futures lesson={l} played={playedLine(state, l)} />
                    <LessonFeedback gameId={gameId} lessonId={l.id} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div className="actions">
        <button className="primary" onClick={onNewGame}>
          {m.nav_new_game()}
        </button>
        {onProgress && <button onClick={onProgress}>{m.account_progress()}</button>}
      </div>
    </section>
  );
}
