import type { Lesson } from "@chess-teacher/core";
import type { Move } from "chess.js";
import { Fragment } from "react";
import { findMove, lessonMoves, lineMoves, splitMoves } from "../lib/moves.ts";
import type { Orientation } from "./Board.tsx";
import { MoveButton } from "./MoveButton.tsx";

/** The moves a lesson's text can mention. */
export interface KnownMoves {
  /** Every move in the lines the text could mention. */
  lines: Move[];
  /** The mistake and the better move. */
  named: Move[];
}

/** The lesson's lines, its mistake and better move, and any `extra` lines from its position. */
export function knownMoves(lesson: Lesson, extra: string[][]): KnownMoves {
  const { yours, better } = lessonMoves(lesson);
  return {
    lines: [lesson.userLine, lesson.bestLine, ...extra].flatMap((line) => lineMoves(lesson.fenBefore, line)),
    named: [yours, better].filter((mv) => mv !== undefined),
  };
}

/**
 * Text with chess moves picked out so they're easy to spot. A move that is surely one of
 * `known` previews its board; one we can't place stays text, rather than show a wrong board.
 */
export function MoveText({
  text,
  known,
  orientation,
}: {
  text: string;
  known: KnownMoves;
  orientation: Orientation;
}) {
  return (
    <>
      {splitMoves(text).map((seg, i) => {
        if (!seg.move) return <Fragment key={i}>{seg.text}</Fragment>;
        const move = findMove(seg.text, known.lines, known.named);
        return move ? (
          <MoveButton key={i} move={move} orientation={orientation}>
            {seg.text}
          </MoveButton>
        ) : (
          <span key={i} className="move">
            {seg.text}
          </span>
        );
      })}
    </>
  );
}
