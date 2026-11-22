"""Mistake detection, pending lessons, and the checks that trigger them."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

import chess

from .engine import MATE_SCORE, Candidate
from .features import FEATURES, FEATURES_BY_NAME, PIECE_NAMES, hanging, material, measure_all

CONSEQUENCE = "consequence"   # the user's line makes something measurably worse
MISSED_CHANCE = "missed_chance"  # the user's line is fine, but the best line gains something

MATE_FEATURE = "mate"
OPPORTUNITY_FEATURES = {"their_pawns"}


@dataclass
class Config:
    threshold: int = 70          # min eval gap (centipawns) before we consider teaching
    still_winning: int = 300     # don't nitpick moves that leave the user clearly winning
    hopeless: int = -500         # don't teach in positions that were already lost
    line_plies: int = 8          # how far to play the two futures forward (plies)
    expiry_moves: int = 8        # a pending lesson expires after this many opponent moves
    cause_window: int = 5        # how many of the user's recent moves to offer in "find the cause"
    level_up: bool = True        # teaching opponent exploits pending lessons
    easy: bool = False           # warn when the opponent has spotted something


@dataclass
class Lesson:
    id: int
    ply: int
    user_color: chess.Color
    board_before: chess.Board
    user_move: chess.Move
    best_move: chess.Move
    best_score: int
    user_score: int
    feature: str
    principle: str
    kind: str
    baseline: float
    predicted: float           # feature value at the end of the user's line
    best_value: float          # feature value at the end of the best line
    trigger_at: float          # consequence fires when the real value is <= this
    user_line: list[chess.Move]
    best_line: list[chess.Move]
    user_values: list[float]
    best_values: list[float]
    divergence: int
    baseline_detail: str
    user_detail: str           # feature detail at the end of the user's line
    best_detail: str
    hanging_after: list[int] = field(default_factory=list)
    status: str = "pending"    # pending | triggered | fixed | expired | superseded | rewound
    resolved_ply: Optional[int] = None
    trigger_text: str = ""
    deferred: bool = False     # triggered at the same time as another lesson; shown in review
    found_cause: Optional[bool] = None
    chance_move: Optional[chess.Move] = None
    explanation: str = ""

    # ---- presentation helpers
    @property
    def move_number(self) -> int:
        return self.board_before.fullmove_number

    @property
    def gap(self) -> int:
        return self.best_score - self.user_score

    @property
    def user_san(self) -> str:
        return self.board_before.san(self.user_move)

    @property
    def best_san(self) -> str:
        return self.board_before.san(self.best_move)

    def line_san(self, line: list[chess.Move]) -> str:
        return self.board_before.variation_san(line)

    def label(self) -> str:
        dots = "." if self.user_color == chess.WHITE else "..."
        return f"{self.move_number}{dots} {self.user_san}"


# --------------------------------------------------------------------------- detection

def _line_values(board: chess.Board, line: list[chess.Move], color: chess.Color):
    b = board.copy(stack=False)
    values = []
    for m in line:
        b.push(m)
        values.append(measure_all(b, color))
    return values, b


def _clean_line(board: chess.Board, moves: list[chess.Move], plies: int) -> list[chess.Move]:
    """Keep only the legal prefix of a PV (engines occasionally return stale moves)."""
    b = board.copy(stack=False)
    out = []
    for m in moves[:plies]:
        if m not in b.legal_moves:
            break
        out.append(m)
        b.push(m)
    return out


def score_after(board_after: chess.Board, after: list[Candidate], user_color: chess.Color) -> int:
    """Eval (centipawns, user's point of view) of the position after the user's move."""
    if board_after.is_checkmate():
        return MATE_SCORE if board_after.turn != user_color else -MATE_SCORE
    if board_after.is_game_over():
        return 0
    return -after[0].score if after else 0


def detect_mistake(
    lesson_id: int,
    board_before: chess.Board,
    user_move: chess.Move,
    cands_before: list[Candidate],
    after: list[Candidate],
    cfg: Config,
) -> Optional[Lesson]:
    if not cands_before:
        return None
    user_color = board_before.turn
    best = cands_before[0]
    if best.move == user_move:
        return None

    board_after = board_before.copy()
    board_after.push(user_move)
    user_score = score_after(board_after, after, user_color)
    gap = best.score - user_score
    if gap < cfg.threshold or user_score >= cfg.still_winning or best.score <= cfg.hopeless:
        return None

    tail = after[0].pv if after else []
    user_line = [user_move] + _clean_line(board_after, tail, cfg.line_plies - 1)
    best_line = _clean_line(board_before, best.pv, cfg.line_plies)
    n = min(len(user_line), len(best_line))
    user_line, best_line = user_line[:n], best_line[:n]

    hanging_after = hanging(board_after, user_color)
    baseline = measure_all(board_before, user_color)

    # Getting mated is its own lesson: there's no slow strategic consequence to wait for.
    if user_score <= -(MATE_SCORE - 300):
        return Lesson(
            id=lesson_id, ply=board_before.ply(), user_color=user_color, board_before=board_before.copy(),
            user_move=user_move, best_move=best.move, best_score=best.score, user_score=user_score,
            feature=MATE_FEATURE, principle="safety", kind=CONSEQUENCE,
            baseline=0, predicted=-1, best_value=0, trigger_at=-1,
            user_line=user_line, best_line=best_line, user_values=[], best_values=[], divergence=n - 1,
            baseline_detail="", user_detail="your king gets checkmated", best_detail="no mate",
            hanging_after=hanging_after,
        )

    if n == 0:
        return None
    user_vals, _ = _line_values(board_before, user_line, user_color)
    best_vals, _ = _line_values(board_before, best_line, user_color)
    end = n - 1

    def norm_gap(name: str, i: int) -> float:
        f = FEATURES_BY_NAME[name]
        return (best_vals[i][name][0] - user_vals[i][name][0]) / f.unit

    def persistent_gap(name: str) -> float:
        """The gap must hold for the last two plies, so a snapshot taken with one
        side to move (or mid-manoeuvre) can't create a lesson on its own."""
        return min(norm_gap(name, end), norm_gap(name, end - 1)) if end >= 1 else norm_gap(name, end)

    # Material is the most concrete lesson, so it wins whenever it explains the gap.
    chosen = None
    if norm_gap("material", end) >= 1:
        chosen = "material"
    else:
        scored = [(persistent_gap(f.name), f.name) for f in FEATURES if f.name != "material"]
        top, name = max(scored)
        if top >= 1:
            chosen = name
    if chosen is None:
        return None  # the engine prefers another move, but nothing we measure explains why

    feat = FEATURES_BY_NAME[chosen]
    base_v, base_d = baseline[chosen]
    user_v, user_d = user_vals[end][chosen]
    best_v, best_d = best_vals[end][chosen]
    final_gap = norm_gap(chosen, end)
    divergence = next((i for i in range(n) if norm_gap(chosen, i) >= 0.5 * final_gap), end)

    # Opponent weaknesses are opportunities: losing one is a missed chance, not a consequence.
    if chosen not in OPPORTUNITY_FEATURES and (base_v - user_v) / feat.unit >= 0.9:
        kind = CONSEQUENCE
        trigger_at = base_v - 0.75 * (base_v - user_v)
    else:
        kind = MISSED_CHANCE
        trigger_at = user_v

    principle = feat.principle
    if chosen == "material":
        opp_reply = user_line[1] if len(user_line) > 1 else None
        principle = "hanging" if opp_reply is not None and opp_reply.to_square in hanging_after else "safety"

    return Lesson(
        id=lesson_id, ply=board_before.ply(), user_color=user_color, board_before=board_before.copy(),
        user_move=user_move, best_move=best.move, best_score=best.score, user_score=user_score,
        feature=chosen, principle=principle, kind=kind,
        baseline=base_v, predicted=user_v, best_value=best_v, trigger_at=trigger_at,
        user_line=user_line, best_line=best_line,
        user_values=[v[chosen][0] for v in user_vals], best_values=[v[chosen][0] for v in best_vals],
        divergence=divergence, baseline_detail=base_d, user_detail=user_d, best_detail=best_d,
        hanging_after=hanging_after,
    )


# --------------------------------------------------------------------------- triggers

def consequence_landed(lesson: Lesson, board: chess.Board) -> bool:
    if lesson.feature == MATE_FEATURE:
        return board.is_checkmate() and board.turn == lesson.user_color
    value, _ = FEATURES_BY_NAME[lesson.feature].measure(board, lesson.user_color)
    return value <= lesson.trigger_at


def describe_consequence(lesson: Lesson, board: chess.Board) -> str:
    c = lesson.user_color
    if lesson.feature == MATE_FEATURE:
        return "You've been checkmated."
    if lesson.feature == "material":
        def changes(color):
            out = []
            for pt in (chess.QUEEN, chess.ROOK, chess.BISHOP, chess.KNIGHT, chess.PAWN):
                d = len(lesson.board_before.pieces(pt, color)) - len(board.pieces(pt, color))
                if d > 0:
                    out.append(f"{d} {PIECE_NAMES[pt]}s" if d > 1 else f"a {PIECE_NAMES[pt]}")
            return ", ".join(out)
        lost, taken = changes(c), changes(not c)

        def balance(b):
            return material(b, c) - material(b, not c)

        net = balance(lesson.board_before) - balance(board)
        settled, _ = FEATURES_BY_NAME["material"].measure(board, c)
        more = (lesson.baseline - settled) > net
        worth = f"{net} pawn{'s' if net != 1 else ''}"
        if net <= 0:
            return "You're about to lose material."
        if lost and taken:
            text = f"Since that move you've lost {lost} and taken {taken}: overall you're {worth} down."
        else:
            text = f"You've lost {lost}: you're {worth} worse off than before."
        return text + (" And more is about to fall." if more else "")
    _, detail = FEATURES_BY_NAME[lesson.feature].measure(board, c)
    openers = {
        "development": "You've fallen behind in development",
        "king_safety": "Your king has come under fire",
        "centre": "Your opponent has taken over the centre",
        "mobility": "Your pieces have run short of squares",
        "own_pawns": "Your pawn structure has been damaged",
        "their_pawns": "Your opponent has fixed their pawn weaknesses",
        "passed_pawns": "Your opponent now has the more dangerous passed pawns",
        "outposts": "Your opponent's knight has found a strong outpost",
        "open_files": "Your opponent's rook has taken an open file",
        "king_activity": "Your opponent's king has become more active than yours",
    }
    return f"{openers.get(lesson.feature, 'Something went wrong')} ({detail})."
