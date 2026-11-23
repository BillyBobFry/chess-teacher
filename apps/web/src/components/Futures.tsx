import { Game, sanOf, uciParts, type Lesson } from "@chess-teacher/core";
import { useMemo, useState } from "react";
import { Board } from "./Board.tsx";

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

/** "What you played" and "What was better", side by side, stepped through together. */
export function Futures({ lesson }: { lesson: Lesson }) {
  const mine = useMemo(() => walk(lesson.fenBefore, lesson.userLine), [lesson]);
  const better = useMemo(() => walk(lesson.fenBefore, lesson.bestLine), [lesson]);
  const plies = Math.max(lesson.userLine.length, lesson.bestLine.length);
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
  const a = view(mine, lesson.userLine, "#c2552b");
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
      <div className="futures-boards">
        <figure>
          <figcaption>What you played</figcaption>
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
          <figcaption>What was better</figcaption>
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
      <div className="stepper" role="group" aria-label="Step through both lines">
        <button onClick={() => setStep(0)} disabled={step === 0} aria-label="Start">
          ⏮
        </button>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} aria-label="Back">
          ◀
        </button>
        <span className="step-label">{step === 0 ? "Before the move" : `Move ${step} of ${plies}`}</span>
        <button
          onClick={() => setStep((s) => Math.min(plies, s + 1))}
          disabled={step === plies}
          aria-label="Forward"
        >
          ▶
        </button>
        <button onClick={() => setStep(plies)} disabled={step === plies} aria-label="End">
          ⏭
        </button>
      </div>
    </div>
  );
}
