import { lessonsOnLine, movesOfLine, plyOf, type Lesson, type SessionState } from "@chess-teacher/core";
import type { Move } from "chess.js";
import { useCallback, useMemo, useState } from "react";
import { lineMoves } from "../lib/moves.ts";
import type { Key } from "../ui/Disclosure.tsx";

export interface Replay {
  /** The line on the board: the game's own (`state.line`) or an earlier try. */
  line: number;
  /** Moves played on the board: 0 is the start position. */
  step: number;
  /** The line's moves, in order. */
  moves: Move[];
  /** The line's lessons, each with the step its mistake is played from. */
  lessons: { lesson: Lesson; at: number }[];
  /** False after a jump of more than one move, which the board shows without sliding pieces. */
  stepped: boolean;
  /** The lesson open in the review. */
  open: Key | null;
  go: (step: number) => void;
  /** Opens a lesson in the review (null closes it), and puts the board just before its mistake. */
  openLesson: (id: Key | null) => void;
  /** Leaves an earlier try for the game's own line, where the two part. */
  backToGame: () => void;
}

/** Where the board shows a lesson: just before its mistake, on the line it was played on. */
function viewOf(state: SessionState, lesson: Lesson) {
  // A lesson recorded on a line the save no longer has sits on the game's own line.
  const line = state.branches.some((b) => b.id === lesson.line) ? lesson.line : state.line;
  return { line, step: lesson.ply - plyOf(state.startFen), stepped: false };
}

/**
 * A finished game, move by move, linked with its review: opening a lesson shows its mistake on
 * the board. Starts on the final position, as the game ended, or with `initialLesson` (a link
 * to it) open and on the board.
 */
export function useReplay(state: SessionState, initialLesson: number | null): Replay {
  const [view, setView] = useState(() => {
    const lesson = state.lessons.find((l) => l.id === initialLesson);
    return lesson ? viewOf(state, lesson) : { line: state.line, step: state.moves.length, stepped: false };
  });
  const [open, setOpen] = useState<Key | null>(initialLesson);

  const moves = useMemo(() => lineMoves(state.startFen, movesOfLine(state, view.line)), [state, view.line]);
  const lessons = useMemo(() => {
    const start = plyOf(state.startFen);
    return lessonsOnLine(state, view.line).map((lesson) => ({ lesson, at: lesson.ply - start }));
  }, [state, view.line]);

  const go = useCallback(
    (step: number) =>
      setView((v) => {
        const to = Math.max(0, Math.min(step, moves.length));
        return { ...v, step: to, stepped: Math.abs(to - v.step) <= 1 };
      }),
    [moves.length],
  );

  const openLesson = useCallback(
    (id: Key | null) => {
      setOpen(id);
      const lesson = state.lessons.find((l) => l.id === id);
      if (lesson) setView(viewOf(state, lesson));
    },
    [state],
  );

  const backToGame = useCallback(() => {
    setView((v) => {
      const own = movesOfLine(state, v.line);
      let shared = 0;
      while (shared < own.length && own[shared] === state.moves[shared]) shared++;
      return { line: state.line, step: Math.min(v.step, shared), stepped: false };
    });
  }, [state]);

  return {
    line: view.line,
    step: Math.min(view.step, moves.length),
    moves,
    lessons,
    stepped: view.stepped,
    open,
    go,
    openLesson,
    backToGame,
  };
}
