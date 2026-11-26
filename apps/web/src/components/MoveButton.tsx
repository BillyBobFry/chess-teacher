import { fullmoveOf } from "@chess-teacher/core";
import { moveText } from "@chess-teacher/lesson-text";
import type { Move } from "chess.js";
import { useId, type ReactNode } from "react";
import { spokenMove } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Board, type Orientation } from "./Board.tsx";
import { Button } from "../ui/Button.tsx";
import { Popover, PopoverTrigger } from "../ui/Popover.tsx";

// SVG attributes, so a literal colour rather than a CSS variable.
export const MOVE_ARROW = "#3f6fb0";

/** "12. Nf3", "12… Nf6": through the one move formatter (UX-106). */
export const moveTitle = (move: Move): string =>
  moveText({ moveNumber: fullmoveOf(move.before), colour: move.color, san: move.san }, getLocale());

/**
 * A move that opens a popover with the board before it and the move as an arrow, like a
 * lesson's futures. The title's notation covers what an arrow can't show (castling's rook,
 * a promotion). `children` is the move as the text around it writes it.
 */
export function MoveButton({
  move,
  orientation,
  children,
  className,
}: {
  move: Move;
  orientation: Orientation;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  const id = useId();
  const boardId = id.replace(/[^\w-]/g, "");
  const title = moveTitle(move);
  // Read after the visible text, so the name still starts with what's on screen (WCAG 2.5.3).
  const spoken = (move.color === "w" ? m.moves_spoken_white : m.moves_spoken_black)({
    moveNumber: fullmoveOf(move.before),
    move: spokenMove(move),
  });
  return (
    <PopoverTrigger>
      <Button variant="inline" className={className}>
        <span className="move">{children}</span> <span className="sr-only">{spoken}</span>
      </Button>
      <Popover label={title}>
        <p className="m-0 mb-2 font-semibold">{title}</p>
        <Board
          id={boardId}
          label={m.moves_board_before({ move: title })}
          fen={move.before}
          orientation={orientation}
          focusable={false}
          arrows={[{ from: move.from, to: move.to, color: MOVE_ARROW }]}
          showNotation={false}
        />
      </Popover>
    </PopoverTrigger>
  );
}

/** Markup for a Paraglide message (`{#move}…{/move}`): its text becomes a MoveButton. */
export const moveMarkup = (move: Move | null | undefined, orientation: Orientation) =>
  function MoveMarkup({ children }: { children?: ReactNode }) {
    return move ? (
      <MoveButton move={move} orientation={orientation}>
        {children}
      </MoveButton>
    ) : (
      <>{children}</>
    );
  };
