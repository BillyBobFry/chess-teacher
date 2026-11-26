import type { Lesson } from "@chess-teacher/core";
import type { Move } from "chess.js";
import { useMemo, useState } from "react";
import { lineMoves } from "../lib/moves.ts";
import { ARROW, Board, orientationOf } from "./Board.tsx";
import { MoveButton } from "./MoveButton.tsx";
import { m } from "../paraglide/messages.js";
import { Stepper } from "./Stepper.tsx";

/**
 * What actually happened after the mistake, beside how the better move could have gone,
 * stepped through together. `played` is the real moves from the game, starting with the
 * mistake; without it (e.g. nothing played yet) the engine's prediction is shown instead.
 */
export function Futures({ lesson, played }: { lesson: Lesson; played?: string[] }) {
  const real = !!played?.length;
  const yourMoves = played?.length ? played : lesson.userLine;
  const mine = useMemo(() => lineMoves(lesson.fenBefore, yourMoves), [lesson, yourMoves]);
  const better = useMemo(() => lineMoves(lesson.fenBefore, lesson.bestLine), [lesson]);
  const plies = Math.max(yourMoves.length, lesson.bestLine.length);
  const [step, setStep] = useState(0);
  const orientation = orientationOf(lesson.userColour);

  const view = (line: Move[], colour: string) => {
    const i = Math.min(step, line.length);
    const last = i > 0 ? line[i - 1] : undefined;
    const first = line[0];
    return {
      fen: last?.after ?? lesson.fenBefore,
      lastMove: last ?? null,
      arrows: i === 0 && first ? [{ from: first.from, to: first.to, color: colour }] : [],
    };
  };
  const a = view(mine, ARROW.yours);
  const b = view(better, ARROW.better);

  const sanLine = (moves: Move[]) => (
    <ol className="line">
      {moves.map((mv, i) => (
        <li key={i} className={i < step ? "played" : i === step ? "next" : ""}>
          <MoveButton move={mv} orientation={orientation}>
            {mv.san}
          </MoveButton>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="futures">
      <p className="futures-note muted small">{real ? m.futures_note_real() : m.futures_note_predicted()}</p>
      <div className="futures-boards">
        <figure>
          <figcaption>{real ? m.futures_what_happened() : m.futures_your_move()}</figcaption>
          <Board
            id={`yours-${lesson.id}`}
            label={real ? m.futures_what_happened() : m.futures_your_move()}
            fen={a.fen}
            orientation={orientation}
            focusable={false}
            lastMove={a.lastMove}
            arrows={a.arrows}
            showNotation={false}
          />
          {sanLine(mine)}
        </figure>
        <figure>
          <figcaption>{m.futures_better()}</figcaption>
          <Board
            id={`better-${lesson.id}`}
            label={m.futures_better()}
            fen={b.fen}
            orientation={orientation}
            focusable={false}
            lastMove={b.lastMove}
            arrows={b.arrows}
            showNotation={false}
          />
          {sanLine(better)}
        </figure>
      </div>
      <div className="my-3">
        <Stepper
          label={m.futures_stepper()}
          step={step}
          total={plies}
          position={step === 0 ? m.futures_before() : m.futures_step({ step, total: plies })}
          onStep={setStep}
          shortcuts={false}
        />
      </div>
    </div>
  );
}
