import {
  Game,
  lessonMove,
  playedLine,
  plyOf,
  recentUserMoves,
  userMovesAgo,
  type Lesson,
  type SessionState,
} from "@chess-teacher/core";
import type { ExplanationResponse } from "@chess-teacher/contract";
import { moveText, triggerText } from "@chess-teacher/lesson-text";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useState } from "react";
import type { RevealState } from "../game/storage.ts";
import { lessonMoves, lineMoves } from "../lib/moves.ts";
import { AiExplanation, coachConcept, useAiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";
import { Board, orientationOf } from "./Board.tsx";
import { MOVE_ARROW, moveMarkup, moveTitle } from "./MoveButton.tsx";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Button } from "../ui/Button.tsx";
import { RadioGroup } from "../ui/RadioGroup.tsx";

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
  const ai = useAiExplanation(loadExplanation);
  const missedMaterial =
    lesson.source === "features" ? lesson.feature === "material" : lesson.mistake === "misses_material";
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
      ago === 1 ? (
        <ParaglideMessage message={m.reveal_cause_last} inputs={{ move }} markup={markup} />
      ) : (
        m.reveal_cause_recent()
      )
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
        <FindCause
          state={state}
          lesson={lesson}
          reveal={reveal}
          hint={hint}
          onGuess={onGuess}
          onShowAnswer={onShowAnswer}
        />
      ) : (
        <div className="explain">
          {lesson.foundCause && (
            <p className="found">
              <span aria-hidden>✓</span> {m.reveal_found()}
            </p>
          )}
          <AiExplanation result={ai} lesson={lesson} played={playedLine(state, lesson)} />
          <Explanation lesson={lesson} coachConcept={coachConcept(ai)} />
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

/**
 * "Find the cause": the player picks one of their recent moves, sees it on a board (the
 * position before it, with the move as an arrow), and commits the guess (UX-42).
 */
function FindCause({
  state,
  lesson,
  reveal,
  hint,
  onGuess,
  onShowAnswer,
}: Pick<Props, "state" | "lesson" | "reveal" | "hint" | "onGuess" | "onShowAnswer">) {
  const locale = getLocale();
  const orientation = orientationOf(lesson.userColour);
  const start = plyOf(state.startFen);
  const choices = recentUserMoves(state, lesson).flatMap(([ply, ref]) => {
    const index = ply - start;
    const uci = state.moves[index];
    const played = uci
      ? lineMoves(new Game(state.startFen, state.moves.slice(0, index)).fen, [uci])[0]
      : undefined;
    return played ? [{ ply, label: moveText(ref, locale), move: played }] : [];
  });
  const open = choices.filter((c) => !reveal.wrong.includes(c.ply));
  const [picked, setPicked] = useState(open[0]?.ply ?? null);
  // A wrong guess is ruled out, so the selection moves on to a move still open.
  const current = open.find((c) => c.ply === picked) ?? open[0];

  return (
    <div className="find">
      <p className="prompt">{m.reveal_find()}</p>
      {current && (
        <div className="mx-auto mb-3 w-full max-w-64">
          <Board
            id={`cause-${lesson.id}`}
            label={m.moves_board_before({ move: moveTitle(current.move) })}
            fen={current.move.before}
            orientation={orientation}
            focusable={false}
            arrows={[{ from: current.move.from, to: current.move.to, color: MOVE_ARROW }]}
            showNotation={false}
          />
        </div>
      )}
      <RadioGroup
        label={m.reveal_choices()}
        variant="segmented"
        value={String(current?.ply ?? "")}
        onChange={(v) => setPicked(Number(v))}
        options={choices.map((c) => ({
          value: String(c.ply),
          label: c.label,
          isDisabled: reveal.wrong.includes(c.ply),
        }))}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="primary" isDisabled={!current} onPress={() => current && onGuess(current.ply)}>
          {m.reveal_choose()}
        </Button>
        <Button variant="link" onPress={onShowAnswer}>
          {m.reveal_show_answer()}
        </Button>
      </div>
      {reveal.attempts > 0 && <p className="not-that">{m.reveal_not_that()}</p>}
      {hint && <p className="hint">{m.reveal_hint({ hint })}</p>}
    </div>
  );
}
