"""The teaching opponent: plays at the user's level, levels up to exploit a pending lesson."""

from __future__ import annotations

from typing import Optional

import chess

from .engine import Engine
from .features import FEATURES_BY_NAME
from .lessons import MATE_FEATURE, Lesson


class TeachingOpponent:
    def __init__(self, weak: Engine, strong: Engine, margin: int = 60, lookahead: int = 4, think_time: float = 0.05):
        self.weak = weak            # normal mode (stand-in for Maia: weakened Stockfish)
        self.strong = strong        # levelled-up mode
        self.margin = margin        # how much eval we'll give up to make the exploit clearer
        self.lookahead = lookahead  # plies of each candidate's line to check for lesson progress
        self.think_time = think_time

    def choose(self, board: chess.Board, lesson: Optional[Lesson]) -> tuple[chess.Move, str]:
        if lesson is None:
            return self.weak.play(board, self.think_time), "normal"

        cands = self.strong.analyse(board, multipv=5)
        if not cands:
            return self.weak.play(board, self.think_time), "normal"
        if lesson.feature == MATE_FEATURE:
            return cands[0].move, "levelled"

        best = cands[0].score
        viable = [c for c in cands if best - c.score <= self.margin]
        feature = FEATURES_BY_NAME[lesson.feature]

        def progress(cand) -> float:
            """Lowest value (user's POV) the lesson's feature reaches along this line."""
            b = board.copy(stack=False)
            values = []
            for m in cand.pv[: self.lookahead]:
                if m not in b.legal_moves:
                    break
                b.push(m)
                values.append(feature.measure(b, lesson.user_color)[0])
            return min(values) if values else float("inf")

        # Prefer the move that most directly cashes in the lesson; break ties on eval.
        chosen = min(viable, key=lambda c: (progress(c), -c.score))
        return chosen.move, "levelled"
