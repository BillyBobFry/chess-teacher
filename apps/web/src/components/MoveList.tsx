import { Game, sanOf } from "@chess-teacher/core";
import { useEffect, useMemo, useRef } from "react";

/** The game's moves in pairs, scrolled to the latest. */
export function MoveList({ startFen, moves }: { startFen: string; moves: string[] }) {
  const sans = useMemo(() => {
    const game = new Game(startFen);
    return moves.map((m) => {
      const san = sanOf(game.fen, m);
      game.push(m);
      return san;
    });
  }, [startFen, moves]);
  const black = startFen.split(" ")[1] === "b";
  const rows: [number, string | null, string | null][] = [];
  const all: (string | null)[] = black ? [null, ...sans] : sans;
  for (let i = 0; i < all.length; i += 2) rows.push([i / 2 + 1, all[i] ?? null, all[i + 1] ?? null]);
  const end = useRef<HTMLDivElement>(null);
  // Braces matter: newer browsers return a Promise from scrollIntoView, and React would
  // try to call it as the effect's cleanup.
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [moves.length]);

  return (
    <div className="moves" aria-label="Moves">
      {rows.length === 0 && <p className="muted">No moves yet.</p>}
      <ol>
        {rows.map(([n, w, b]) => (
          <li key={n}>
            <span className="n">{n}.</span>
            <span>{w ?? "…"}</span>
            <span>{b ?? ""}</span>
          </li>
        ))}
      </ol>
      <div ref={end} />
    </div>
  );
}
