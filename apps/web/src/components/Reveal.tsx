import {
  lessonMove,
  playedLine,
  recentUserMoves,
  userMovesAgo,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import type { ExplanationResponse } from "@chess-teacher/contract";
import { moveText, triggerText } from "@chess-teacher/lesson-text";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import type { RevealState } from "../game/storage.ts";
import { lessonMoves } from "../lib/moves.ts";
import { AiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";
import { orientationOf } from "./Board.tsx";
import { moveMarkup } from "./MoveButton.tsx";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Button } from "../ui/Button.tsx";

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
  const locale = getLocale();
  const ago = userMovesAgo(state, lesson);
  const move = moveText(lessonMove(lesson), locale);
  const missedMaterial = lesson.feature === "material";
  const headline =
    lesson.kind === "consequence" && lesson.trigger
      ? triggerText(lesson.trigger, locale)
      : ago === 1
        ? missedMaterial
          ? m.reveal_missed_material_last()
          : m.reveal_missed_last()
        : missedMaterial
          ? m.reveal_material_chance_gone()
          : m.reveal_chance_gone();
  const markup = { move: moveMarkup(lessonMoves(lesson).yours, orientationOf(lesson.userColour)) };
  const sub =
    lesson.kind === "consequence" ? (
      m.reveal_cause_recent()
    ) : ago === 1 ? (
      <ParaglideMessage message={m.reveal_missed_last_detail} inputs={{ move }} markup={markup} />
    ) : (
      <ParaglideMessage message={m.reveal_missed_ago_detail} inputs={{ ago, move }} markup={markup} />
    );

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
            {recentUserMoves(state, lesson).map(([ply, choice]) => (
              <Button key={ply} isDisabled={reveal.wrong.includes(ply)} onPress={() => onGuess(ply)}>
                {moveText(choice, locale)}
              </Button>
            ))}
          </div>
          {reveal.attempts > 0 && <p className="not-that">{m.reveal_not_that()}</p>}
          {hint && <p className="hint">{m.reveal_hint({ hint })}</p>}
          <Button variant="link" onPress={onShowAnswer}>
            {m.reveal_show_answer()}
          </Button>
        </div>
      ) : (
        <div className="explain">
          {lesson.foundCause && (
            <p className="found">
              <span aria-hidden>✓</span> {m.reveal_found()}
            </p>
          )}
          <AiExplanation load={loadExplanation} lesson={lesson} played={playedLine(state, lesson)} />
          <Explanation lesson={lesson} />
          <Futures lesson={lesson} played={playedLine(state, lesson)} />
          <LessonFeedback gameId={gameId} lessonId={lesson.id} />
          <div className="actions">
            <Button variant="primary" onPress={onRewind}>
              {m.reveal_rewind({ move })}
            </Button>
            <Button onPress={onContinue}>{m.reveal_carry_on()}</Button>
          </div>
        </div>
      )}
    </section>
  );
}
