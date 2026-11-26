"""Record how Maia-3's own code encodes positions and moves, for packages/engine/test/maia.test.ts.

Usage (see README.md): python record_encoding.py <maia3 repo> <out.json>
"""

import json
import sys
from collections import deque

maia_repo, out_path = sys.argv[1:3]
sys.path.insert(0, maia_repo)

import chess  # noqa: E402
from maia3.dataset import get_historical_tokens, tokenize_board  # noqa: E402
from maia3.utils import get_all_possible_moves, mirror_move  # noqa: E402

HISTORY = 8


class Cfg:
    history = HISTORY
    include_time_info = False


# Short and long histories, both sides to move, castling, en passant and promotion.
GAMES = {
    "start": [],
    "one move": ["e2e4"],
    "castling for white": "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6".split(),
    "castling for black": "e2e4 e7e5 g1f3 b8c6 f1c4 g8f6 e1g1 d7d6 d2d4 c8g4 b1c3 d8d7 c1g5".split(),
    "en passant": "e2e4 a7a6 e4e5 d7d5".split(),
    "promotion for black": "a2a3 b7b5 a3a4 b5a4 b2b3 a4b3 c1b2 b3c2 b1c3".split(),
    "promotion for white": "a2a4 b7b5 a4b5 a7a6 b5a6 c8b7 a6b7 b8c6".split(),
}

index = {m: i for i, m in enumerate(get_all_possible_moves())}
cases = []
for name, moves in GAMES.items():
    board = chess.Board()
    history = deque([tokenize_board(board)], maxlen=HISTORY)
    fens = [board.fen()]
    for move in moves:
        board.push_uci(move)
        history.append(tokenize_board(board))
        fens.append(board.fen())
    tokens = get_historical_tokens(history, Cfg, 0, 0, 0, 0)[:, : 12 * HISTORY].flatten()
    black = board.turn == chess.BLACK
    cases.append(
        {
            "name": name,
            "positions": fens,
            "nonzero": tokens.nonzero().flatten().tolist(),
            "moveIndex": {
                m.uci(): index[mirror_move(m.uci()) if black else m.uci()] for m in board.legal_moves
            },
        }
    )

with open(out_path, "w") as f:
    json.dump(cases, f, indent=1)
    f.write("\n")
print(f"{out_path}: {len(cases)} positions")
