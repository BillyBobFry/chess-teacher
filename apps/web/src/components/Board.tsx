import { Chess, type Color, type Move, type Square } from "chess.js";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Chessboard } from "react-chessboard";
import { pieceName, spokenMove } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";

export type Orientation = "white" | "black";

/** The board as the player sees it: their own pieces at the bottom. */
export const orientationOf = (colour: Color): Orientation => (colour === "w" ? "white" : "black");

export interface BoardArrow {
  from: string;
  to: string;
  color: string;
}

interface Props {
  id: string;
  /** The board's accessible name, e.g. "Game board" or the caption beside it. */
  label: string;
  fen: string;
  orientation: Orientation;
  /** When set, the user can move pieces of the side to move (click, drag or keyboard). */
  onMove?: (uci: string) => boolean;
  /** The move that led to `fen`, marked on the board and read out to screen readers. */
  lastMove?: Move | null;
  arrows?: BoardArrow[];
  /** Extra square highlights, e.g. the pieces a lesson is about. */
  marked?: string[];
  showNotation?: boolean;
}

type Mark = "last" | "lesson" | "selected" | "target" | "capture";

const MARK_TEXT: Partial<Record<Mark, () => string>> = {
  last: m.board_mark_last_move,
  lesson: m.board_mark_lesson,
  target: m.board_mark_target,
  capture: m.board_mark_capture,
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];

/** Squares as the player sees them, top row first. */
const rowsFor = (orientation: Props["orientation"]): string[][] => {
  const files = orientation === "white" ? FILES : [...FILES].reverse();
  const ranks = orientation === "white" ? RANKS : [...RANKS].reverse();
  return ranks.map((rank) => files.map((file) => file + rank));
};

/** Keyboard step for each key: [row, column], in the board's on-screen layout. */
const STEPS: Partial<Record<string, [number, number]>> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

/**
 * A chessboard. react-chessboard draws it and handles the pointer (click and drag); over it
 * sits an invisible ARIA grid of the 64 squares, which is what the keyboard and screen readers
 * use (UX-100). Marks differ by shape as well as colour (UX-101).
 */
export function Board({
  id,
  label,
  fen,
  orientation,
  onMove,
  lastMove,
  arrows,
  marked,
  showNotation = true,
}: Props) {
  const chess = useMemo(() => new Chess(fen), [fen]);
  const interactive = !!onMove;
  // Selection and announcements belong to one position; a new position clears them.
  const [selection, setSelection] = useState<{ fen: string; square: string } | null>(null);
  const [said, setSaid] = useState<{ fen: string; text: string } | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const selected = selection?.fen === fen ? selection.square : null;
  const announcement = said?.fen === fen ? said.text : "";
  const say = (text: string) => setSaid({ fen, text });

  const visual = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<string, HTMLDivElement>());
  const describedBy = useId();
  const rows = useMemo(() => rowsFor(orientation), [orientation]);
  const lists = useMemo(
    () => ({
      facts: new Intl.ListFormat(getLocale(), { type: "unit", style: "short" }),
      or: new Intl.ListFormat(getLocale(), { type: "disjunction" }),
    }),
    [],
  );

  const targets = useMemo(
    () => (selected ? chess.moves({ square: selected as Square, verbose: true }) : []),
    [chess, selected],
  );

  // react-chessboard makes every piece a focusable "draggable" button with its own English
  // keyboard drag. The grid replaces that, so take the pieces out of the tab order; the
  // visual board is aria-hidden and must hold nothing focusable.
  useEffect(() => {
    const root = visual.current;
    if (!root) return;
    const strip = () => {
      for (const el of root.querySelectorAll("[tabindex]")) {
        el.removeAttribute("tabindex");
        el.removeAttribute("role");
        el.removeAttribute("aria-roledescription");
        el.removeAttribute("aria-describedby");
      }
    };
    strip();
    const observer = new MutationObserver(strip);
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["tabindex"],
    });
    return () => observer.disconnect();
  }, []);

  const tryMove = (from: string, to: string): boolean => {
    setSelection(null);
    const candidates = chess.moves({ square: from as Square, verbose: true }).filter((mv) => mv.to === to);
    const move = candidates.find((mv) => !mv.promotion || mv.promotion === "q"); // promotions: always a queen for now
    if (!move || !onMove) return false;
    return onMove(move.lan);
  };

  const ownPiece = (square: string) => {
    const piece = chess.get(square as Square);
    return piece?.color === chess.turn() ? piece : undefined;
  };

  const activate = (square: string) => {
    if (!interactive) return;
    if (selected && targets.some((mv) => mv.to === square)) {
      tryMove(selected, square);
      return;
    }
    const piece = ownPiece(square);
    if (!piece || square === selected) {
      setSelection(null);
      say(selected ? m.board_put_down() : m.board_pick_own());
      return;
    }
    setSelection({ fen, square });
    const moves = chess.moves({ square: square as Square, verbose: true }).map((mv) => mv.to);
    const name = pieceName(piece);
    say(
      moves.length
        ? m.board_selected({ piece: name, square, targets: lists.or.format([...new Set(moves)]) })
        : m.board_selected_stuck({ piece: name, square }),
    );
  };

  const marks = new Map<string, Mark[]>();
  const mark = (square: string, kind: Mark) => marks.set(square, [...(marks.get(square) ?? []), kind]);
  if (lastMove) for (const s of [lastMove.from, lastMove.to]) mark(s, "last");
  for (const s of marked ?? []) mark(s, "lesson");
  if (selected) mark(selected, "selected");
  // A promotion is four moves to the same square: mark it once.
  for (const to of new Set(targets.map((mv) => mv.to))) {
    mark(to, targets.some((mv) => mv.to === to && mv.captured) ? "capture" : "target");
  }
  const describe = (square: string) => {
    const piece = chess.get(square as Square);
    const facts = [square, piece ? pieceName(piece) : m.board_empty()];
    for (const kind of marks.get(square) ?? []) {
      const text = MARK_TEXT[kind];
      if (text) facts.push(text());
    }
    return lists.facts.format(facts);
  };

  const lastMoveText = lastMove
    ? (lastMove.color === "w" ? m.board_last_move_white : m.board_last_move_black)({
        move: spokenMove(lastMove),
      })
    : m.moves_empty();

  // The one cell in the tab order: where the player last was, else where the action is.
  const active = focused ?? selected ?? lastMove?.to ?? (orientation === "white" ? "a1" : "h8");

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented || e.altKey || e.metaKey) return;
    const square = e.target instanceof HTMLElement ? e.target.dataset.square : undefined;
    if (!square) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!e.repeat) activate(square);
      return;
    }
    if (e.key === "Escape" && selected) {
      e.preventDefault();
      setSelection(null);
      say(m.board_put_down());
      return;
    }
    const row = rows.findIndex((r) => r.includes(square));
    const col = rows[row]?.indexOf(square) ?? -1;
    const step = STEPS[e.key];
    let next: string | undefined;
    if (e.key === "Home") next = rows[e.ctrlKey ? 0 : row]?.[0];
    else if (e.key === "End") next = rows[e.ctrlKey ? 7 : row]?.[7];
    else if (step && !e.ctrlKey) next = rows[row + step[0]]?.[col + step[1]];
    // At the edge there's nowhere to go: leave the key to the browser (it may scroll).
    if (!next || next === square) return;
    e.preventDefault();
    setFocused(next);
    cells.current.get(next)?.focus();
  };

  return (
    <div className="board" data-board-id={id}>
      <div ref={visual} className="board-visual" aria-hidden="true">
        <Chessboard
          options={{
            id,
            position: fen,
            boardOrientation: orientation,
            allowDragging: interactive,
            allowDrawingArrows: false,
            showNotation,
            animationDurationInMs: 180,
            showAnimations: !matchMedia("(prefers-reduced-motion: reduce)").matches, // UX-26
            arrows: (arrows ?? []).map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color })),
            darkSquareStyle: { backgroundColor: "var(--sq-dark)" },
            lightSquareStyle: { backgroundColor: "var(--sq-light)" },
            boardStyle: { borderRadius: "6px", overflow: "hidden" },
            squareRenderer: ({ square, children }) => (
              <div className="sq">
                {(marks.get(square) ?? []).map((kind) => (
                  <span key={kind} className={`sq-mark sq-${kind}`} />
                ))}
                <div className="sq-piece">{children}</div>
              </div>
            ),
            canDragPiece: ({ square }) => interactive && !!square && !!ownPiece(square),
            onPieceDrop: ({ sourceSquare, targetSquare }) =>
              !!targetSquare && interactive && tryMove(sourceSquare, targetSquare),
            // Fires for clicks on pieces too (they bubble up to the square), so don't also
            // handle onPieceClick: that would select and immediately deselect.
            onSquareClick: ({ square }) => activate(square),
          }}
        />
      </div>
      <div
        className="board-grid"
        role="grid"
        aria-label={label}
        aria-describedby={describedBy}
        aria-readonly={interactive ? undefined : true}
        onKeyDown={onKeyDown}
      >
        {rows.map((row) => (
          <div key={row[0]} className="board-row" role="row">
            {row.map((square) => (
              <div
                key={square}
                ref={(el) => {
                  if (el) cells.current.set(square, el);
                  else cells.current.delete(square);
                }}
                className="board-cell"
                role="gridcell"
                data-square={square}
                tabIndex={square === active ? 0 : -1}
                aria-selected={square === selected ? true : undefined}
                onFocus={() => setFocused(square)}
              >
                <span className="sr-only">{describe(square)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p id={describedBy} className="sr-only" aria-live="polite">
        {lastMoveText}
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
