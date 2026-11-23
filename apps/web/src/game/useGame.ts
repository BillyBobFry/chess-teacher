/**
 * The game loop: drives the core's session state machine with the browser engines,
 * turns events into UI state (reveals, toasts), and saves after every step.
 */

import { useCallback, useEffect, useRef, useState } from "react";
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
  type Colour,
  type GameEvent,
} from "@chess-teacher/core";
import { getEngines } from "../engine/engines.ts";
import { loadGame, saveGame, type SavedGame } from "./storage.ts";

export type Busy = null | "engine" | "preparing" | "checking" | "opponent";

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

export function useGame() {
  const [game, setGame] = useState<SavedGame | null>(() => loadGame());
  const gameRef = useRef(game);
  const [busy, setBusy] = useState<Busy>(null);
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const running = useRef(false);
  const enginesReady = useRef(false);

  const commit = useCallback((next: SavedGame | null) => {
    gameRef.current = next;
    setGame(next);
    saveGame(next);
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

  /** Apply events to the saved game: open a reveal, show toasts. */
  const handle = useCallback(
    (g: SavedGame, events: GameEvent[]): SavedGame => {
      let reveal = g.reveal;
      for (const e of events) {
        const lesson = g.state.lessons.find((l) => l.id === e.lessonId);
        if (!lesson) continue;
        if ((e.kind === "triggered" || e.kind === "chanceGone") && !lesson.deferred && !reveal) {
          reveal = { lessonId: e.lessonId, step: "find", attempts: 0, wrong: [] };
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
          if (gameRef.current !== g) continue; // a new game or rewind happened meanwhile
          commit(handle({ ...g, state: r.state }, r.events));
        } else {
          setBusy("opponent");
          const r = await opponentMove(g.state, e);
          if (gameRef.current !== g) continue;
          commit(handle({ ...g, state: r.state }, r.events));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      running.current = false;
      setBusy(null);
    }
  }, [commit, engines, handle]);

  useEffect(() => {
    void advance();
  }, [advance]);

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
          if (gameRef.current === g) commit(handle({ ...g, state: r.state }, r.events));
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
    async (opts: NewGameOptions) => {
      const colour = opts.colour === "random" ? (Math.random() < 0.5 ? "w" : "b") : opts.colour;
      const { depth } = await engines(opts.opponentSkill);
      setBusy(null);
      commit({
        version: 1,
        state: newSession({ userColour: colour, config: { analysisDepth: depth, easy: opts.easy } }),
        opponentSkill: opts.opponentSkill,
        reveal: null,
        finished: false,
      });
      void advance();
    },
    [advance, commit, engines],
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

  const discard = useCallback(() => commit(null), [commit]);

  const currentHint = (() => {
    const g = game;
    if (!g?.reveal || g.reveal.attempts === 0) return null;
    const lesson = g.state.lessons.find((l) => l.id === g.reveal!.lessonId);
    return lesson ? (hints(lesson)[g.reveal.attempts - 1] ?? null) : null;
  })();

  return {
    game,
    busy,
    pendingMove,
    toasts,
    error,
    currentHint,
    move,
    newGame,
    guess,
    showAnswer,
    closeReveal,
    rewindTo,
    endGame,
    discard,
    dismissError: () => setError(null),
  };
}

export type GameApi = ReturnType<typeof useGame>;
