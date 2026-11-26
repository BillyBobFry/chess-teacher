"""Lesson benchmark, step 2: tag each item's tactics with Lichess's puzzle tagger.

A mistake's punishment is a puzzle for the opponent (the mistake is the setup move); a
missed win is a puzzle for the player (the opponent's previous move is the setup move).
Each line is cut where the material it wins is banked, as a Lichess puzzle would be.

Usage: python -I tag_motifs.py raw/1400.jsonl ... > motifs.jsonl
"""
import json, math, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "lichess-tagger"))
import chess, chess.pgn  # noqa: E402
from cook import cook  # noqa: E402
from model import Puzzle  # noqa: E402

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}

def bal(board, colour):
    return sum((1 if p.color == colour else -1) * VAL[p.piece_type] for p in board.piece_map().values())

def cp_from_win(w):
    x = min(0.99, max(0.01, w / 100))
    return int(-math.log(1 / x - 1) / 0.00368208)

def cut_line(root, setup, line):
    """Setup move + the shortest prefix of the solution that ends on the solver's move and
    banks the material the whole line wins (or mates)."""
    b = root.copy(); b.push(setup)
    solver = b.turn
    moves, vals = [], []
    for u in line:
        m = chess.Move.from_uci(u)
        if m not in b.legal_moves: break
        b.push(m); moves.append(m); vals.append(bal(b, solver))
        if b.is_checkmate(): return moves
    if not moves: return []
    held = [min(v, vals[i + 1]) if i + 1 < len(vals) else v for i, v in enumerate(vals)]
    target = held[-1]
    for k in range(1, len(moves) + 1, 2):  # solver moves at odd lengths
        if held[k - 1] >= target and (k >= len(vals) or vals[k] >= target):
            return moves[:k]
    n = len(moves) if len(moves) % 2 == 1 else len(moves) - 1
    return moves[:max(1, min(n, 9))]

def puzzle_tags(root_fen, setup_uci, line, solver_cp, pid):
    root = chess.Board(root_fen)
    setup = chess.Move.from_uci(setup_uci)
    sol = cut_line(root, setup, line)
    if not sol: return None
    game = chess.pgn.Game.from_board(root)
    node = game.add_main_variation(setup)
    for m in sol: node = node.add_main_variation(m)
    try:
        tags = cook(Puzzle(pid, game, solver_cp))
    except Exception as e:  # a tagger rule failing on an odd position shouldn't drop the item
        tags = [f"error:{type(e).__name__}"]
    b = root.copy(); b.push(setup)
    return {"tags": tags, "solution": b.variation_san(sol)}

for path in sys.argv[1:]:
    for n, line in enumerate(open(path)):
        it = json.loads(line)
        mover = chess.WHITE if it["mover"] == "w" else chess.BLACK
        out = {"band": it["band"], "site": it["site"], "ply": it["ply"], "punishment": None, "missed": None}
        p = it["punishment"]
        mated = it["mate_after"] is not None and it["mate_after"] <= 0
        if mated or p["balance_end"] <= p["balance_before"] - 1:
            out["punishment"] = puzzle_tags(it["fen"], it["played"], p["uci"], cp_from_win(100 - it["win_after"]), f"{it['site']}#{it['ply']}p")
        best = it["candidates"][0]
        wins_mate = it["mate_before"] is not None and it["mate_before"] > 0
        wins_mat = it["best_line"]["balance_end"] >= it["punishment"]["balance_before"] + 1 and it["best_line"]["balance_end"] > p["balance_end"] + 0.5
        if (wins_mate or wins_mat) and it["ply"] > 0 and best["move"] != it["played"]:
            prev = chess.Board()
            for u in it["moves_before"][:-1]: prev.push(chess.Move.from_uci(u))
            out["missed"] = puzzle_tags(prev.fen(), it["moves_before"][-1], best["uci"], best["cp"], f"{it['site']}#{it['ply']}m")
        print(json.dumps(out))
