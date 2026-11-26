import { Game, fullmoveOf, MISSED_CHANCE, type LessonKind } from "@chess-teacher/core";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { spokenMove } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";
import type { Orientation } from "./Board.tsx";
import { MoveButton } from "./MoveButton.tsx";

/** The moves of a finished game, as the review's replay steps through them. */
export interface MoveListReplay {
  /** Moves played on the board: the one before it is marked as being shown. */
  step: number;
  onStep: (step: number) => void;
  /** Where each lesson's mistake is in the moves, and what kind it is. */
  lessons: ReadonlyMap<number, LessonKind>;
}

/**
 * The game's moves in pairs. In play each move previews its board, and the list keeps the
 * latest in view; in the review (`replay`) each move puts the replay's board there.
 */
export function MoveList({
  startFen,
  moves,
  orientation,
  replay,
}: {
  startFen: string;
  moves: string[];
  orientation: Orientation;
  replay: MoveListReplay | null;
}) {
  const played = useMemo(() => {
    const game = new Game(startFen);
    return moves.map((uci) => game.push(uci));
  }, [startFen, moves]);
  const black = startFen.split(" ")[1] === "b";
  const rows: [number, number | null, number | null][] = [];
  const all: (number | null)[] = black ? [null, ...played.keys()] : [...played.keys()];
  for (let i = 0; i < all.length; i += 2) rows.push([i / 2 + 1, all[i] ?? null, all[i + 1] ?? null]);
  const list = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  // Braces matter: newer browsers return a Promise from scrollIntoView, and React would
  // try to call it as the effect's cleanup.
  useEffect(() => {
    if (!replay) end.current?.scrollIntoView({ block: "nearest" });
  }, [moves.length, replay]);

  // Keep the move being shown in view by scrolling the list alone: scrollIntoView would also
  // scroll the panel around it, away from a lesson being read, with every step.
  const step = replay?.step;
  useLayoutEffect(() => {
    const box = list.current;
    const current = box?.querySelector('[aria-current="true"]');
    if (!box || !current) return;
    const item = current.getBoundingClientRect();
    const view = box.getBoundingClientRect();
    if (item.top < view.top) box.scrollTop -= view.top - item.top;
    else if (item.bottom > view.bottom) box.scrollTop += item.bottom - view.bottom;
  }, [step]);

  /** `empty` stands in for White's move when the game started with Black to move. */
  const cell = (i: number | null, empty: string) => {
    const move = i === null ? undefined : played[i];
    if (!move || i === null) return <span>{empty}</span>;
    // In a list rather than a sentence, so it can take a full 44px target (UX-23).
    const size = "pointer-coarse:min-h-11 pointer-coarse:min-w-11";
    if (!replay) {
      return (
        <span>
          <MoveButton move={move} orientation={orientation} className={size}>
            {move.san}
          </MoveButton>
        </span>
      );
    }
    const lesson = replay.lessons.get(i);
    // Read after the visible text, so the name still starts with what's on screen (WCAG 2.5.3).
    const spoken = (move.color === "w" ? m.moves_spoken_white : m.moves_spoken_black)({
      moveNumber: fullmoveOf(move.before),
      move: spokenMove(move),
    });
    return (
      <span className="flex items-center gap-1">
        <Button
          variant="item"
          className={size}
          aria-current={i === replay.step - 1 ? "true" : undefined}
          onPress={() => replay.onStep(i + 1)}
        >
          <span className="move">{move.san}</span> <span className="sr-only">{spoken}</span>
          {lesson && <span className="sr-only"> {m.moves_lesson()}</span>}
        </Button>
        {/* A dot, not just a colour, marks a lesson (UX-36); its colour says which kind. */}
        {lesson && (
          <span
            aria-hidden
            className={`size-2 shrink-0 rounded-full ${lesson === MISSED_CHANCE ? "bg-chance" : "bg-warning"}`}
          />
        )}
      </span>
    );
  };

  return (
    // In the review the list scrolls on its own, so stepping never scrolls a lesson being read.
    <div
      ref={list}
      className={replay ? "moves max-h-80 overflow-y-auto overscroll-contain" : "moves"}
      aria-label={m.panel_moves()}
    >
      {rows.length === 0 && <p className="muted">{m.moves_empty()}</p>}
      <ol>
        {rows.map(([n, w, b]) => (
          <li key={n}>
            <span className="n">{n}.</span>
            {cell(w, "…")}
            {cell(b, "")}
          </li>
        ))}
      </ol>
      <div ref={end} />
    </div>
  );
}
