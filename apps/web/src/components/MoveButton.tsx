import { fullmoveOf } from "@chess-teacher/core";
import { moveText } from "@chess-teacher/lesson-text";
import type { Move } from "chess.js";
import { useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { spokenMove } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Board, type Orientation } from "./Board.tsx";

// SVG attributes, so a literal colour rather than a CSS variable.
const MOVE_ARROW = "#3f6fb0";

// Without popovers a move stays plain text: the preview is extra, never needed to play.
const POPOVERS = Object.hasOwn(HTMLElement.prototype, "popover");

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
}: {
  move: Move;
  orientation: Orientation;
  children: ReactNode;
}) {
  const id = useId();
  const boardId = id.replace(/[^\w-]/g, "");
  // Only an open preview draws its board.
  const [open, setOpen] = useState(false);
  if (!POPOVERS) return <span className="move">{children}</span>;

  const title = moveTitle(move);
  // Read after the visible text, so the name still starts with what's on screen (WCAG 2.5.3).
  const spoken = (move.color === "w" ? m.moves_spoken_white : m.moves_spoken_black)({
    moveNumber: fullmoveOf(move.before),
    move: spokenMove(move),
  });
  return (
    <>
      <button
        type="button"
        className="move move-button"
        popoverTarget={id}
        data-open={open || undefined}
        // Drawn before the popover opens, so it never shows empty.
        onClick={() => setOpen(true)}
      >
        {children} <span className="visually-hidden">{spoken}</span>
      </button>
      {/* In the body, so a move inside a paragraph doesn't put boards inside it. The browser
          still puts it next after the button in the tab order, and anchors it to the button. */}
      {createPortal(
        <div
          id={id}
          popover="auto"
          className="move-preview"
          role="group"
          aria-label={title}
          onToggle={(e) => setOpen(e.newState === "open")}
        >
          {open && (
            <>
              <p className="move-preview-title">{title}</p>
              <Board
                id={boardId}
                label={m.moves_board_before({ move: title })}
                fen={move.before}
                orientation={orientation}
                arrows={[{ from: move.from, to: move.to, color: MOVE_ARROW }]}
                showNotation={false}
              />
            </>
          )}
        </div>,
        document.body,
      )}
    </>
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
