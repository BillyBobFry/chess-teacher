import {
  lessonBestSan,
  playedLine,
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
import { m } from "../paraglide/messages.js";

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
        ? m.reveal_missed_last()
        : m.reveal_chance_gone();
  const sub =
    lesson.kind === "consequence"
      ? m.reveal_cause_recent()
      : ago === 1
        ? m.reveal_missed_last_detail({ move: lessonLabel(lesson) })
        : m.reveal_missed_ago_detail({ ago, move: lessonLabel(lesson) });

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
          <p className="prompt">{m.reveal_find()}</p>
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
          {reveal.attempts > 0 && <p className="not-that">{m.reveal_not_that()}</p>}
          {hint && <p className="hint">{m.reveal_hint({ hint })}</p>}
          <button className="link" onClick={onShowAnswer}>
            {m.reveal_show_answer()}
          </button>
        </div>
      ) : (
        <div className="explain">
          {lesson.foundCause && (
            <p className="found">
              <span aria-hidden>✓</span> {m.reveal_found()}
            </p>
          )}
          <AiExplanation
            load={loadExplanation}
            betterMove={lessonBestSan(lesson)}
            missedChance={lesson.kind === "missed_chance"}
          />
          <Explanation lesson={lesson} />
          <Futures lesson={lesson} played={playedLine(state, lesson)} />
          <LessonFeedback gameId={gameId} lessonId={lesson.id} />
          <div className="actions">
            <button className="primary" onClick={onRewind}>
              {m.reveal_rewind({ move: lessonLabel(lesson) })}
            </button>
            <button onClick={onContinue}>{m.reveal_carry_on()}</button>
          </div>
        </div>
      )}
    </section>
  );
}
