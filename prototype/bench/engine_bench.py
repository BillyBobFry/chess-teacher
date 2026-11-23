#!/usr/bin/env python3
"""Benchmark the engine work the teacher does per user move, across engine builds.

Per user move the teacher runs two analyses: the position before the move (MultiPV 3,
to find the best moves) and the position after it (MultiPV 1). This script times that
workload on a fixed set of positions for each engine build, plus engine start-up time.

Engines are any UCI command, e.g. native Stockfish or `node stockfish-19-lite-single.js`.

Usage:
  python bench/engine_bench.py --engine native=/usr/games/stockfish \
      --engine wasm-lite="node path/to/stockfish-19-lite-single.js"
"""

from __future__ import annotations

import argparse
import json
import shlex
import statistics
import sys
import time
from pathlib import Path

import chess
import chess.engine

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from teacher.engine import Engine  # noqa: E402

HERE = Path(__file__).resolve().parent
POSITIONS = HERE / "data" / "positions.json"


def make_positions(n_games: int = 4, per_game: int = 12) -> list[dict]:
    """Positions from weak-vs-weak engine games, spread across each game."""
    out = []
    with Engine(skill=0) as a, Engine(skill=3) as b:
        for g in range(n_games):
            board = chess.Board()
            fens = []
            while not board.is_game_over() and board.fullmove_number <= 60:
                fens.append(board.fen())
                board.push((a if board.turn == chess.WHITE else b).play(board, 0.01))
            step = max(1, len(fens) // per_game)
            for i, fen in enumerate(fens[::step][:per_game]):
                phase = "opening" if chess.Board(fen).fullmove_number <= 10 else (
                    "endgame" if len(chess.Board(fen).piece_map()) <= 12 else "middlegame")
                out.append({"fen": fen, "phase": phase, "game": g})
    return out


def bench_engine(name: str, cmd: list[str], positions: list[dict], depth: int, threads: int) -> dict:
    t0 = time.perf_counter()
    engine = chess.engine.SimpleEngine.popen_uci(cmd, timeout=120)
    opts = {"Threads": threads} if "Threads" in engine.options else {}
    engine.configure(opts)
    engine.ping()
    startup = time.perf_counter() - t0
    engine.analyse(chess.Board(), chess.engine.Limit(depth=8))  # warm-up (loads the net)

    per_move, by_phase = [], {}
    for p in positions:
        board = chess.Board(p["fen"])
        t = time.perf_counter()
        info = engine.analyse(board, chess.engine.Limit(depth=depth), multipv=3)
        best = info[0]["pv"][0]
        board.push(best)  # stand-in for the user's move
        if not board.is_game_over():
            engine.analyse(board, chess.engine.Limit(depth=depth))
        dt = time.perf_counter() - t
        per_move.append(dt)
        by_phase.setdefault(p["phase"], []).append(dt)
    engine.quit()
    return {
        "engine": name, "depth": depth, "threads": threads, "startup_s": round(startup, 3),
        "positions": len(per_move),
        "mean_ms": round(1000 * statistics.mean(per_move)),
        "median_ms": round(1000 * statistics.median(per_move)),
        "p90_ms": round(1000 * sorted(per_move)[int(0.9 * len(per_move)) - 1]),
        "max_ms": round(1000 * max(per_move)),
        "by_phase_mean_ms": {k: round(1000 * statistics.mean(v)) for k, v in by_phase.items()},
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--engine", action="append", required=True, help="name=command")
    ap.add_argument("--depth", type=int, action="append", help="analysis depth(s); default 10 and 12")
    ap.add_argument("--threads", type=int, default=1)
    ap.add_argument("--moves-per-game", type=int, default=30, help="user moves per game, for per-game totals")
    ap.add_argument("--out", default=str(HERE / "results" / "engine.json"))
    args = ap.parse_args()

    if not POSITIONS.exists():
        POSITIONS.parent.mkdir(parents=True, exist_ok=True)
        POSITIONS.write_text(json.dumps(make_positions(), indent=1))
    positions = json.loads(POSITIONS.read_text())
    print(f"{len(positions)} positions ({', '.join(f'{k}: {v}' for k, v in sorted(_count(positions).items()))})")

    results = []
    for spec in args.engine:
        name, cmd = spec.split("=", 1)
        for depth in args.depth or [10, 12]:
            r = bench_engine(name, shlex.split(cmd), positions, depth, args.threads)
            r["cpu_s_per_game"] = round(r["mean_ms"] * args.moves_per_game / 1000, 1)
            results.append(r)
            print(f"{name:<12} depth {depth:<3} start-up {r['startup_s']:>6.2f}s   per user move: "
                  f"median {r['median_ms']:>5}ms  p90 {r['p90_ms']:>5}ms  max {r['max_ms']:>5}ms   "
                  f"≈{r['cpu_s_per_game']}s per {args.moves_per_game}-move game   {r['by_phase_mean_ms']}",
                  flush=True)
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(results, indent=2))


def _count(positions):
    c = {}
    for p in positions:
        c[p["phase"]] = c.get(p["phase"], 0) + 1
    return c


if __name__ == "__main__":
    main()
