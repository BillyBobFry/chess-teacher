/**
 * The game loop: drives the core's session state machine with the browser engines, turns
 * events into UI state (reveals, toasts), saves to the server after every step, and asks
 * for a lesson's AI explanation as soon as it is revealed, once the moves since are saved.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExplanationResponse, MeResponse } from "@chess-teacher/contract";
import {
  finish,
  gameOf,
  hints,
  isGameOver,
  isLegal,
  isUserTurn,
  lessonMove,
  newSession,
  opponentMove,
  recordFoundCause,
  resign as resignGame,
  rewind,
  startUserTurn,
  takeBack,
  canTakeBack,
  userMove,
  userMovesAgo,
  type Colour,
  type GameEvent,
  type SessionState,
} from "@chess-teacher/core";
import { hintText, moveText } from "@chess-teacher/lesson-text";
import { api } from "../api/client.ts";
import { errorText } from "../api/errors.ts";
import { getEngines, startEngines } from "../engine/engines.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import type { ToastMessage } from "../ui/Toast.tsx";
import { ConflictError, Saver, createGame, loadActiveGame, type SavedGame } from "./storage.ts";

export type Busy = null | "loading" | "engine" | "preparing" | "checking" | "opponent";

export interface NewGameOptions {
  colour: Colour | "random";
  opponentRating: number;
  easy: boolean;
}

let toastId = 0;

/** Undo and redo wait while a lesson is open, after the game, and while a move is checked. */
const canStep = (g: SavedGame | null, checking: boolean): g is SavedGame =>
  !!g && !g.reveal && !g.finished && !checking;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useGame(opts: { llmEnabled: boolean }) {
  const [game, setGame] = useState<SavedGame | null>(null);
  const gameRef = useRef<SavedGame | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<Busy>("loading");
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const running = useRef(false);
  const enginesReady = useRef(false);
  const saver = useRef<Saver | null>(null);
  /** Lessons just revealed: ask for their explanation once the game is saved. */
  const wantExplanation = useRef(new Set<number>());
  const explanations = useRef(new Map<string, Promise<ExplanationResponse>>());
  const llmEnabled = opts.llmEnabled;
  /** The user's move is being checked: too late to undo the move before it. */
  const checking = useRef(false);
  /** States undo replaced, latest last: redo goes back to them. Not saved. */
  const [redoStates, setRedoStatesState] = useState<SessionState[]>([]);
  const redoRef = useRef<SessionState[]>([]);
  const setRedoStates = useCallback((states: SessionState[]) => {
    redoRef.current = states;
    setRedoStatesState(states);
  }, []);

  const refreshMe = useCallback(() => {
    api
      .me()
      .then(setMe)
      .catch(() => {});
  }, []);

  const requestExplanation = useCallback(
    (gameId: string, lessonId: number) => {
      const key = `${gameId}/${lessonId}`;
      if (!explanations.current.has(key)) {
        const p = api
          // Written in the player's language (UX-41).
          .requestExplanation(gameId, lessonId, { locale: getLocale() })
          .catch((): ExplanationResponse => ({ status: "error", coachedGamesRemaining: 0 }));
        explanations.current.set(key, p);
        void p.then(refreshMe);
      }
      return explanations.current.get(key)!;
    },
    [refreshMe],
  );

  const onSaved = useCallback(
    (saved: SavedGame) => {
      if (gameRef.current?.id === saved.id) {
        gameRef.current = { ...gameRef.current, stateVersion: saved.stateVersion };
      }
      if (!llmEnabled) return;
      for (const lessonId of [...wantExplanation.current]) {
        const lesson = saved.state.lessons.find((l) => l.id === lessonId);
        if (!lesson) continue;
        wantExplanation.current.delete(lessonId);
        // Its move was undone, so it will never be shown: don't spend the player's allowance.
        if (lesson.status !== "rewound") void requestExplanation(saved.id, lessonId);
      }
    },
    [llmEnabled, requestExplanation],
  );

  const attachSaver = useCallback(
    (g: SavedGame) => {
      saver.current = new Saver(g.stateVersion, onSaved, (err) => {
        setError(err instanceof ConflictError ? err.message : errorText(err));
        if (err instanceof ConflictError) {
          // Another device moved on: load the latest version instead of overwriting it.
          void loadActiveGame().then((latest) => {
            setRedoStates([]);
            gameRef.current = latest;
            setGame(latest);
            if (latest) attachSaver(latest);
          });
        }
      });
    },
    [onSaved, setRedoStates],
  );

  const commit = useCallback((next: SavedGame) => {
    gameRef.current = next;
    setGame(next);
    saver.current?.save(next);
  }, []);

  const toast = useCallback((text: string, tone: ToastMessage["tone"] = "info") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }, []);

  const engines = useCallback(async (opponentRating: number) => {
    if (!enginesReady.current) setBusy("engine");
    const result = await getEngines(opponentRating);
    enginesReady.current = true;
    return result;
  }, []);

  /** Apply events to the saved game: open a reveal, show toasts, queue explanations. */
  const handle = useCallback(
    (g: SavedGame, events: GameEvent[]): SavedGame => {
      let reveal = g.reveal;
      for (const e of events) {
        const lesson = g.state.lessons.find((l) => l.id === e.lessonId);
        if (!lesson) continue;
        if ((e.kind === "triggered" || e.kind === "chanceGone") && !lesson.deferred && !reveal) {
          // Asking "which move caused it?" is pointless when it was the player's last move.
          const obvious = userMovesAgo(g.state, lesson) === 1;
          reveal = { lessonId: e.lessonId, step: obvious ? "explain" : "find", attempts: 0, wrong: [] };
          // Written now, not when the lesson was created, so it can say what really happened;
          // usually ready by the time the player has found the cause.
          wantExplanation.current.add(lesson.id);
        } else if (e.kind === "fixed") {
          toast(
            lesson.kind === "consequence"
              ? m.toast_fixed({ move: moveText(lessonMove(lesson), getLocale()) })
              : m.toast_found_chance({ move: moveText(lessonMove(lesson), getLocale()) }),
            "success",
          );
        } else if (e.kind === "warning") {
          toast(m.toast_opponent_spotted());
        }
      }
      // The redo moves would replay past a lesson the player has now been shown.
      if (reveal && !g.reveal) setRedoStates([]);
      return { ...g, reveal };
    },
    [setRedoStates, toast],
  );

  /** Run the game forward until it needs the user (their move, or a reveal). */
  const advance = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      for (;;) {
        const g = gameRef.current;
        if (!g || g.finished || g.reveal) break;
        if (isGameOver(g.state)) {
          commit({ ...g, state: finish(g.state), finished: true });
          break;
        }
        const { engines: e } = await engines(g.opponentRating);
        if (isUserTurn(g.state)) {
          if (g.state.analysis?.fen === gameOf(g.state).fen) break; // ready for the user's move
          setBusy("preparing");
          const r = await startUserTurn(g.state, e);
          if (gameRef.current?.id !== g.id || gameRef.current.state !== g.state) continue;
          commit(handle({ ...gameRef.current, state: r.state }, r.events));
        } else {
          setBusy("opponent");
          const r = await opponentMove(g.state, e);
          if (gameRef.current?.id !== g.id || gameRef.current.state !== g.state) continue;
          commit(handle({ ...gameRef.current, state: r.state }, r.events));
        }
      }
    } catch (err) {
      setError(errorText(err));
    } finally {
      running.current = false;
      setBusy(null);
    }
  }, [commit, engines, handle]);

  // Load the user's game in progress, if any, while the engines start.
  useEffect(() => {
    let cancelled = false;
    startEngines();
    refreshMe();
    loadActiveGame()
      .then((g) => {
        if (cancelled) return;
        gameRef.current = g;
        setGame(g);
        if (g) attachSaver(g);
        setLoaded(true);
        setBusy(null);
        void advance();
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorText(err));
        setLoaded(true);
        setBusy(null);
      });
    return () => {
      cancelled = true;
    };
  }, [advance, attachSaver, refreshMe]);

  /** The user plays a move (UCI). Returns false if it can't be played now. */
  const move = useCallback(
    (uci: string): boolean => {
      const g = gameRef.current;
      if (!g || running.current || g.reveal || g.finished || !isUserTurn(g.state)) return false;
      if (!isLegal(gameOf(g.state).chess, uci)) return false;
      running.current = true;
      checking.current = true;
      setRedoStates([]);
      setPendingMove(uci);
      setBusy("checking");
      void (async () => {
        try {
          const { engines: e } = await engines(g.opponentRating);
          const r = await userMove(g.state, uci, e);
          if (gameRef.current?.id === g.id && gameRef.current.state === g.state) {
            commit(handle({ ...gameRef.current, state: r.state }, r.events));
          }
        } catch (err) {
          setError(errorText(err));
        } finally {
          running.current = false;
          checking.current = false;
          setPendingMove(null);
          setBusy(null);
          void advance();
        }
      })();
      return true;
    },
    [advance, commit, engines, handle, setRedoStates],
  );

  const newGame = useCallback(
    async (o: NewGameOptions) => {
      const colour = o.colour === "random" ? (Math.random() < 0.5 ? "w" : "b") : o.colour;
      // Starting a new game resigns an unfinished one, so it shows up as done.
      const old = gameRef.current;
      if (old && !old.finished) {
        commit({ ...old, state: resignGame(old.state), reveal: null, finished: true });
        await saver.current?.flush();
      }
      const { depth } = await engines(o.opponentRating);
      setBusy(null);
      const created = await createGame({
        state: newSession({ userColour: colour, config: { analysisDepth: depth, easy: o.easy } }),
        opponentRating: o.opponentRating,
        reveal: null,
        finished: false,
      });
      wantExplanation.current.clear();
      setRedoStates([]);
      gameRef.current = created;
      setGame(created);
      attachSaver(created);
      void advance();
    },
    [advance, attachSaver, commit, engines, setRedoStates],
  );

  // ---- the reveal: find the cause, then the explanation

  const guess = useCallback(
    (ply: number) => {
      const g = gameRef.current;
      if (!g?.reveal || g.reveal.step !== "find") return;
      const lesson = g.state.lessons.find((l) => l.id === g.reveal!.lessonId)!;
      if (ply === lesson.ply) {
        commit({
          ...g,
          state: recordFoundCause(g.state, lesson.id, true),
          reveal: { ...g.reveal, step: "explain" },
        });
        return;
      }
      const attempts = g.reveal.attempts + 1;
      const reveal = { ...g.reveal, attempts, wrong: [...g.reveal.wrong, ply] };
      if (attempts >= 3) {
        commit({
          ...g,
          state: recordFoundCause(g.state, lesson.id, false),
          reveal: { ...reveal, step: "explain" },
        });
      } else {
        commit({ ...g, reveal });
      }
    },
    [commit],
  );

  const showAnswer = useCallback(() => {
    const g = gameRef.current;
    if (!g?.reveal) return;
    commit({
      ...g,
      state: recordFoundCause(g.state, g.reveal.lessonId, false),
      reveal: { ...g.reveal, step: "explain" },
    });
  }, [commit]);

  const closeReveal = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    commit({ ...g, reveal: null });
    void advance();
  }, [advance, commit]);

  const rewindTo = useCallback(
    (lessonId: number) => {
      const g = gameRef.current;
      if (!g) return;
      setRedoStates([]);
      commit({ ...g, state: rewind(g.state, lessonId), reveal: null, finished: false });
      void advance();
    },
    [advance, commit, setRedoStates],
  );

  // ---- undo and redo: take back the user's latest move (and the reply), or play them again

  const undo = useCallback(() => {
    const g = gameRef.current;
    if (!canStep(g, checking.current)) return;
    const back = takeBack(g.state);
    if (!back) return;
    setRedoStates([...redoRef.current, g.state]);
    // Anything the engine is working on for the old position is dropped when it returns.
    commit({ ...g, state: back });
    void advance();
  }, [advance, commit, setRedoStates]);

  const redo = useCallback(() => {
    const g = gameRef.current;
    const next = redoRef.current.at(-1);
    if (!canStep(g, checking.current) || !next) return;
    setRedoStates(redoRef.current.slice(0, -1));
    commit({ ...g, state: next });
    void advance();
  }, [advance, commit, setRedoStates]);

  const resign = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.finished) return;
    commit({ ...g, state: resignGame(g.state), reveal: null, finished: true });
  }, [commit]);

  /**
   * The AI explanation for a lesson: the request made when it was revealed, or a new one
   * (which returns the stored explanation if there is one). Polls while it's pending.
   */
  const explanation = useCallback(
    async (lessonId: number, signal: AbortSignal): Promise<ExplanationResponse | null> => {
      const g = gameRef.current;
      if (!g || !llmEnabled) return null;
      await saver.current?.flush();
      let r = await requestExplanation(g.id, lessonId);
      for (let i = 0; r.status === "pending" && i < 15 && !signal.aborted; i++) {
        await sleep(1500);
        r = await api
          .explanation(g.id, lessonId)
          .catch((): ExplanationResponse => ({ status: "error", coachedGamesRemaining: 0 }));
      }
      return signal.aborted ? null : r;
    },
    [llmEnabled, requestExplanation],
  );

  const currentHint = (() => {
    const g = game;
    if (!g?.reveal || g.reveal.attempts === 0) return null;
    const lesson = g.state.lessons.find((l) => l.id === g.reveal!.lessonId);
    const hint = lesson ? hints(lesson)[g.reveal.attempts - 1] : undefined;
    return hint ? hintText(hint, getLocale()) : null;
  })();

  return {
    game,
    loaded,
    busy,
    pendingMove,
    toasts,
    error,
    me,
    currentHint,
    move,
    newGame,
    guess,
    showAnswer,
    closeReveal,
    rewindTo,
    undo,
    redo,
    canUndo: canStep(game, !!pendingMove) && canTakeBack(game.state),
    canRedo: canStep(game, !!pendingMove) && redoStates.length > 0,
    resign,
    explanation,
    dismissError: () => setError(null),
  };
}

export type GameApi = ReturnType<typeof useGame>;
