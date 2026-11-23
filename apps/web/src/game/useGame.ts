/**
 * The game loop: drives the core's session state machine with the browser engines, turns
 * events into UI state (reveals, toasts), saves to the server after every step, and asks
 * for AI explanations as soon as a lesson is created (several moves before its reveal).
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
  lessonLabel,
  newSession,
  opponentMove,
  recordFoundCause,
  rewind,
  startUserTurn,
  userMove,
  userMovesAgo,
  type Colour,
  type GameEvent,
} from "@chess-teacher/core";
import { api } from "../api/client.ts";
import { getEngines } from "../engine/engines.ts";
import { ConflictError, Saver, createGame, loadActiveGame, type SavedGame } from "./storage.ts";

export type Busy = null | "loading" | "engine" | "preparing" | "checking" | "opponent";

export interface Toast {
  id: number;
  text: string;
  tone: "good" | "info";
}

export interface NewGameOptions {
  colour: Colour | "random";
  opponentSkill: number;
  easy: boolean;
}

let toastId = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useGame(opts: { llmEnabled: boolean }) {
  const [game, setGame] = useState<SavedGame | null>(null);
  const gameRef = useRef<SavedGame | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<Busy>("loading");
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const running = useRef(false);
  const enginesReady = useRef(false);
  const saver = useRef<Saver | null>(null);
  /** Lessons created but not yet saved: ask for their explanation once they are. */
  const wantExplanation = useRef(new Set<number>());
  const explanations = useRef(new Map<string, Promise<ExplanationResponse>>());
  const llmEnabled = opts.llmEnabled;

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
          .requestExplanation(gameId, lessonId)
          .catch((): ExplanationResponse => ({ status: "error", remaining: 0 }));
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
        if (saved.state.lessons.some((l) => l.id === lessonId)) {
          wantExplanation.current.delete(lessonId);
          void requestExplanation(saved.id, lessonId);
        }
      }
    },
    [llmEnabled, requestExplanation],
  );

  const attachSaver = useCallback(
    (g: SavedGame) => {
      saver.current = new Saver(g.stateVersion, onSaved, (err) => {
        setError(err.message);
        if (err instanceof ConflictError) {
          // Another device moved on: load the latest version instead of overwriting it.
          void loadActiveGame().then((latest) => {
            gameRef.current = latest;
            setGame(latest);
            if (latest) attachSaver(latest);
          });
        }
      });
    },
    [onSaved],
  );

  const commit = useCallback((next: SavedGame) => {
    gameRef.current = next;
    setGame(next);
    saver.current?.save(next);
  }, []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }, []);

  const engines = useCallback(async (skill: number) => {
    if (!enginesReady.current) setBusy("engine");
    const result = await getEngines(skill);
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
        if (e.kind === "created") {
          wantExplanation.current.add(lesson.id);
        } else if ((e.kind === "triggered" || e.kind === "chanceGone") && !lesson.deferred && !reveal) {
          // Asking "which move caused it?" is pointless when it was obviously the last one.
          const obvious = e.kind === "chanceGone" && userMovesAgo(g.state, lesson) === 1;
          reveal = { lessonId: e.lessonId, step: obvious ? "explain" : "find", attempts: 0, wrong: [] };
        } else if (e.kind === "fixed") {
          toast(
            lesson.kind === "consequence"
              ? `Nice! ${lessonLabel(lesson)} had left a weakness, and you fixed it before it cost you.`
              : `Nice! You found the better idea you missed with ${lessonLabel(lesson)}.`,
            "good",
          );
        } else if (e.kind === "warning") {
          toast(e.text);
        }
      }
      return { ...g, reveal };
    },
    [toast],
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
        const { engines: e } = await engines(g.opponentSkill);
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
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      running.current = false;
      setBusy(null);
    }
  }, [commit, engines, handle]);

  // Load the user's game in progress, if any.
  useEffect(() => {
    let cancelled = false;
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
        setError(err instanceof Error ? err.message : String(err));
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
      setPendingMove(uci);
      setBusy("checking");
      void (async () => {
        try {
          const { engines: e } = await engines(g.opponentSkill);
          const r = await userMove(g.state, uci, e);
          if (gameRef.current?.id === g.id && gameRef.current.state === g.state) {
            commit(handle({ ...gameRef.current, state: r.state }, r.events));
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          running.current = false;
          setPendingMove(null);
          setBusy(null);
          void advance();
        }
      })();
      return true;
    },
    [advance, commit, engines, handle],
  );

  const newGame = useCallback(
    async (o: NewGameOptions) => {
      const colour = o.colour === "random" ? (Math.random() < 0.5 ? "w" : "b") : o.colour;
      // An unfinished game being abandoned is finished first, so it shows up as done.
      const old = gameRef.current;
      if (old && !old.finished) {
        commit({ ...old, state: finish(old.state), reveal: null, finished: true });
        await saver.current?.flush();
      }
      const { depth } = await engines(o.opponentSkill);
      setBusy(null);
      const created = await createGame({
        state: newSession({ userColour: colour, config: { analysisDepth: depth, easy: o.easy } }),
        opponentSkill: o.opponentSkill,
        reveal: null,
        finished: false,
      });
      wantExplanation.current.clear();
      gameRef.current = created;
      setGame(created);
      attachSaver(created);
      void advance();
    },
    [advance, attachSaver, commit, engines],
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
      commit({ ...g, state: rewind(g.state, lessonId), reveal: null, finished: false });
      void advance();
    },
    [advance, commit],
  );

  const endGame = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.finished) return;
    commit({ ...g, state: finish(g.state), reveal: null, finished: true });
  }, [commit]);

  /**
   * The AI explanation for a lesson: the request made when the lesson was created, or a new
   * one (which returns the stored explanation if there is one). Polls while it's pending.
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
          .catch((): ExplanationResponse => ({ status: "error", remaining: 0 }));
      }
      return signal.aborted ? null : r;
    },
    [llmEnabled, requestExplanation],
  );

  const currentHint = (() => {
    const g = game;
    if (!g?.reveal || g.reveal.attempts === 0) return null;
    const lesson = g.state.lessons.find((l) => l.id === g.reveal!.lessonId);
    return lesson ? (hints(lesson)[g.reveal.attempts - 1] ?? null) : null;
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
    endGame,
    explanation,
    dismissError: () => setError(null),
  };
}

export type GameApi = ReturnType<typeof useGame>;
