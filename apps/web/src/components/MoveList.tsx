import { Game } from "@chess-teacher/core";
import { useEffect, useMemo, useRef } from "react";
import { m } from "../paraglide/messages.js";
import type { Orientation } from "./Board.tsx";
import { MoveButton } from "./MoveButton.tsx";

/** The game's moves in pairs, scrolled to the latest. Each move previews its board. */
export function MoveList({
  startFen,
  moves,
  orientation,
}: {
  startFen: string;
  moves: string[];
  orientation: Orientation;
}) {
  const played = useMemo(() => {
    const game = new Game(startFen);
    return moves.map((uci) => game.push(uci));
  }, [startFen, moves]);
  const black = startFen.split(" ")[1] === "b";
  const rows: [number, number | null, number | null][] = [];
  const all: (number | null)[] = black ? [null, ...played.keys()] : [...played.keys()];
  for (let i = 0; i < all.length; i += 2) rows.push([i / 2 + 1, all[i] ?? null, all[i + 1] ?? null]);
  const end = useRef<HTMLDivElement>(null);
  // Braces matter: newer browsers return a Promise from scrollIntoView, and React would
  // try to call it as the effect's cleanup.
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [moves.length]);

  /** `empty` stands in for White's move when the game started with Black to move. */
  const cell = (i: number | null, empty: string) => {
    const move = i === null ? undefined : played[i];
    return (
      <span>
        {move ? (
          <MoveButton move={move} orientation={orientation}>
            {move.san}
          </MoveButton>
        ) : (
          empty
        )}
      </span>
    );
  };

  return (
    <div className="moves" aria-label={m.panel_moves()}>
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
