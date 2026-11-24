import type { ConfigResponse } from "@chess-teacher/contract";
import { gameOf, isUserTurn, type Game } from "@chess-teacher/core";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, authClient } from "./api/client.ts";
import { Board, orientationOf } from "./components/Board.tsx";
import { ConfirmDialog } from "./components/ConfirmDialog.tsx";
import { Licences } from "./components/Licences.tsx";
import { MoveList } from "./components/MoveList.tsx";
import { NewGame } from "./components/NewGame.tsx";
import { Progress } from "./components/Progress.tsx";
import { Reveal } from "./components/Reveal.tsx";
import { Button } from "./ui/Button.tsx";
import { Review } from "./components/Review.tsx";
import { SignIn } from "./components/SignIn.tsx";
import { useGame, type Busy } from "./game/useGame.ts";
import { m } from "./paraglide/messages.js";

const BUSY_TEXT: Record<Exclude<Busy, null>, () => string> = {
  loading: m.busy_loading,
  engine: m.busy_engine,
  preparing: m.busy_preparing,
  checking: m.busy_checking,
  opponent: m.busy_opponent,
};

// Apple platforms use Cmd for shortcuts; everywhere else, Ctrl.
const APPLE = /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * Undo is Cmd/Ctrl+Z; redo is Cmd/Ctrl+Shift+Z or Ctrl+Y. Cmd+Y is left alone: on a Mac it's
 * the browser's History. Text fields and dialogs keep their own shortcuts.
 */
function stepKey(e: KeyboardEvent): "undo" | "redo" | null {
  if (e.defaultPrevented || e.altKey || !(e.metaKey || e.ctrlKey)) return null;
  const target = e.target;
  if (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select, dialog"))
  )
    return null;
  const key = e.key.toLowerCase();
  if (key === "z") return e.shiftKey ? "redo" : "undo";
  if (key === "y" && e.ctrlKey && !e.metaKey && !e.shiftKey) return "redo";
  return null;
}

function resultText(game: Game, userColour: "w" | "b"): string {
  const chess = game.chess;
  if (chess.isCheckmate()) return chess.turn() === userColour ? m.result_lost() : m.result_won();
  if (chess.isStalemate()) return m.result_stalemate();
  if (game.isGameOver()) return m.result_draw();
  return m.result_ended();
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
      {/* Wraps rather than scrolls: on a narrow phone the nav takes a second line (UX-40). */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-surface px-4 py-3 max-sm:px-3 max-sm:py-2">
        <a className="text-lg font-bold whitespace-nowrap text-fg no-underline" href="/app/">
          <span className="me-1 text-2xl" aria-hidden>
            ♞
          </span>{" "}
          {m.app_name()}
        </a>
        <nav className="ms-auto flex items-center gap-2">{nav}</nav>
      </header>
      {children}
      <footer className="bottom">
        <Button variant="link" onPress={onLicences}>
          {m.footer_licences()}
        </Button>
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
        <main className="page muted">{m.loading()}</main>
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
  const [confirmingAbandon, setConfirmingAbandon] = useState(false);
  const saved = g.game;

  const board = useMemo(() => {
    if (!saved) return null;
    const game = gameOf(saved.state);
    const lastMove = g.pendingMove
      ? game.push(g.pendingMove)
      : (game.chess.history({ verbose: true }).at(-1) ?? null);
    return { fen: game.fen, lastMove, game };
  }, [saved, g.pendingMove]);

  const { undo, redo } = g;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const step = stepKey(e);
      if (!step) return;
      e.preventDefault();
      if (step === "undo") undo();
      else redo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const revealId = saved?.reveal?.lessonId;
  const { explanation } = g;
  const loadExplanation = useCallback(
    (signal: AbortSignal) => (revealId === undefined ? Promise.resolve(null) : explanation(revealId, signal)),
    [explanation, revealId],
  );

  const nav = (
    <>
      {saved && !saved.finished && !choosing && (
        <Button onPress={() => g.endGame()} isDisabled={!!saved.reveal}>
          {m.nav_end_game()}
        </Button>
      )}
      {saved && !choosing && (
        <Button onPress={() => (saved.finished ? setChoosing(true) : setConfirmingAbandon(true))}>
          {m.nav_new_game()}
        </Button>
      )}
      {saved && board && (
        <ConfirmDialog
          open={confirmingAbandon}
          title={m.confirm_abandon_title()}
          body={m.confirm_abandon_body({ moveNumber: board.game.chess.moveNumber() })}
          confirmLabel={m.confirm_abandon_confirm()}
          cancelLabel={m.confirm_abandon_cancel()}
          onClose={(confirmed) => {
            setConfirmingAbandon(false);
            if (confirmed) setChoosing(true);
          }}
        />
      )}
      <details className="account">
        <summary aria-label={m.account_menu()}>{userName.slice(0, 1).toUpperCase() || "?"}</summary>
        <div className="account-menu">
          <div className="account-name">{userName}</div>
          {g.me?.explanations.enabled && (
            <div className="muted small">
              {m.account_allowance({
                remaining: g.me.explanations.remaining,
                limit: g.me.explanations.limit,
              })}
            </div>
          )}
          <Button
            onPress={(e) => {
              e.target.closest("details")?.removeAttribute("open");
              setShowProgress(true);
            }}
          >
            {m.account_progress()}
          </Button>
          <Button onPress={() => void authClient.signOut().then(() => window.location.reload())}>
            {m.account_sign_out()}
          </Button>
        </div>
      </details>
    </>
  );

  if (!g.loaded) {
    return (
      <Shell nav={nav} onLicences={onLicences}>
        <main className="page muted">{BUSY_TEXT.loading()}</main>
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
            <Button variant="link" className="mt-4" onPress={() => setChoosing(false)}>
              {m.game_back_to_current()}
            </Button>
          )}
        </main>
      </Shell>
    );
  }

  const state = saved.state;
  const orientation = orientationOf(state.userColour);
  const revealLesson = saved.reveal ? state.lessons.find((l) => l.id === saved.reveal!.lessonId) : undefined;
  const canMove = !saved.finished && !saved.reveal && !g.busy && !g.pendingMove && isUserTurn(state);
  const status = saved.finished
    ? resultText(board.game, state.userColour)
    : saved.reveal
      ? m.status_paused()
      : g.busy
        ? BUSY_TEXT[g.busy]()
        : isUserTurn(state)
          ? m.status_your_move()
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
            label={m.board_game()}
            fen={board.fen}
            orientation={orientation}
            lastMove={board.lastMove}
            onMove={canMove ? g.move : undefined}
          />
          {g.error && (
            <div className="error" role="alert">
              {g.error}{" "}
              <Button variant="link" onPress={g.dismissError}>
                {m.dismiss()}
              </Button>
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
              <h2 className="panel-title">{m.panel_moves()}</h2>
              <MoveList startFen={state.startFen} moves={state.moves} orientation={orientation} />
              <div className="move-actions">
                <Button onPress={undo} isDisabled={!g.canUndo} aria-keyshortcuts="Control+Z Meta+Z">
                  {m.moves_undo()}{" "}
                  <kbd aria-hidden="true">{APPLE ? m.shortcut_undo_apple() : m.shortcut_undo()}</kbd>
                </Button>
                <Button
                  onPress={redo}
                  isDisabled={!g.canRedo}
                  aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
                >
                  {m.moves_redo()}{" "}
                  <kbd aria-hidden="true">{APPLE ? m.shortcut_redo_apple() : m.shortcut_redo()}</kbd>
                </Button>
              </div>
              <p className="muted small">{m.panel_play_hint()}</p>
              <p className="muted small">
                <ParaglideMessage
                  message={m.board_keyboard_hint}
                  inputs={{}}
                  markup={{ kbd: ({ children }) => <kbd>{children}</kbd> }}
                />
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
