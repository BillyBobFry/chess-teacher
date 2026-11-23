import { gameOf, isUserTurn, uciParts, type Game } from "@chess-teacher/core";
import { useMemo, useState } from "react";
import { Board } from "./components/Board.tsx";
import { Licences } from "./components/Licences.tsx";
import { MoveList } from "./components/MoveList.tsx";
import { NewGame } from "./components/NewGame.tsx";
import { Reveal } from "./components/Reveal.tsx";
import { Review } from "./components/Review.tsx";
import { useGame, type Busy } from "./game/useGame.ts";

const BUSY_TEXT: Record<Exclude<Busy, null>, string> = {
  engine: "Starting the engine…",
  preparing: "Getting ready for your move…",
  checking: "Thinking about your move…",
  opponent: "Your opponent is thinking…",
};

function resultText(game: Game, userColour: "w" | "b"): string {
  const chess = game.chess;
  if (chess.isCheckmate())
    return chess.turn() === userColour ? "Checkmate. You lost this one." : "Checkmate. You won!";
  if (chess.isStalemate()) return "Stalemate: a draw.";
  if (game.isGameOver()) return "Draw.";
  return "Game ended.";
}

export function App() {
  const g = useGame();
  const [view, setView] = useState<"game" | "new" | "licences">(() => (g.game ? "game" : "new"));
  const saved = g.game;

  const board = useMemo(() => {
    if (!saved) return null;
    const game = gameOf(saved.state);
    let fen = game.fen;
    let last = saved.state.moves.at(-1);
    if (g.pendingMove) {
      game.push(g.pendingMove);
      fen = game.fen;
      last = g.pendingMove;
    }
    const lm = last ? uciParts(last) : null;
    return { fen, lastMove: lm ? ([lm.from, lm.to] as [string, string]) : null, game };
  }, [saved, g.pendingMove]);

  const header = (
    <header className="top">
      <button className="brand" onClick={() => setView(saved ? "game" : "new")}>
        <span aria-hidden>♞</span> Chess Teacher
      </button>
      <nav>
        {view === "game" && saved && !saved.finished && (
          <button onClick={() => g.endGame()} disabled={!!saved.reveal}>
            End game
          </button>
        )}
        {view === "game" && (
          <button
            onClick={() => {
              if (!saved || saved.finished || confirm("Abandon this game and start a new one?"))
                setView("new");
            }}
          >
            New game
          </button>
        )}
      </nav>
    </header>
  );

  const footer = (
    <footer className="bottom">
      <button className="link" onClick={() => setView("licences")}>
        Licences
      </button>
    </footer>
  );

  if (view === "licences") {
    return (
      <div className="app">
        {header}
        <main className="page">
          <Licences onBack={() => setView(saved ? "game" : "new")} />
        </main>
      </div>
    );
  }

  if (view === "new" || !saved || !board) {
    return (
      <div className="app">
        {header}
        <main className="page">
          <NewGame
            busy={g.busy === "engine"}
            onStart={async (opts) => {
              g.discard();
              await g.newGame(opts);
              setView("game");
            }}
          />
        </main>
        {footer}
      </div>
    );
  }

  const state = saved.state;
  const orientation = state.userColour === "w" ? "white" : "black";
  const revealLesson = saved.reveal ? state.lessons.find((l) => l.id === saved.reveal!.lessonId) : undefined;
  const canMove = !saved.finished && !saved.reveal && !g.busy && !g.pendingMove && isUserTurn(state);
  const status = saved.finished
    ? resultText(board.game, state.userColour)
    : saved.reveal
      ? "Game paused"
      : g.busy
        ? BUSY_TEXT[g.busy]
        : isUserTurn(state)
          ? "Your move"
          : "…";

  return (
    <div className="app">
      {header}
      <main className="game">
        <div className="board-col">
          <div className={`status ${canMove ? "your-move" : ""}`} role="status" aria-live="polite">
            {status}
          </div>
          <Board
            id="main"
            fen={board.fen}
            orientation={orientation}
            lastMove={board.lastMove}
            onMove={canMove ? g.move : undefined}
          />
          {g.error && (
            <div className="error" role="alert">
              Something went wrong: {g.error}{" "}
              <button className="link" onClick={g.dismissError}>
                Dismiss
              </button>
            </div>
          )}
        </div>
        <aside className="panel">
          {saved.finished ? (
            <Review
              state={state}
              result={resultText(board.game, state.userColour)}
              onNewGame={() => setView("new")}
            />
          ) : revealLesson && saved.reveal ? (
            <Reveal
              state={state}
              lesson={revealLesson}
              reveal={saved.reveal}
              hint={g.currentHint}
              onGuess={g.guess}
              onShowAnswer={g.showAnswer}
              onRewind={() => g.rewindTo(revealLesson.id)}
              onContinue={g.closeReveal}
            />
          ) : (
            <>
              <h2 className="panel-title">Moves</h2>
              <MoveList startFen={state.startFen} moves={state.moves} />
              <p className="muted small">
                Play normally. If a mistake comes back to bite you, the game will pause so you can find out
                why.
              </p>
            </>
          )}
        </aside>
      </main>
      <div className="toasts" aria-live="polite">
        {g.toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone}`}>
            {t.text}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}
