import { OPPONENT_RATING, type ConfigResponse } from "@chess-teacher/contract";
import { gameOf, isUserTurn } from "@chess-teacher/core";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, authClient } from "./api/client.ts";
import { Board, orientationOf } from "./components/Board.tsx";
import { Games } from "./components/Games.tsx";
import { Licences } from "./components/Licences.tsx";
import { MoveList } from "./components/MoveList.tsx";
import { NewGame } from "./components/NewGame.tsx";
import { PastGame } from "./components/PastGame.tsx";
import { Progress } from "./components/Progress.tsx";
import { Reveal } from "./components/Reveal.tsx";
import { Alert } from "./ui/Alert.tsx";
import { Button } from "./ui/Button.tsx";
import { ConfirmDialog } from "./ui/Dialog.tsx";
import { Kbd } from "./ui/Kbd.tsx";
import { Link } from "./ui/Link.tsx";
import { Menu, MenuItem, MenuSection, MenuTrigger } from "./ui/Menu.tsx";
import { Toasts } from "./ui/Toast.tsx";
import { Review } from "./components/Review.tsx";
import { SignIn } from "./components/SignIn.tsx";
import { useGame, type Busy } from "./game/useGame.ts";
import { resultText } from "./lib/result.ts";
import { goBack, hrefOf, navigate, routeOf, usePathname, type Route } from "./lib/router.ts";
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

function Shell({ nav, children }: { nav?: ReactNode; children: ReactNode }) {
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
        <Link variant="link" href={hrefOf({ page: "licences" })}>
          {m.footer_licences()}
        </Link>
      </footer>
    </div>
  );
}

/** The game (or choosing a new one); every other page leads back to it. */
const PLAY: Route = { page: "play" };

/** A page's name for the browser tab and history list; the game page is the app itself. */
const PAGE_TITLE: Record<Route["page"], (() => string) | null> = {
  play: null,
  games: m.games_title,
  pastGame: m.review_title,
  progress: m.progress_title,
  licences: m.licences_title,
};

/**
 * After an in-app navigation, focus moves to the new page's heading (or the page itself), so
 * keyboard and screen reader users start there rather than on a control that has gone.
 */
function useFocusOnNavigate(pathname: string) {
  const shown = useRef(pathname);
  useEffect(() => {
    if (shown.current === pathname) return;
    shown.current = pathname;
    const target = document.querySelector<HTMLElement>("main h1") ?? document.querySelector("main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }, [pathname]);
}

/** Signed out → sign-in screen; signed in → the page the URL names. */
export function App() {
  const session = authClient.useSession();
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const pathname = usePathname();
  const known = routeOf(pathname);
  const isPage = known !== null;
  const route = known ?? PLAY;
  const signedIn = !!session.data;

  useEffect(() => {
    api
      .config()
      .then(setConfig)
      .catch(() => setConfig({ googleEnabled: false, llmEnabled: false }));
  }, []);

  // A path that isn't a page (a typo, an old link) shows the game, so say so in the address bar.
  useEffect(() => {
    if (!isPage) navigate(PLAY, { replace: true });
  }, [isPage]);

  useEffect(() => {
    const page = signedIn || route.page === "licences" ? PAGE_TITLE[route.page] : null;
    document.title = page ? m.document_title({ page: page() }) : m.app_name();
  }, [route.page, signedIn]);

  useFocusOnNavigate(pathname);

  if (route.page === "licences") {
    return (
      <Shell>
        <main className="page">
          <Licences onBack={() => goBack(PLAY)} />
        </main>
      </Shell>
    );
  }
  if (session.isPending || !config) {
    return (
      <Shell>
        <main className="page muted">{m.loading()}</main>
      </Shell>
    );
  }
  // Signed out on any page: signing in shows the page the URL names.
  if (!session.data) {
    return (
      <Shell>
        <main className="page">
          <SignIn googleEnabled={config.googleEnabled} />
        </main>
      </Shell>
    );
  }
  return (
    <GameApp
      key={session.data.user.id}
      route={route}
      userName={session.data.user.name}
      llmEnabled={config.llmEnabled}
    />
  );
}

function GameApp({
  route,
  userName,
  llmEnabled,
}: {
  route: Exclude<Route, { page: "licences" }>;
  userName: string;
  llmEnabled: boolean;
}) {
  const g = useGame({ llmEnabled });
  const [choosing, setChoosing] = useState(false);
  const [confirmingNewGame, setConfirmingNewGame] = useState(false);
  const [confirmingResign, setConfirmingResign] = useState(false);
  const saved = g.game;
  const inProgress = !!saved && !saved.finished;
  // Away from the game in progress (a page from the account menu, or choosing a new game),
  // the way back to it is always in the header.
  const awayFromGame = inProgress && (route.page !== "play" || choosing);
  const backToGame = () => {
    if (route.page !== "play") navigate(PLAY);
    setChoosing(false);
  };
  const chooseNewGame = () => {
    if (route.page !== "play") navigate(PLAY);
    setChoosing(true);
  };
  // Starting a new game resigns one in progress, so that asks first (UX-15).
  const requestNewGame = () => (saved && !saved.finished ? setConfirmingNewGame(true) : chooseNewGame());

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
      {awayFromGame ? (
        <Button onPress={backToGame}>{m.game_back_to_current()}</Button>
      ) : (
        inProgress && (
          <Button onPress={() => setConfirmingResign(true)} isDisabled={!!saved.reveal}>
            {m.nav_resign()}
          </Button>
        )
      )}
      {saved && !choosing && <Button onPress={requestNewGame}>{m.nav_new_game()}</Button>}
      {saved && board && (
        <ConfirmDialog
          open={confirmingResign}
          title={m.confirm_resign_title()}
          body={m.confirm_resign_body({ moveNumber: board.game.chess.moveNumber() })}
          confirmLabel={m.confirm_resign_confirm()}
          cancelLabel={m.confirm_resign_cancel()}
          onClose={(confirmed) => {
            setConfirmingResign(false);
            if (confirmed) g.resign();
          }}
        />
      )}
      {saved && board && (
        <ConfirmDialog
          open={confirmingNewGame}
          title={m.confirm_new_game_title()}
          body={m.confirm_new_game_body({ moveNumber: board.game.chess.moveNumber() })}
          confirmLabel={m.confirm_new_game_confirm()}
          cancelLabel={m.confirm_new_game_cancel()}
          onClose={(confirmed) => {
            setConfirmingNewGame(false);
            // Keep playing means play: from a past game or another page, that's back to the board.
            if (confirmed) chooseNewGame();
            else backToGame();
          }}
        />
      )}
      <MenuTrigger>
        <Button variant="primary" shape="circle" aria-label={m.account_menu()}>
          {userName.slice(0, 1).toUpperCase() || "?"}
        </Button>
        <Menu label={m.account_menu()}>
          <MenuSection
            header={
              <>
                <span className="block font-semibold">{userName}</span>
                {g.me?.explanations.enabled && (
                  <span className="block text-sm text-fg-muted">
                    {m.account_allowance({
                      remaining: g.me.explanations.remaining,
                      limit: g.me.explanations.limit,
                    })}
                  </span>
                )}
              </>
            }
          >
            <MenuItem href={hrefOf({ page: "games" })}>{m.account_games()}</MenuItem>
            <MenuItem href={hrefOf({ page: "progress" })}>{m.account_progress()}</MenuItem>
            {/* A full load of the app's home: nothing of this account's state stays behind. */}
            <MenuItem
              onAction={() => void authClient.signOut().then(() => window.location.assign(hrefOf(PLAY)))}
            >
              {m.account_sign_out()}
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuTrigger>
    </>
  );

  if (!g.loaded) {
    return (
      <Shell nav={nav}>
        <main className="page muted">{BUSY_TEXT.loading()}</main>
      </Shell>
    );
  }

  if (route.page === "progress") {
    return (
      <Shell nav={nav}>
        <main className="page">
          <Progress onBack={() => goBack(PLAY)} />
        </main>
      </Shell>
    );
  }

  if (route.page === "games") {
    return (
      <Shell nav={nav}>
        <main className="page">
          <Games
            onNewGame={requestNewGame}
            onBackToGame={inProgress ? backToGame : null}
            onBack={() => goBack(PLAY)}
          />
        </main>
      </Shell>
    );
  }

  if (route.page === "pastGame") {
    return (
      <Shell nav={nav}>
        <PastGame
          key={route.id}
          id={route.id}
          onNewGame={requestNewGame}
          onBackToGame={inProgress ? backToGame : null}
          onProgress={() => navigate({ page: "progress" })}
        />
      </Shell>
    );
  }

  if (choosing || !saved || !board) {
    return (
      <Shell nav={nav}>
        <main className="page">
          {g.error && <Alert className="mb-4">{g.error}</Alert>}
          <NewGame
            busy={g.busy === "engine"}
            initialRating={saved?.opponentRating ?? OPPONENT_RATING.default}
            onStart={async (opts) => {
              await g.newGame(opts);
              setChoosing(false);
            }}
          />
        </main>
      </Shell>
    );
  }

  const state = saved.state;
  const orientation = orientationOf(state.userColour);
  const revealLesson = saved.reveal ? state.lessons.find((l) => l.id === saved.reveal!.lessonId) : undefined;
  const canMove = !saved.finished && !saved.reveal && !g.busy && !g.pendingMove && isUserTurn(state);
  const status = saved.finished
    ? resultText(board.game, state)
    : saved.reveal
      ? m.status_paused()
      : g.busy
        ? BUSY_TEXT[g.busy]()
        : isUserTurn(state)
          ? m.status_your_move()
          : "…";

  return (
    <Shell nav={nav}>
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
            <Alert>
              {g.error}{" "}
              <Button variant="link" onPress={g.dismissError}>
                {m.dismiss()}
              </Button>
            </Alert>
          )}
        </div>
        <aside className="panel">
          {saved.finished ? (
            <Review
              gameId={saved.id}
              state={state}
              result={resultText(board.game, state)}
              onNewGame={() => setChoosing(true)}
              onBackToGame={null}
              onProgress={() => navigate({ page: "progress" })}
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
                  <Kbd aria-hidden>{APPLE ? m.shortcut_undo_apple() : m.shortcut_undo()}</Kbd>
                </Button>
                <Button
                  onPress={redo}
                  isDisabled={!g.canRedo}
                  aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
                >
                  {m.moves_redo()}{" "}
                  <Kbd aria-hidden>{APPLE ? m.shortcut_redo_apple() : m.shortcut_redo()}</Kbd>
                </Button>
              </div>
              <p className="muted small">{m.panel_play_hint()}</p>
              <p className="muted small">
                <ParaglideMessage
                  message={m.board_keyboard_hint}
                  inputs={{}}
                  markup={{ kbd: ({ children }) => <Kbd>{children}</Kbd> }}
                />
              </p>
            </>
          )}
        </aside>
      </main>
      <Toasts toasts={g.toasts} />
    </Shell>
  );
}
