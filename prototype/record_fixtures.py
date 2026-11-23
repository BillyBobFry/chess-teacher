#!/usr/bin/env python3
"""Record parity fixtures for the TypeScript port.

Plays simulated games (weak engine "student" vs the teaching opponent) and records:
  * every engine call the session makes, with its result (so the TypeScript core can
    replay identical engine output — Stockfish isn't deterministic run to run);
  * every step (start of user turn, user move, opponent move) and the events it produced;
  * the final state of every lesson, its facts and its template explanation.

Usage: python prototype/record_fixtures.py --games 6 --out tools/sim/fixtures
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import chess

sys.path.insert(0, str(Path(__file__).resolve().parent))
from teacher.engine import Engine  # noqa: E402
from teacher.explain import facts, hints, template_explanation  # noqa: E402
from teacher.features import hanging, measure_all, settled_balance  # noqa: E402
from teacher.lessons import Config  # noqa: E402
from teacher.opponent import TeachingOpponent  # noqa: E402
from teacher.session import Session  # noqa: E402


class RecordingEngine:
    """Wraps an Engine and logs every call and result."""

    def __init__(self, inner: Engine, log: list):
        self.inner, self.log = inner, log
        self.depth = inner.depth

    def analyse(self, board, multipv=1, depth=None):
        result = self.inner.analyse(board, multipv=multipv, depth=depth)
        if not board.is_game_over():  # Engine.analyse doesn't call the engine otherwise
            self.log.append({
                "op": "analyse", "fen": board.fen(), "multipv": multipv, "depth": depth or self.depth,
                "result": [{"move": c.move.uci(), "score": c.score, "pv": [m.uci() for m in c.pv]} for c in result],
            })
        return result

    def play(self, board, time=0.05):
        move = self.inner.play(board, time)
        self.log.append({"op": "play", "fen": board.fen(), "movetimeMs": round(time * 1000), "result": move.uci()})
        return move


def lesson_dict(session: Session, l) -> dict:
    return {
        "id": l.id, "ply": l.ply, "fenBefore": l.board_before.fen(),
        "userMove": l.user_move.uci(), "bestMove": l.best_move.uci(),
        "bestScore": l.best_score, "userScore": l.user_score,
        "feature": l.feature, "principle": l.principle, "kind": l.kind,
        "baseline": l.baseline, "predicted": l.predicted, "bestValue": l.best_value, "triggerAt": l.trigger_at,
        "userLine": [m.uci() for m in l.user_line], "bestLine": [m.uci() for m in l.best_line],
        "userValues": l.user_values, "bestValues": l.best_values, "divergence": l.divergence,
        "baselineDetail": l.baseline_detail, "userDetail": l.user_detail, "bestDetail": l.best_detail,
        "hangingAfter": [chess.square_name(s) for s in l.hanging_after],
        "status": l.status, "resolvedPly": l.resolved_ply, "triggerText": l.trigger_text,
        "deferred": l.deferred, "chanceMove": l.chance_move.uci() if l.chance_move else None,
        "label": l.label(), "facts": facts(l), "hints": hints(l), "template": template_explanation(l),
        "recentUserMoves": [label for _, label in session.recent_user_moves(l)],
    }


def events_json(events) -> list:
    return [{"kind": e.kind, "lessonId": e.lesson.id, "text": e.text} for e in events]


def record_game(game_no: int, args, analyst: Engine, weak: Engine, student: Engine) -> dict:
    color = chess.WHITE if game_no % 2 == 0 else chess.BLACK
    calls = {"analyst": [], "weak": []}
    a, w = RecordingEngine(analyst, calls["analyst"]), RecordingEngine(weak, calls["weak"])
    cfg = Config()
    session = Session(color, a, TeachingOpponent(w, a), cfg)
    steps = []
    while not session.board.is_game_over() and session.board.fullmove_number <= args.max_moves:
        if session.board.turn == color:
            steps.append({"type": "startUserTurn", "events": events_json(session.start_user_turn())})
            move = student.play(session.board, args.student_time)
            steps.append({"type": "userMove", "move": move.uci(), "events": events_json(session.user_move(move))})
        else:
            move, mode, events = session.opponent_move()
            steps.append({"type": "opponentMove", "move": move.uci(), "mode": mode, "events": events_json(events)})
    session.finish()
    return {
        "game": game_no, "userColour": "w" if color else "b", "depth": analyst.depth,
        "config": {"threshold": cfg.threshold, "stillWinning": cfg.still_winning, "hopeless": cfg.hopeless,
                   "linePlies": cfg.line_plies, "expiryMoves": cfg.expiry_moves, "causeWindow": cfg.cause_window,
                   "levelUp": cfg.level_up, "easy": cfg.easy},
        "steps": steps, "engineCalls": calls,
        "lessons": [lesson_dict(session, l) for l in session.lessons],
        "finalFen": session.board.fen(),
    }


def record_features(games: list[dict], out: Path) -> None:
    """Raw feature measurements on many positions, for exact feature parity."""
    fens = [p["fen"] for p in json.loads((Path(__file__).parent / "bench/data/positions.json").read_text())]
    for g in games:  # every third position of each recorded game
        board = chess.Board()
        for i, step in enumerate(s for s in g["steps"] if "move" in s):
            board.push(chess.Move.from_uci(step["move"]))
            if i % 3 == 0:
                fens.append(board.fen())
    with Engine(skill=1) as a, Engine(skill=1) as b:  # long games, for endgames
        for _ in range(3):
            board = chess.Board()
            while not board.is_game_over() and board.fullmove_number <= 120:
                board.push((a if board.turn else b).play(board, 0.01))
                if board.fullmove_number > 30 and board.ply() % 6 == 0:
                    fens.append(board.fen())
    rows = []
    for fen in fens:
        board = chess.Board(fen)
        row = {"fen": fen}
        for colour, c in (("w", chess.WHITE), ("b", chess.BLACK)):
            row[colour] = {
                "features": {k: [v, d] for k, (v, d) in measure_all(board, c).items()},
                "hanging": [chess.square_name(s) for s in hanging(board, c)],
                "settled": settled_balance(board, c),
            }
        rows.append(row)
    (out / "features.json").write_text(json.dumps(rows, indent=1))
    print(f"{out / 'features.json'}: {len(rows)} positions")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--games", type=int, default=6)
    ap.add_argument("--depth", type=int, default=10)
    ap.add_argument("--max-moves", type=int, default=40)
    ap.add_argument("--student-time", type=float, default=0.01)
    ap.add_argument("--out", default="tools/sim/fixtures")
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    games = []
    with Engine(depth=args.depth) as analyst, Engine(skill=3) as weak, Engine(skill=0) as student:
        for g in range(args.games):
            game = record_game(g, args, analyst, weak, student)
            games.append(game)
            path = out / f"game-{g + 1:02d}.json"
            path.write_text(json.dumps(game, indent=1))
            print(f"{path}: {len(game['steps'])} steps, {len(game['lessons'])} lessons, "
                  f"{sum(len(v) for v in game['engineCalls'].values())} engine calls")
    record_features(games, out)


if __name__ == "__main__":
    main()
