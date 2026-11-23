import type { ConfigResponse } from "@chess-teacher/contract";
import { gameOf, isUserTurn, spottedLesson, uciParts, type Game } from "@chess-teacher/core";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, authClient } from "./api/client.ts";
import { Board } from "./components/Board.tsx";
import { Licences } from "./components/Licences.tsx";
import { MoveList } from "./components/MoveList.tsx";
import { NewGame } from "./components/NewGame.tsx";
import { Progress } from "./components/Progress.tsx";
import { Reveal } from "./components/Reveal.tsx";
import { Review } from "./components/Review.tsx";
import { SignIn } from "./components/SignIn.tsx";
import { Spotted } from "./components/Spotted.tsx";
import { useGame, type Busy } from "./game/useGame.ts";

const BUSY_TEXT: Record<Exclude<Busy, null>, string> = {
  loading: "Loading your game…",
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

function Shell({
  nav,
  children,
  onLicences,
}: {
  nav?: ReactNode;
  children: ReactNode;
  onLicences: () => void;
}) {
  return (
    <div className="app">
      <header className="top">
        <a className="brand" href="/app/">
          <span aria-hidden>♞</span> Chess Teacher
        </a>
        <nav>{nav}</nav>
      </header>
      {children}
      <footer className="bottom">
        <button className="link" onClick={onLicences}>
          Licences
        </button>
      </footer>
    </div>
  );
}

/** Signed out → sign-in screen; signed in → the game. */
export function App() {
  const session = authClient.useSession();
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [licences, setLicences] = useState(false);

  useEffect(() => {
    api
      .config()
      .then(setConfig)
      .catch(() => setConfig({ googleEnabled: false, llmEnabled: false }));
  }, []);

  if (licences) {
    return (
      <Shell onLicences={() => setLicences(true)}>
        <main className="page">
          <Licences onBack={() => setLicences(false)} />
        </main>
      </Shell>
    );
  }
  if (session.isPending || !config) {
    return (
      <Shell onLicences={() => setLicences(true)}>
        <main className="page muted">Loading…</main>
      </Shell>
    );
  }
  if (!session.data) {
    return (
      <Shell onLicences={() => setLicences(true)}>
        <main className="page">
          <SignIn googleEnabled={config.googleEnabled} />
        </main>
      </Shell>
    );
  }
  return (
    <GameApp
      key={session.data.user.id}
      userName={session.data.user.name}
      llmEnabled={config.llmEnabled}
      onLicences={() => setLicences(true)}
    />
  );
}

function GameApp({
  userName,
  llmEnabled,
  onLicences,
}: {
  userName: string;
  llmEnabled: boolean;
  onLicences: () => void;
}) {
  const g = useGame({ llmEnabled });
  const [choosing, setChoosing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
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

  const revealId = saved?.reveal?.lessonId;
  const { explanation } = g;
  const loadExplanation = useCallback(
    (signal: AbortSignal) => (revealId === undefined ? Promise.resolve(null) : explanation(revealId, signal)),
    [explanation, revealId],
  );
  const spotted = saved && !saved.finished && !saved.reveal ? spottedLesson(saved.state) : null;
  const spottedId = spotted?.id;
  const loadSpottedExplanation = useCallback(
    (signal: AbortSignal) =>
      spottedId === undefined ? Promise.resolve(null) : explanation(spottedId, signal),
    [explanation, spottedId],
  );

  const nav = (
    <>
      {saved && !saved.finished && !choosing && (
        <button onClick={() => g.endGame()} disabled={!!saved.reveal}>
          End game
        </button>
      )}
      {saved && !choosing && (
        <button
          onClick={() => {
            if (saved.finished || confirm("Abandon this game and start a new one?")) setChoosing(true);
          }}
        >
          New game
        </button>
      )}
      <details className="account">
        <summary aria-label="Account">{userName.slice(0, 1).toUpperCase() || "?"}</summary>
        <div className="account-menu">
          <div className="account-name">{userName}</div>
          {g.me?.explanations.enabled && (
            <div className="muted small">
              {g.me.explanations.remaining} of {g.me.explanations.limit} AI explanations left this month
            </div>
          )}
          <button
            onClick={(e) => {
              e.currentTarget.closest("details")?.removeAttribute("open");
              setShowProgress(true);
            }}
          >
            Your progress
          </button>
          <button onClick={() => void authClient.signOut().then(() => window.location.reload())}>
            Sign out
          </button>
        </div>
      </details>
    </>
  );

  if (!g.loaded) {
    return (
      <Shell nav={nav} onLicences={onLicences}>
        <main className="page muted">{BUSY_TEXT.loading}</main>
      </Shell>
    );
  }

  if (showProgress) {
    return (
      <Shell nav={nav} onLicences={onLicences}>
        <main className="page">
          <Progress onBack={() => setShowProgress(false)} />
        </main>
      </Shell>
    );
  }

  if (choosing || !saved || !board) {
    return (
      <Shell nav={nav} onLicences={onLicences}>
        <main className="page">
          {g.error && <div className="error">{g.error}</div>}
          <NewGame
            busy={g.busy === "engine"}
            onStart={async (opts) => {
              await g.newGame(opts);
              setChoosing(false);
            }}
          />
          {saved && choosing && (
            <button className="link back" onClick={() => setChoosing(false)}>
              Back to the current game
            </button>
          )}
        </main>
      </Shell>
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
    <Shell nav={nav} onLicences={onLicences}>
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
              {g.error}{" "}
              <button className="link" onClick={g.dismissError}>
                Dismiss
              </button>
            </div>
          )}
        </div>
        <aside className="panel">
          {saved.finished ? (
            <Review
              gameId={saved.id}
              state={state}
              result={resultText(board.game, state.userColour)}
              onNewGame={() => setChoosing(true)}
              onProgress={() => setShowProgress(true)}
            />
          ) : revealLesson && saved.reveal ? (
            <Reveal
              gameId={saved.id}
              state={state}
              lesson={revealLesson}
              reveal={saved.reveal}
              hint={g.currentHint}
              loadExplanation={loadExplanation}
              onGuess={g.guess}
              onShowAnswer={g.showAnswer}
              onRewind={() => g.rewindTo(revealLesson.id)}
              onContinue={g.closeReveal}
            />
          ) : (
            <>
              {spotted && (
                <Spotted
                  key={spotted.id}
                  lesson={spotted}
                  canPeek={!g.busy && !g.pendingMove}
                  loadExplanation={loadSpottedExplanation}
                  onPeek={() => g.peek(spotted.id)}
                />
              )}
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
    </Shell>
  );
}
