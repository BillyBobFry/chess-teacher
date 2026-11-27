import type { Lesson } from "@chess-teacher/core";
import type { Move } from "chess.js";
import { Fragment } from "react";
import { lessonMoves, lineMoves, placeMoves } from "../lib/moves.ts";
import type { Orientation } from "./Board.tsx";
import { LineButton, MoveButton } from "./MoveButton.tsx";

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
 * `known` previews its board, and a line written out in full previews as one, step by step;
 * a move we can't place stays text, rather than show a wrong board.
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
      {placeMoves(text, known.lines, known.named).map((part, i) => {
        if (part.kind === "text") return <Fragment key={i}>{part.text}</Fragment>;
        if (part.kind === "unplaced") {
          return (
            <span key={i} className="move">
              {part.text}
            </span>
          );
        }
        const [move, ...rest] = part.moves;
        if (rest.length === 0) {
          return (
            <MoveButton key={i} move={move} orientation={orientation}>
              {part.segments.map((seg) => seg.text).join("")}
            </MoveButton>
          );
        }
        return (
          <LineButton key={i} moves={part.moves} orientation={orientation}>
            {part.segments.map((seg, j) =>
              seg.move ? (
                <span key={j} className="move">
                  {seg.text}
                </span>
              ) : (
                seg.text
              ),
            )}
          </LineButton>
        );
      })}
    </>
  );
}
