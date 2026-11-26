import { lessonMove, type Lesson } from "@chess-teacher/core";
import { lessonTitle, moveText } from "@chess-teacher/lesson-text";
import { useCallback } from "react";
import { api } from "../api/client.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Disclosure, type Key } from "../ui/Disclosure.tsx";
import { AiExplanation, coachConcept, useAiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";
import { LessonFeedback } from "./LessonFeedback.tsx";

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
 * A finished lesson as a row of a `DisclosureGroup`: its move, what it teaches and what became
 * of it; opened, its explanations and futures. `id` is its key in the group, unique there.
 */
export function LessonRow({
  id,
  lesson,
  played,
  gameId,
  open,
  note,
}: {
  id: Key;
  lesson: Lesson;
  /** The moves really played from the mistake on (`playedLine`). */
  played: string[];
  gameId: string;
  open: boolean;
  /** Said after the outcome, where the row's place doesn't already say it. */
  note: string | null;
}) {
  const locale = getLocale();
  const o = outcome(lesson);
  return (
    <Disclosure
      id={id}
      summary={
        <span className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-0.5">
          <span className="row-span-2 font-semibold">{moveText(lessonMove(lesson), locale)}</span>
          <span>{lessonTitle(lesson, locale)}</span>
          <span className="text-sm text-fg-muted">
            {o.text}
            {o.tick && <span aria-hidden> ✓</span>}
            {note && ` · ${note}`}
          </span>
        </span>
      }
    >
      {open && <LessonBody lesson={lesson} played={played} gameId={gameId} />}
    </Disclosure>
  );
}

/** An open lesson: the coach's explanation saved at its reveal, the facts, the futures. */
function LessonBody({ lesson, played, gameId }: { lesson: Lesson; played: string[]; gameId: string }) {
  // Only an explanation already written at the reveal: a finished lesson never asks for a new
  // one, which would spend the player's allowance on lessons they were never shown. So
  // "pending" here means there is none (or not yet), not that the coach is slow.
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
