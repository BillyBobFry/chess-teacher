import { gameOutcome, lessonMove, playedLine, type Lesson, type SessionState } from "@chess-teacher/core";
import { moveText, principleTitle } from "@chess-teacher/lesson-text";
import { useState } from "react";
import type { Key } from "../ui/Disclosure.tsx";
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
  // Praise for a clean game is only earned by finishing it without losing (UX-30).
  const earned = ["won", "drawn"].includes(gameOutcome(state));
  const [open, setOpen] = useState<Key | null>(null);
  const locale = getLocale();
  return (
    <section className="review">
      <h2>{m.review_title()}</h2>
      <p className="muted">{result}</p>
      {lessons.length === 0 ? (
        <p>{earned ? m.review_none() : m.review_none_neutral()}</p>
      ) : (
        <DisclosureGroup className="mb-4" expanded={open} onExpandedChange={setOpen}>
          {lessons.map((l) => {
            const o = outcome(l);
            return (
              <Disclosure
                key={l.id}
                id={l.id}
                summary={
                  <span className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-0.5">
                    <span className="row-span-2 font-semibold">{moveText(lessonMove(l), locale)}</span>
                    <span>{principleTitle(l.principle, locale)}</span>
                    <span className="text-sm text-fg-muted">
                      {o.text}
                      {o.tick && <span aria-hidden> ✓</span>}
                    </span>
                  </span>
                }
              >
                {open === l.id && (
                  <>
                    <Explanation lesson={l} />
                    <Futures lesson={l} played={playedLine(state, l)} />
                    <LessonFeedback gameId={gameId} lessonId={l.id} />
                  </>
                )}
              </Disclosure>
            );
          })}
        </DisclosureGroup>
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
