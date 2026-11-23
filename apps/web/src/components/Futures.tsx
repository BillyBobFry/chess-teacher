import { Game, sanOf, uciParts, type Lesson } from "@chess-teacher/core";
import { useMemo, useState } from "react";
import { Board } from "./Board.tsx";
import { m } from "../paraglide/messages.js";

interface Line {
  fens: string[];
  sans: string[];
}

function walk(fenBefore: string, line: string[]): Line {
  const game = new Game(fenBefore);
  const fens = [game.fen];
  const sans: string[] = [];
  for (const m of line) {
    sans.push(sanOf(game.fen, m));
    game.push(m);
    fens.push(game.fen);
  }
  return { fens, sans };
}

/**
 * What actually happened after the mistake, beside how the better move could have gone,
 * stepped through together. `played` is the real moves from the game, starting with the
 * mistake; without it (e.g. nothing played yet) the engine's prediction is shown instead.
 */
export function Futures({ lesson, played }: { lesson: Lesson; played?: string[] }) {
  const real = !!played && played.length > 0;
  const yourMoves = real ? played! : lesson.userLine;
  const mine = useMemo(() => walk(lesson.fenBefore, yourMoves), [lesson, yourMoves]);
  const better = useMemo(() => walk(lesson.fenBefore, lesson.bestLine), [lesson]);
  const plies = Math.max(yourMoves.length, lesson.bestLine.length);
  const [step, setStep] = useState(0);
  const orientation = lesson.userColour === "w" ? "white" : "black";

  const view = (line: Line, moves: string[], colour: string) => {
    const i = Math.min(step, moves.length);
    const last = i > 0 ? uciParts(moves[i - 1]!) : null;
    const first = uciParts(moves[0]!);
    return {
      fen: line.fens[i]!,
      lastMove: last ? ([last.from, last.to] as [string, string]) : null,
      arrows: i === 0 ? [{ from: first.from, to: first.to, color: colour }] : [],
    };
  };
  const a = view(mine, yourMoves, "#c2552b");
  const b = view(better, lesson.bestLine, "#2f8f5f");

  const sanLine = (sans: string[]) => (
    <ol className="line">
      {sans.map((s, i) => (
        <li key={i} className={i < step ? "played" : i === step ? "next" : ""}>
          {s}
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
            fen={a.fen}
            orientation={orientation}
            lastMove={a.lastMove}
            arrows={a.arrows}
            showNotation={false}
          />
          {sanLine(mine.sans)}
        </figure>
        <figure>
          <figcaption>{m.futures_better()}</figcaption>
          <Board
            id={`better-${lesson.id}`}
            fen={b.fen}
            orientation={orientation}
            lastMove={b.lastMove}
            arrows={b.arrows}
            showNotation={false}
          />
          {sanLine(better.sans)}
        </figure>
      </div>
      <div className="stepper" role="group" aria-label={m.futures_stepper()}>
        <button onClick={() => setStep(0)} disabled={step === 0} aria-label={m.futures_start()}>
          ⏮
        </button>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label={m.futures_back()}
        >
          ◀
        </button>
        <span className="step-label">
          {step === 0 ? m.futures_before() : m.futures_step({ step, total: plies })}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(plies, s + 1))}
          disabled={step === plies}
          aria-label={m.futures_forward()}
        >
          ▶
        </button>
        <button onClick={() => setStep(plies)} disabled={step === plies} aria-label={m.futures_end()}>
          ⏭
        </button>
      </div>
    </div>
  );
}
