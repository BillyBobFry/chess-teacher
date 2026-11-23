import { Chess, type Square } from "chess.js";
import { useMemo, useState, type CSSProperties } from "react";
import { Chessboard } from "react-chessboard";

export interface BoardArrow {
  from: string;
  to: string;
  color: string;
}

interface Props {
  id: string;
  fen: string;
  orientation: "white" | "black";
  /** When set, the user can move pieces of the side to move (click or drag). */
  onMove?: (uci: string) => boolean;
  lastMove?: [string, string] | null;
  arrows?: BoardArrow[];
  /** Extra square highlights, e.g. the pieces a lesson is about. */
  marked?: string[];
  showNotation?: boolean;
}

const LAST_MOVE: CSSProperties = { background: "var(--sq-last)" };
const SELECTED: CSSProperties = { background: "var(--sq-selected)" };
const MARKED: CSSProperties = { boxShadow: "inset 0 0 0 4px var(--sq-marked)" };
const TARGET: CSSProperties = {
  background: "radial-gradient(circle, var(--sq-target) 22%, transparent 24%)",
};
const CAPTURE: CSSProperties = {
  background: "radial-gradient(circle, transparent 62%, var(--sq-target) 64%)",
};

export function Board({
  id,
  fen,
  orientation,
  onMove,
  lastMove,
  arrows,
  marked,
  showNotation = true,
}: Props) {
  const chess = useMemo(() => new Chess(fen), [fen]);
  const [selected, setSelected] = useState<string | null>(null);
  const interactive = !!onMove;

  const targets = useMemo(
    () => (selected ? chess.moves({ square: selected as Square, verbose: true }) : []),
    [chess, selected],
  );

  const tryMove = (from: string, to: string): boolean => {
    setSelected(null);
    const candidates = chess.moves({ square: from as Square, verbose: true }).filter((m) => m.to === to);
    if (!candidates.length || !onMove) return false;
    // Promotions: always a queen for now.
    const move = candidates.find((m) => !m.promotion || m.promotion === "q")!;
    return onMove(move.lan);
  };

  const ownPieceOn = (square: string) => chess.get(square as Square)?.color === chess.turn();

  const clickSquare = (square: string) => {
    if (!interactive) return;
    if (selected && targets.some((m) => m.to === square)) tryMove(selected, square);
    else setSelected(ownPieceOn(square) && square !== selected ? square : null);
  };

  const squareStyles: Record<string, CSSProperties> = {};
  if (lastMove) for (const s of lastMove) squareStyles[s] = LAST_MOVE;
  for (const s of marked ?? []) squareStyles[s] = { ...squareStyles[s], ...MARKED };
  if (selected) squareStyles[selected] = SELECTED;
  for (const m of targets) squareStyles[m.to] = { ...squareStyles[m.to], ...(m.captured ? CAPTURE : TARGET) };

  return (
    <div className="board" data-board-id={id}>
      <Chessboard
        options={{
          id,
          position: fen,
          boardOrientation: orientation,
          allowDragging: interactive,
          allowDrawingArrows: false,
          showNotation,
          animationDurationInMs: 180,
          squareStyles,
          arrows: (arrows ?? []).map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color })),
          darkSquareStyle: { backgroundColor: "var(--sq-dark)" },
          lightSquareStyle: { backgroundColor: "var(--sq-light)" },
          boardStyle: { borderRadius: "6px", overflow: "hidden" },
          canDragPiece: ({ square }) => interactive && !!square && ownPieceOn(square),
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            !!targetSquare && interactive && tryMove(sourceSquare, targetSquare),
          // Fires for clicks on pieces too (they bubble up to the square), so don't also
          // handle onPieceClick: that would select and immediately deselect.
          onSquareClick: ({ square }) => clickSquare(square),
        }}
      />
    </div>
  );
}
