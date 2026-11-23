import {
  lessonLabel,
  recentUserMoves,
  userMovesAgo,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import type { ExplanationResponse } from "@chess-teacher/contract";
import type { RevealState } from "../game/storage.ts";
import { AiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";

interface Props {
  gameId: string;
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
  gameId,
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
  const ago = userMovesAgo(state, lesson);
  const headline =
    lesson.kind === "consequence"
      ? lesson.triggerText
      : ago === 1
        ? "Your last move missed a better option."
        : "The chance has gone.";
  const sub =
    lesson.kind === "consequence"
      ? "The cause was one of your recent moves."
      : ago === 1
        ? `Instead of ${lessonLabel(lesson)}, there was a clearly better move.`
        : `${ago} moves ago, with ${lessonLabel(lesson)}, you had a clearly better option.`;

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
          <LessonFeedback gameId={gameId} lessonId={lesson.id} />
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
