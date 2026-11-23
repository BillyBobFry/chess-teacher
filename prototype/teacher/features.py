"""Strategic features measured in code, from one player's point of view.

Every feature returns (value, detail): a number where HIGHER IS BETTER for the
player we measure for, and a short human-readable detail used in explanations.
The LLM never does this analysis; it only phrases what these functions found.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

import chess

VALUES = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
PIECE_NAMES = {
    chess.PAWN: "pawn", chess.KNIGHT: "knight", chess.BISHOP: "bishop",
    chess.ROOK: "rook", chess.QUEEN: "queen", chess.KING: "king",
}
CENTRE = (chess.D4, chess.E4, chess.D5, chess.E5)


def sq(s: int) -> str:
    return chess.square_name(s)


def piece_desc(board: chess.Board, s: int) -> str:
    p = board.piece_at(s)
    return f"{PIECE_NAMES[p.piece_type]} on {sq(s)}" if p else sq(s)


# --------------------------------------------------------------------------- material

def material(board: chess.Board, color: chess.Color) -> int:
    return sum(len(board.pieces(pt, color)) * v for pt, v in VALUES.items())


def _mvv_lva(board: chess.Board, move: chess.Move) -> int:
    victim = board.piece_type_at(move.to_square) or chess.PAWN  # en passant
    attacker = board.piece_type_at(move.from_square) or chess.PAWN
    return VALUES[victim] * 10 - VALUES[attacker]


def settled_balance(board: chess.Board, color: chess.Color, depth: int = 6) -> int:
    """Material balance for `color` after pending captures are resolved.

    A tiny capture-only quiescence search, so that a position in the middle of an
    exchange isn't mistaken for one side being a piece up.
    """

    def q(b: chess.Board, alpha: int, beta: int, d: int) -> int:
        stand = material(b, b.turn) - material(b, not b.turn)
        if d == 0 or stand >= beta:
            return stand
        alpha = max(alpha, stand)
        captures = sorted(
            (m for m in b.legal_moves if b.is_capture(m)),
            key=lambda m: _mvv_lva(b, m), reverse=True,
        )
        for m in captures:
            b.push(m)
            score = -q(b, -beta, -alpha, d - 1)
            b.pop()
            if score >= beta:
                return score
            alpha = max(alpha, score)
        return alpha

    b = board.copy(stack=False)
    result = q(b, -1000, 1000, depth)
    return result if b.turn == color else -result


def hanging(board: chess.Board, color: chess.Color) -> list[int]:
    """Pieces attacked and undefended, or attacked by a cheaper piece."""
    out = []
    for s, p in board.piece_map().items():
        if p.color != color or p.piece_type == chess.KING:
            continue
        attackers = board.attackers(not color, s)
        if not attackers:
            continue
        cheapest = min(
            100 if board.piece_type_at(a) == chess.KING else VALUES[board.piece_type_at(a)]
            for a in attackers
        )
        if not board.attackers(color, s) or cheapest < VALUES[p.piece_type]:
            out.append(s)
    return out


# --------------------------------------------------------------------------- development / king

HOME_MINORS = {
    chess.WHITE: [(chess.B1, chess.KNIGHT), (chess.G1, chess.KNIGHT), (chess.C1, chess.BISHOP), (chess.F1, chess.BISHOP)],
    chess.BLACK: [(chess.B8, chess.KNIGHT), (chess.G8, chess.KNIGHT), (chess.C8, chess.BISHOP), (chess.F8, chess.BISHOP)],
}


def undeveloped(board: chess.Board, color: chess.Color) -> list[int]:
    return [
        s for s, pt in HOME_MINORS[color]
        if (p := board.piece_at(s)) and p.color == color and p.piece_type == pt
    ]


def king_shield(board: chess.Board, color: chess.Color) -> int:
    k = board.king(color)
    if k is None:
        return 0
    kf, kr = chess.square_file(k), chess.square_rank(k)
    step = 1 if color == chess.WHITE else -1
    count = 0
    for f in (kf - 1, kf, kf + 1):
        for dr in (1, 2):
            r = kr + step * dr
            if 0 <= f < 8 and 0 <= r < 8:
                p = board.piece_at(chess.square(f, r))
                if p and p.color == color and p.piece_type == chess.PAWN:
                    count += 1
    return count


def king_zone_attacks(board: chess.Board, color: chess.Color) -> int:
    k = board.king(color)
    if k is None:
        return 0
    zone = list(board.attacks(k)) + [k]
    return sum(len(board.attackers(not color, s)) for s in zone)


# --------------------------------------------------------------------------- activity

def mobility(board: chess.Board, color: chess.Color) -> int:
    b = board.copy(stack=False)
    b.turn = color
    b.ep_square = None
    return sum(
        1 for m in b.pseudo_legal_moves
        if b.piece_type_at(m.from_square) not in (chess.PAWN, chess.KING)
    )


def centre_control(board: chess.Board, color: chess.Color) -> int:
    score = 0
    for s in CENTRE:
        score += len(board.attackers(color, s))
        p = board.piece_at(s)
        if p and p.color == color:
            score += 2 if p.piece_type == chess.PAWN else 1
    return score


# --------------------------------------------------------------------------- pawns

def _ahead(color: chess.Color, rank: int, of_rank: int) -> bool:
    return rank > of_rank if color == chess.WHITE else rank < of_rank


def pawn_structure(board: chess.Board, color: chess.Color) -> dict[str, list[int]]:
    own = list(board.pieces(chess.PAWN, color))
    opp = list(board.pieces(chess.PAWN, not color))
    files = [0] * 8
    for s in own:
        files[chess.square_file(s)] += 1
    isolated, doubled, backward, passed = [], [], [], []
    for s in own:
        f, r = chess.square_file(s), chess.square_rank(s)
        adj = [x for x in (f - 1, f + 1) if 0 <= x < 8]
        if files[f] > 1:
            doubled.append(s)
        if all(files[a] == 0 for a in adj):
            isolated.append(s)
            is_isolated = True
        else:
            is_isolated = False
        if not any(chess.square_file(o) in (f - 1, f, f + 1) and _ahead(color, chess.square_rank(o), r) for o in opp):
            passed.append(s)
        elif not is_isolated:
            supported_later = any(
                chess.square_file(p) in adj and not _ahead(color, chess.square_rank(p), r) for p in own
            )
            stop = s + 8 if color == chess.WHITE else s - 8
            if 0 <= stop < 64 and not supported_later and any(
                board.piece_type_at(a) == chess.PAWN for a in board.attackers(not color, stop)
            ):
                backward.append(s)
    # count doubled pawns once per extra pawn, keep the squares for explanations
    return {"isolated": isolated, "doubled": doubled, "backward": backward, "passed": passed}


def pawn_weakness_count(ps: dict[str, list[int]]) -> int:
    doubled_files = {chess.square_file(s) for s in ps["doubled"]}
    extra_doubled = len(ps["doubled"]) - len(doubled_files)
    return len(ps["isolated"]) + extra_doubled + len(ps["backward"])


def describe_pawns(ps: dict[str, list[int]]) -> str:
    parts = []
    if ps["isolated"]:
        parts.append("isolated pawn(s) on " + ", ".join(sq(s) for s in ps["isolated"]))
    if ps["doubled"]:
        files = sorted({chess.FILE_NAMES[chess.square_file(s)] for s in ps["doubled"]})
        parts.append("doubled pawns on the " + ", ".join(f + "-file" for f in files))
    if ps["backward"]:
        parts.append("backward pawn(s) on " + ", ".join(sq(s) for s in ps["backward"]))
    return "; ".join(parts) or "no pawn weaknesses"


def outposts(board: chess.Board, color: chess.Color) -> list[int]:
    out = []
    opp = board.pieces(chess.PAWN, not color)
    for s in board.pieces(chess.KNIGHT, color):
        f, r = chess.square_file(s), chess.square_rank(s)
        rel = r if color == chess.WHITE else 7 - r
        if not 3 <= rel <= 5:
            continue
        if not any(board.piece_type_at(a) == chess.PAWN for a in board.attackers(color, s)):
            continue
        if any(chess.square_file(o) in (f - 1, f + 1) and _ahead(color, chess.square_rank(o), r) for o in opp):
            continue
        out.append(s)
    return out


def rooks_on_open_files(board: chess.Board, color: chess.Color) -> list[int]:
    out = []
    own_pawn_files = {chess.square_file(s) for s in board.pieces(chess.PAWN, color)}
    for s in board.pieces(chess.ROOK, color):
        if chess.square_file(s) not in own_pawn_files:
            out.append(s)
    return out


# --------------------------------------------------------------------------- registry

@dataclass(frozen=True)
class Feature:
    name: str
    unit: float  # how big a change counts as "one significant step"
    principle: str
    measure: Callable[[chess.Board, chess.Color], tuple[float, str]]


def _material(b, c):
    v = settled_balance(b, c)
    return v, f"material balance {v:+d}"


def _development(b, c):
    if b.fullmove_number > 20:
        return 0.0, "opening phase over"
    u = undeveloped(b, c)
    return -len(u), ("undeveloped: " + ", ".join(piece_desc(b, s) for s in u)) if u else "all minor pieces developed"


def _king_safety(b, c):
    if not b.pieces(chess.QUEEN, not c):
        # Without the enemy queen a mating attack is unlikely: treat the king as safe,
        # otherwise trading queens would look like a king-safety *loss*.
        return 3.0, "the enemy queen is gone, so your king is fairly safe"
    shield, attacks = king_shield(b, c), king_zone_attacks(b, c)
    return shield - 0.5 * attacks, f"{shield} pawn(s) shielding the king, {attacks} enemy attack(s) on the squares around it"


def _centre(b, c):
    mine, theirs = centre_control(b, c), centre_control(b, not c)
    return mine - theirs, f"centre control {mine} vs {theirs}"


def _mobility(b, c):
    mine, theirs = mobility(b, c), mobility(b, not c)
    return (mine - theirs) / 5, f"{mine} piece moves available vs opponent's {theirs}"


def _own_pawns(b, c):
    ps = pawn_structure(b, c)
    return -pawn_weakness_count(ps), describe_pawns(ps)


def _their_pawns(b, c):
    ps = pawn_structure(b, not c)
    return pawn_weakness_count(ps), "opponent's pawns: " + describe_pawns(ps)


def _passed(b, c):
    mine, theirs = pawn_structure(b, c)["passed"], pawn_structure(b, not c)["passed"]
    d = f"your passed pawns: {', '.join(sq(s) for s in mine) or 'none'}; theirs: {', '.join(sq(s) for s in theirs) or 'none'}"
    return len(mine) - len(theirs), d


def _outposts(b, c):
    mine, theirs = outposts(b, c), outposts(b, not c)
    d = f"your knight outposts: {', '.join(sq(s) for s in mine) or 'none'}; theirs: {', '.join(sq(s) for s in theirs) or 'none'}"
    return len(mine) - len(theirs), d


def _open_files(b, c):
    mine, theirs = rooks_on_open_files(b, c), rooks_on_open_files(b, not c)
    d = f"your rooks on open files: {', '.join(sq(s) for s in mine) or 'none'}; theirs: {', '.join(sq(s) for s in theirs) or 'none'}"
    return len(mine) - len(theirs), d


def is_endgame(board: chess.Board) -> bool:
    if board.pieces(chess.QUEEN, chess.WHITE) or board.pieces(chess.QUEEN, chess.BLACK):
        return False
    pieces = sum(VALUES[p.piece_type] for p in board.piece_map().values() if p.piece_type != chess.PAWN)
    return pieces <= 26


def centre_distance(s: int) -> int:
    f, r = chess.square_file(s), chess.square_rank(s)
    return max(abs(2 * f - 7), abs(2 * r - 7)) // 2  # 0 in the centre, 3 on the edge


def _king_activity(b, c):
    if not is_endgame(b):
        return 0.0, "not an endgame yet"
    mine, theirs = b.king(c), b.king(not c)
    if mine is None or theirs is None:
        return 0.0, ""
    d_mine, d_theirs = centre_distance(mine), centre_distance(theirs)
    return d_theirs - d_mine, (f"your king on {sq(mine)} is {d_mine} step(s) from the centre; "
                               f"theirs on {sq(theirs)} is {d_theirs}")


FEATURES: list[Feature] = [
    Feature("material", 1.0, "safety", _material),
    Feature("development", 1.0, "develop", _development),
    Feature("king_safety", 1.5, "king_safety", _king_safety),
    Feature("centre", 3.0, "centre", _centre),
    Feature("mobility", 1.5, "activity", _mobility),
    Feature("own_pawns", 1.0, "pawn_weaknesses", _own_pawns),
    Feature("their_pawns", 1.0, "target_weaknesses", _their_pawns),
    Feature("passed_pawns", 1.0, "passed_pawns", _passed),
    Feature("outposts", 1.0, "outposts", _outposts),
    Feature("open_files", 1.0, "open_files", _open_files),
    Feature("king_activity", 1.0, "king_activity", _king_activity),
]
FEATURES_BY_NAME = {f.name: f for f in FEATURES}


def measure_all(board: chess.Board, color: chess.Color) -> dict[str, tuple[float, str]]:
    return {f.name: f.measure(board, color) for f in FEATURES}
