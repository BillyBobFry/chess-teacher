import { lessonMove, reviewTree, type ReviewLine, type SessionState } from "@chess-teacher/core";
import { lessonTitle, moveText } from "@chess-teacher/lesson-text";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useEffect, useMemo, useRef } from "react";
import type { Replay } from "../game/useReplay.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Button } from "../ui/Button.tsx";
import type { Key } from "../ui/Disclosure.tsx";
import { Kbd } from "../ui/Kbd.tsx";
import { BalanceGraph } from "./BalanceGraph.tsx";
import { ARROW, Board, orientationOf } from "./Board.tsx";
import { moveTitle } from "./MoveButton.tsx";
import { lessonRowId } from "./Review.tsx";
import { Stepper } from "./Stepper.tsx";

/**
 * Where focus is, the arrow keys, Home and End already mean something (the board's squares,
 * a slider, a menu), so they don't step the replay.
 */
const KEEPS_KEYS =
  "input, textarea, select, dialog, [role=dialog], [role=grid], [role=slider], [role=menu], [role=listbox], [role=radiogroup], [role=tablist], [role=toolbar]";

const findLine = (line: ReviewLine, id: number): ReviewLine | null => {
  if (line.id === id) return line;
  for (const item of line.items) {
    const found = item.kind === "line" ? findLine(item.line, id) : null;
    if (found) return found;
  }
  return null;
};

/**
 * A finished game's board, stepped through move by move. Under it, the lesson whose mistake is
 * the move about to be played (drawn as an arrow) or just played, and which earlier try the
 * board is on when it isn't the game's own line.
 */
export function ReplayBoard({
  id,
  state,
  replay,
  balance,
  onShowLesson,
}: {
  id: string;
  state: SessionState;
  replay: Replay;
  /** Show the balance of power: the line has evaluations to draw (saves before version 3 don't). */
  balance: boolean;
  /** "Show lesson" was pressed: the review must be in view (a phone's drawer opened). */
  onShowLesson: () => void;
}) {
  const locale = getLocale();
  const { step, moves, go } = replay;
  const last = moves[step - 1] ?? null;
  const next = moves[step];
  const total = moves.length;
  const lessons = replay.lessons.filter(({ at }) => at === step || at === step - 1);
  const coming = replay.lessons.some(({ at }) => at === step);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest(KEEPS_KEYS))) return;
      const to =
        e.key === "ArrowLeft"
          ? step - 1
          : e.key === "ArrowRight"
            ? step + 1
            : e.key === "Home"
              ? 0
              : e.key === "End"
                ? total
                : null;
      if (to === null) return;
      e.preventDefault();
      go(to);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step, total, go]);

  // Where an earlier try leaves the line it hangs off in the review, as the review says it.
  const tree = useMemo(() => reviewTree(state), [state]);
  const earlierTry = useMemo(() => {
    if (replay.line === state.line) return null;
    let from = findLine(tree, replay.line)?.from;
    if (from === undefined) {
      from = 0;
      while (from < moves.length && moves[from]?.lan === state.moves[from]) from++;
    }
    const first = moves[from];
    return first ? moveTitle(first) : null;
  }, [tree, replay.line, state, moves]);

  // "Show lesson" opens it in the review and takes focus there, which on a phone is in the
  // drawer.
  const showing = useRef<Key | null>(null);
  useEffect(() => {
    if (showing.current === null || replay.open !== showing.current) return;
    const row = document.getElementById(lessonRowId(showing.current));
    showing.current = null;
    // Instant, as when a link opens a lesson, so nothing moves under reduced motion (UX-26).
    row?.scrollIntoView({ block: "start" });
    row?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }, [replay.open]);
  const showLesson = (lessonId: Key) => {
    showing.current = lessonId;
    replay.openLesson(lessonId);
    onShowLesson();
  };

  return (
    <>
      <Board
        id={id}
        label={m.board_game()}
        fen={last?.after ?? state.startFen}
        orientation={orientationOf(state.userColour)}
        // A replay to look at, not a board to play on: not a tab stop (keys step it instead).
        focusable={false}
        lastMove={last}
        arrows={coming && next ? [{ from: next.from, to: next.to, color: ARROW.yours }] : []}
        animate={replay.stepped}
      />
      {balance && <BalanceGraph state={state} replay={replay} />}
      <Stepper
        label={m.replay_stepper()}
        step={step}
        total={total}
        position={last ? moveTitle(last) : m.replay_start()}
        onStep={go}
        shortcuts
      />
      {/* Room for a note held open, so stepping on and off a lesson doesn't move the page (UX-27). */}
      <div className="grid min-h-12 content-start gap-1">
        {earlierTry && (
          <p className="m-0 flex flex-wrap items-baseline gap-x-3">
            <span className="text-sm font-semibold text-fg-muted">
              {m.review_branch({ move: earlierTry })}
            </span>
            <Button variant="link" onPress={replay.backToGame}>
              {m.replay_back_to_game()}
            </Button>
          </p>
        )}
        {/* Read out as the replay steps onto a lesson, like the board reads the move. */}
        <div aria-live="polite" className="grid gap-1">
          {lessons.map(({ lesson }) => (
            <p key={lesson.id} className="m-0 flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold">{moveText(lessonMove(lesson), locale)}</span>
              <span>{lessonTitle(lesson, locale)}</span>
              {replay.open !== lesson.id && (
                <Button variant="link" onPress={() => showLesson(lesson.id)}>
                  {m.replay_show_lesson()}
                </Button>
              )}
            </p>
          ))}
        </div>
      </div>
      {/* Touch screens have no keys to press. */}
      <p className="m-0 text-sm text-fg-muted pointer-coarse:hidden">
        <ParaglideMessage
          message={m.replay_keyboard_hint}
          inputs={{}}
          markup={{ kbd: ({ children }) => <Kbd>{children}</Kbd> }}
        />
      </p>
    </>
  );
}
