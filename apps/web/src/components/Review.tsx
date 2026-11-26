import {
  gameOutcome,
  lessonMove,
  playedLine,
  reviewLessons,
  reviewTree,
  type Lesson,
  type ReviewLine,
  type SessionState,
} from "@chess-teacher/core";
import { lessonTitle, moveText } from "@chess-teacher/lesson-text";
import { useCallback, useMemo, useState } from "react";
import { api } from "../api/client.ts";
import type { Key } from "../ui/Disclosure.tsx";
import { AiExplanation, coachConcept, useAiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Button } from "../ui/Button.tsx";
import { Disclosure, DisclosureGroup } from "../ui/Disclosure.tsx";

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

/**
 * Post-game review: every lesson, with its explanations and futures on demand. Where the player
 * went back and played on differently, what they played first hangs off the move they went
 * back to, indented, with its own lessons: a tree of the lines they played.
 */
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
  const lessons = reviewLessons(state);
  const tree = useMemo(() => reviewTree(state), [state]);
  const branched = tree.items.some((i) => i.kind === "line");
  // Praise for a clean game is only earned by finishing it without losing (UX-30).
  const earned = ["won", "drawn"].includes(gameOutcome(state));
  const [open, setOpen] = useState<Key | null>(null);
  return (
    <section className="review">
      <h2>{m.review_title()}</h2>
      <p className="muted">{result}</p>
      {lessons.length === 0 ? (
        <p>{earned ? m.review_none() : m.review_none_neutral()}</p>
      ) : (
        <>
          {branched && <p className="text-sm text-fg-muted">{m.review_branch_note()}</p>}
          <DisclosureGroup className="mb-4" expanded={open} onExpandedChange={setOpen}>
            <Line line={tree} state={state} gameId={gameId} open={open} />
          </DisclosureGroup>
        </>
      )}
      <div className="actions">
        <Button variant="primary" onPress={onNewGame}>
          {m.nav_new_game()}
        </Button>
        {onProgress && <Button onPress={onProgress}>{m.account_progress()}</Button>}
      </div>
    </section>
  );
}

/** One line of play: its lessons, and the lines left behind from it, in the order they happened. */
function Line({
  line,
  state,
  gameId,
  open,
}: {
  line: ReviewLine;
  state: SessionState;
  gameId: string;
  open: Key | null;
}) {
  const locale = getLocale();
  return (
    <ol className="m-0 list-none p-0">
      {line.items.map((item) =>
        item.kind === "lesson" ? (
          <li key={`lesson-${item.lesson.id}`}>
            <LessonRow lesson={item.lesson} state={state} gameId={gameId} open={open === item.lesson.id} />
          </li>
        ) : (
          <li key={`line-${item.line.id}`} className="mt-3 mb-1 border-s-2 border-border ps-3">
            {item.line.firstMove && (
              <p className="m-0 text-sm font-semibold text-fg-muted">
                {m.review_branch({ move: moveText(item.line.firstMove, locale) })}
              </p>
            )}
            <Line line={item.line} state={state} gameId={gameId} open={open} />
          </li>
        ),
      )}
    </ol>
  );
}

function LessonRow({
  lesson,
  state,
  gameId,
  open,
}: {
  lesson: Lesson;
  state: SessionState;
  gameId: string;
  open: boolean;
}) {
  const locale = getLocale();
  const o = outcome(lesson);
  return (
    <Disclosure
      id={lesson.id}
      summary={
        <span className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-0.5">
          <span className="row-span-2 font-semibold">{moveText(lessonMove(lesson), locale)}</span>
          <span>{lessonTitle(lesson, locale)}</span>
          <span className="text-sm text-fg-muted">
            {o.text}
            {o.tick && <span aria-hidden> ✓</span>}
          </span>
        </span>
      }
    >
      {open && <LessonBody lesson={lesson} state={state} gameId={gameId} />}
    </Disclosure>
  );
}

/** An open lesson: the coach's explanation saved at its reveal, the facts, the futures. */
function LessonBody({ lesson, state, gameId }: { lesson: Lesson; state: SessionState; gameId: string }) {
  const played = playedLine(state, lesson);
  // Only an explanation already written at the reveal: the review never asks for a new one,
  // which would spend the player's allowance on lessons they were never shown. So "pending"
  // here means there is none (or not yet), not that the coach is slow.
  const loadExplanation = useCallback(
    () =>
      api
        .explanation(gameId, lesson.id)
        .then((r) => (r.status === "pending" ? null : r))
        .catch(() => null),
    [gameId, lesson.id],
  );
  const ai = useAiExplanation(loadExplanation);
  return (
    <>
      <AiExplanation result={ai} lesson={lesson} played={played} />
      <Explanation lesson={lesson} coachConcept={coachConcept(ai)} />
      <Futures lesson={lesson} played={played} />
      <LessonFeedback gameId={gameId} lessonId={lesson.id} />
    </>
  );
}
