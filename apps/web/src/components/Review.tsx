import {
  gameOutcome,
  movesOfLine,
  playedLine,
  reviewLessons,
  reviewTree,
  type ReviewLine,
  type SessionState,
} from "@chess-teacher/core";
import { moveText } from "@chess-teacher/lesson-text";
import { useEffect, useMemo } from "react";
import type { Replay } from "../game/useReplay.ts";
import type { Key } from "../ui/Disclosure.tsx";
import { orientationOf } from "./Board.tsx";
import { LessonRow } from "./LessonRow.tsx";
import { MoveList } from "./MoveList.tsx";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Button } from "../ui/Button.tsx";
import { DisclosureGroup } from "../ui/Disclosure.tsx";

/** A lesson's row in the review, so it can be scrolled to (from a link, or the replay). */
export const lessonRowId = (lessonId: Key) => `review-lesson-${lessonId}`;

/**
 * Post-game review: every lesson, with its explanations and futures on demand. Where the player
 * went back and played on differently, what they played first hangs off the move they went
 * back to, indented, with its own lessons: a tree of the lines they played. Then the moves of
 * the line on the replay's board, each of which puts the board there.
 */
export function Review({
  gameId,
  state,
  result,
  replay,
  openLesson,
  onNewGame,
  onBackToGame,
  onProgress,
}: {
  gameId: string;
  state: SessionState;
  result: string;
  /** The game on the board: which lesson is open, and the line whose moves are listed. */
  replay: Replay;
  /** A lesson to start open and scrolled to (a link from a principle's page), or null. */
  openLesson: number | null;
  onNewGame: () => void;
  /**
   * Returns to a game still in progress, when this review is of an earlier game. Null when
   * there isn't one; then the next step is a new game.
   */
  onBackToGame: (() => void) | null;
  onProgress?: () => void;
}) {
  const lessons = reviewLessons(state);
  const tree = useMemo(() => reviewTree(state), [state]);
  const branched = tree.items.some((i) => i.kind === "line");
  // Praise for a clean game is only earned by finishing it without losing (UX-30).
  const earned = ["won", "drawn"].includes(gameOutcome(state));
  const { open, openLesson: setOpen } = replay;
  const lineMoves = useMemo(() => movesOfLine(state, replay.line), [state, replay.line]);
  const lessonAt = useMemo(
    () => new Map(replay.lessons.map(({ lesson, at }) => [at, lesson.kind])),
    [replay.lessons],
  );
  useEffect(() => {
    // Instant, so nothing moves under reduced motion (UX-26). Only on arrival: the player
    // scrolls from there.
    if (openLesson !== null)
      document.getElementById(lessonRowId(openLesson))?.scrollIntoView({ block: "start" });
  }, [openLesson]);
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
      <h3 className="mt-0 mb-2 text-base">{m.panel_moves()}</h3>
      <MoveList
        startFen={state.startFen}
        moves={lineMoves}
        orientation={orientationOf(state.userColour)}
        replay={{ step: replay.step, onStep: replay.go, lessons: lessonAt }}
      />
      <div className="actions">
        {/* With a game in progress, a new game would resign it; the way on is back to that game. */}
        <Button variant="primary" onPress={onBackToGame ?? onNewGame}>
          {onBackToGame ? m.game_back_to_current() : m.nav_new_game()}
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
          // The margin keeps what's just above it in view when it's scrolled to, such as the
          // earlier try it's in.
          <li key={`lesson-${item.lesson.id}`} id={lessonRowId(item.lesson.id)} className="scroll-mt-12">
            <LessonRow
              id={item.lesson.id}
              lesson={item.lesson}
              played={playedLine(state, item.lesson)}
              gameId={gameId}
              open={open === item.lesson.id}
              // The tree already shows which try it was in.
              note={null}
            />
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
