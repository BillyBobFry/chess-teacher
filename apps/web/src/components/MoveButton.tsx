import { fullmoveOf } from "@chess-teacher/core";
import { moveText } from "@chess-teacher/lesson-text";
import type { Move } from "chess.js";
import { useId, useState, type ReactNode } from "react";
import { spokenMove } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { Board, type Orientation } from "./Board.tsx";
import { Button } from "../ui/Button.tsx";
import { Popover, PopoverTrigger } from "../ui/Popover.tsx";
import { Stepper } from "./Stepper.tsx";

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

/**
 * A line of moves written out in full ("9...Bxg3 10. dxc6 Bxf2+") as one button. Its popover
 * starts like a single move's, then steps through the line like the futures do. `children` is
 * the line as the text around it writes it.
 */
export function LineButton({
  moves,
  orientation,
  children,
}: {
  moves: [Move, ...Move[]];
  orientation: Orientation;
  children: ReactNode;
}) {
  const first = moves[0];
  const last = moves.at(-1) ?? first;
  // Read after the visible text, so the name still starts with what's on screen (WCAG 2.5.3).
  const spoken = moves
    .map((mv) =>
      (mv.color === "w" ? m.moves_spoken_white : m.moves_spoken_black)({
        moveNumber: fullmoveOf(mv.before),
        move: spokenMove(mv),
      }),
    )
    .join(" ");
  return (
    <PopoverTrigger>
      {/* One flex item, so a long line wraps inside the button rather than overflowing it. */}
      <Button variant="inline">
        <span className="text-start">{children}</span> <span className="sr-only">{spoken}</span>
      </Button>
      <Popover label={m.moves_line({ first: moveTitle(first), last: moveTitle(last) })} size="large">
        <LineSteps moves={moves} orientation={orientation} />
      </Popover>
    </PopoverTrigger>
  );
}

/** Inside the popover, so each opening starts again from before the first move. */
function LineSteps({ moves, orientation }: { moves: [Move, ...Move[]]; orientation: Orientation }) {
  const id = useId();
  const boardId = id.replace(/[^\w-]/g, "");
  // 0 is before the first move; n is after the nth.
  const [step, setStep] = useState(0);
  const first = moves[0];
  const shown = moves[step - 1] ?? first;
  const title = moveTitle(shown);
  return (
    <>
      <p className="m-0 mb-2 font-semibold">{title}</p>
      <Board
        id={boardId}
        label={step === 0 ? m.moves_board_before({ move: title }) : m.moves_board_after({ move: title })}
        fen={step === 0 ? first.before : shown.after}
        orientation={orientation}
        focusable={false}
        lastMove={step === 0 ? null : shown}
        arrows={step === 0 ? [{ from: first.from, to: first.to, color: MOVE_ARROW }] : []}
        showNotation={false}
      />
      <div className="mt-2">
        <Stepper
          label={m.moves_line_stepper()}
          step={step}
          total={moves.length}
          position={step === 0 ? m.futures_before() : m.futures_step({ step, total: moves.length })}
          onStep={setStep}
          shortcuts={false}
        />
      </div>
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
