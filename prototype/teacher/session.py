"""A game in progress: orchestrates analysis, lessons, triggers and the opponent.

The interactive CLI and the simulation harness both drive this class.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import chess

from .engine import Candidate, Engine
from .features import FEATURES_BY_NAME
from .lessons import (
    CONSEQUENCE, MISSED_CHANCE, Config, Lesson, consequence_landed, describe_consequence,
    detect_mistake, score_after,
)
from .opponent import TeachingOpponent


@dataclass
class Event:
    kind: str  # created | warning | triggered | chance_gone | fixed | expired
    lesson: Lesson
    text: str = ""


class Session:
    def __init__(self, user_color: chess.Color, analyst: Engine, opponent: TeachingOpponent,
                 config: Optional[Config] = None, board: Optional[chess.Board] = None):
        self.user_color = user_color
        self.analyst = analyst
        self.opponent = opponent
        self.cfg = config or Config()
        self.board = board or chess.Board()
        self.lessons: list[Lesson] = []
        self.opponent_modes: list[str] = []
        self._cands: Optional[list[Candidate]] = None
        self._cands_fen: Optional[str] = None

    # ------------------------------------------------------------------ helpers
    def pending(self, kind: Optional[str] = None) -> list[Lesson]:
        return [l for l in self.lessons if l.status == "pending" and (kind is None or l.kind == kind)]

    def active_lesson(self) -> Optional[Lesson]:
        """The lesson the opponent is currently trying to demonstrate (biggest pending)."""
        pend = self.pending(CONSEQUENCE)
        return max(pend, key=lambda l: l.gap) if pend else None

    def _plies_since(self, lesson: Lesson) -> int:
        return self.board.ply() - lesson.ply

    def _analysis(self) -> list[Candidate]:
        fen = self.board.fen()
        if self._cands_fen != fen:
            self._cands = self.analyst.analyse(self.board, multipv=3)
            self._cands_fen = fen
        return self._cands or []

    def _resolve(self, lesson: Lesson, status: str) -> None:
        lesson.status = status
        lesson.resolved_ply = self.board.ply()

    # ------------------------------------------------------------------ turn flow
    def start_user_turn(self) -> list[Event]:
        """Call when it's the user's turn. Checks whether missed chances have gone."""
        events: list[Event] = []
        cands = self._analysis()
        for lesson in self.pending(MISSED_CHANCE):
            if self._plies_since(lesson) > 2 * self.cfg.expiry_moves:
                self._resolve(lesson, "expired")
                events.append(Event("expired", lesson))
                continue
            feat = FEATURES_BY_NAME[lesson.feature]
            still_there = False
            if cands:
                b = self.board.copy(stack=False)
                for m in cands[0].pv[: self.cfg.line_plies]:
                    if m not in b.legal_moves:
                        break
                    b.push(m)
                now_best = feat.measure(b, self.user_color)[0]
                still_there = (now_best - lesson.predicted) / feat.unit >= 0.5 * (
                    (lesson.best_value - lesson.predicted) / feat.unit)
            if still_there:
                lesson.chance_move = cands[0].move
            else:
                self._resolve(lesson, "triggered")
                lesson.trigger_text = "The chance has gone."
                events.append(Event("chance_gone", lesson, lesson.trigger_text))
        return events

    def user_move(self, move: chess.Move) -> list[Event]:
        events: list[Event] = []
        before = self.board.copy()
        cands = self._analysis()
        self.board.push(move)
        after = self.analyst.analyse(self.board, multipv=1)
        user_score = score_after(self.board, after, self.user_color)

        # Did the user fix something before it was punished?
        for lesson in self.pending():
            if lesson.kind == CONSEQUENCE and user_score >= lesson.best_score - self.cfg.threshold // 2:
                self._resolve(lesson, "fixed")
                events.append(Event("fixed", lesson))
            elif lesson.kind == MISSED_CHANCE and lesson.chance_move == move:
                self._resolve(lesson, "fixed")
                events.append(Event("fixed", lesson))

        lesson = detect_mistake(len(self.lessons) + 1, before, move, cands, after, self.cfg)
        if lesson:
            # Credit assignment: once a newer mistake affects the same factor, we can no
            # longer tell which move caused what, so the older lesson goes to the review.
            for older in self.pending():
                if older.feature == lesson.feature:
                    self._resolve(older, "superseded")
            self.lessons.append(lesson)
            events.append(Event("created", lesson))
            if self.cfg.easy and lesson.kind == CONSEQUENCE and self.cfg.level_up:
                events.append(Event("warning", lesson, "Your opponent has spotted something…"))
        return events

    def opponent_move(self) -> tuple[chess.Move, str, list[Event]]:
        active = self.active_lesson() if self.cfg.level_up else None
        move, mode = self.opponent.choose(self.board, active)
        self.board.push(move)
        self.opponent_modes.append(mode)
        return move, mode, self.check_consequences()

    def check_consequences(self) -> list[Event]:
        events: list[Event] = []
        landed = []
        for lesson in sorted(self.pending(CONSEQUENCE), key=lambda l: -l.ply):
            if self._plies_since(lesson) < 2:
                continue  # need at least the opponent's reply
            if consequence_landed(lesson, self.board):
                landed.append(lesson)
            elif self._plies_since(lesson) > 2 * self.cfg.expiry_moves:
                self._resolve(lesson, "expired")
                events.append(Event("expired", lesson))
        # One lesson at a time: reveal the biggest, defer the rest to the review.
        landed.sort(key=lambda l: -l.gap)
        for i, lesson in enumerate(landed):
            self._resolve(lesson, "triggered")
            lesson.trigger_text = describe_consequence(lesson, self.board)
            lesson.deferred = i > 0
            events.append(Event("triggered", lesson, lesson.trigger_text))
        return events

    def finish(self) -> None:
        """Game over: anything still pending becomes 'you got away with it'."""
        for lesson in self.pending():
            self._resolve(lesson, "expired")

    def rewind(self, lesson: Lesson) -> None:
        self.board = lesson.board_before.copy()
        self._cands_fen = None
        for l in self.lessons:
            if l.ply >= lesson.ply and l is not lesson and l.status == "pending":
                l.status = "rewound"

    def recent_user_moves(self, lesson: Lesson) -> list[tuple[int, str]]:
        """(ply, label) for the user's recent moves, always including the mistake."""
        stack = self.board.move_stack
        replay = self.board.root()
        out = []
        for ply, move in enumerate(stack):
            if replay.turn == self.user_color:
                dots = "." if self.user_color == chess.WHITE else "..."
                out.append((ply, f"{replay.fullmove_number}{dots} {replay.san(move)}"))
            replay.push(move)
        idx = next((i for i, (p, _) in enumerate(out) if p == lesson.ply), None)
        window = out[-self.cfg.cause_window:]
        if idx is not None and out[idx] not in window:
            window = out[idx:][-max(self.cfg.cause_window, len(out) - idx):]
        return window
