import { lessonLabel, recentUserMoves, type Lesson, type SessionState } from "@chess-teacher/core";
import type { ExplanationResponse } from "@chess-teacher/contract";
import type { RevealState } from "../game/storage.ts";
import { AiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";

interface Props {
  state: SessionState;
  lesson: Lesson;
  reveal: RevealState;
  hint: string | null;
  loadExplanation: (signal: AbortSignal) => Promise<ExplanationResponse | null>;
  onGuess: (ply: number) => void;
  onShowAnswer: () => void;
  onRewind: () => void;
  onContinue: () => void;
}

/** Find the cause → explanation and the two futures → rewind or carry on. */
export function Reveal({
  state,
  lesson,
  reveal,
  hint,
  loadExplanation,
  onGuess,
  onShowAnswer,
  onRewind,
  onContinue,
}: Props) {
  const headline = lesson.kind === "consequence" ? lesson.triggerText : "The chance has gone.";
  const sub =
    lesson.kind === "consequence"
      ? "The cause was one of your recent moves."
      : "A few moves ago you had a clearly better option.";

  return (
    <section className="reveal" aria-live="polite">
      <div className={`reveal-headline ${lesson.kind}`}>
        <span className="reveal-icon" aria-hidden>
          {lesson.kind === "consequence" ? "⚠" : "⏳"}
        </span>
        <div>
          <h2>{headline}</h2>
          <p>{sub}</p>
        </div>
      </div>

      {reveal.step === "find" ? (
        <div className="find">
          <p className="prompt">Can you find the move that caused it?</p>
          <div className="choices">
            {recentUserMoves(state, lesson).map(([ply, label]) => (
              <button
                key={ply}
                className="choice"
                disabled={reveal.wrong.includes(ply)}
                onClick={() => onGuess(ply)}
              >
                {label}
              </button>
            ))}
          </div>
          {reveal.attempts > 0 && <p className="not-that">Not that one.</p>}
          {hint && <p className="hint">Hint: {hint}</p>}
          <button className="link" onClick={onShowAnswer}>
            Show me the answer
          </button>
        </div>
      ) : (
        <div className="explain">
          {lesson.foundCause && <p className="found">✓ Yes, that's the one.</p>}
          <AiExplanation load={loadExplanation} />
          <Explanation lesson={lesson} />
          <Futures lesson={lesson} />
          <div className="actions">
            <button className="primary" onClick={onRewind}>
              Rewind to before {lessonLabel(lesson)}
            </button>
            <button onClick={onContinue}>Carry on</button>
          </div>
        </div>
      )}
    </section>
  );
}
