import { PRINCIPLES, lessonLabel, type Lesson, type SessionState } from "@chess-teacher/core";
import { useState } from "react";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";

function outcome(l: Lesson): string {
  if (l.status === "fixed") return "You fixed it in time ✓";
  if (l.status === "triggered" && l.deferred) return "Happened at the same time as another lesson";
  if (l.status === "triggered" && l.foundCause === true) return "Found it yourself ✓";
  if (l.status === "triggered" && l.foundCause === false) return "Revealed during the game";
  if (l.status === "triggered") return "Not shown during the game";
  if (l.status === "superseded") return "Overtaken by a later mistake of the same kind";
  if (l.kind === "consequence") return "You got away with it: a stronger player would have punished it";
  return "Missed chance";
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
  return (
    <section className="review">
      <h2>Game review</h2>
      <p className="muted">{result}</p>
      {lessons.length === 0 ? (
        <p>No clear mistakes found. Well played!</p>
      ) : (
        <ul className="review-list">
          {lessons.map((l) => (
            <li key={l.id}>
              <button
                className="review-item"
                aria-expanded={open === l.id}
                onClick={() => setOpen(open === l.id ? null : l.id)}
              >
                <span className="review-move">{lessonLabel(l)}</span>
                <span className="review-principle">{PRINCIPLES[l.principle]!.title}</span>
                <span className="review-outcome">{outcome(l)}</span>
              </button>
              {open === l.id && (
                <div className="review-detail">
                  <Explanation lesson={l} />
                  <Futures lesson={l} />
                  <LessonFeedback gameId={gameId} lessonId={l.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="actions">
        <button className="primary" onClick={onNewGame}>
          New game
        </button>
        {onProgress && <button onClick={onProgress}>Your progress</button>}
      </div>
    </section>
  );
}
