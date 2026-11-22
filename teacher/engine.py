"""Thin wrapper around a UCI engine (Stockfish) via python-chess."""

from __future__ import annotations

import os
import shutil
from dataclasses import dataclass, field

import chess
import chess.engine

MATE_SCORE = 10_000


def find_stockfish() -> str:
    for candidate in (
        os.environ.get("STOCKFISH_PATH"),
        shutil.which("stockfish"),
        "/usr/games/stockfish",
        "/opt/homebrew/bin/stockfish",
        "/usr/local/bin/stockfish",
    ):
        if candidate and os.path.exists(candidate):
            return candidate
    raise RuntimeError(
        "Stockfish not found. Install it (e.g. `apt install stockfish` or "
        "`brew install stockfish`) or set STOCKFISH_PATH."
    )


@dataclass
class Candidate:
    move: chess.Move
    score: int  # centipawns from the point of view of the side to move
    pv: list[chess.Move] = field(default_factory=list)


class Engine:
    """A Stockfish process. `skill` (0-20) weakens it; None means full strength."""

    def __init__(self, path: str | None = None, depth: int = 12, skill: int | None = None):
        self._engine = chess.engine.SimpleEngine.popen_uci(path or find_stockfish())
        options: dict = {"Threads": 1}
        if skill is not None:
            options["Skill Level"] = skill
        self._engine.configure(options)
        self.depth = depth

    def analyse(self, board: chess.Board, multipv: int = 1, depth: int | None = None) -> list[Candidate]:
        if board.is_game_over():
            return []
        infos = self._engine.analyse(
            board, chess.engine.Limit(depth=depth or self.depth), multipv=multipv
        )
        if isinstance(infos, dict):
            infos = [infos]
        out = []
        for info in infos:
            pv = info.get("pv") or []
            if not pv or "score" not in info:
                continue
            score = info["score"].pov(board.turn).score(mate_score=MATE_SCORE)
            out.append(Candidate(pv[0], max(-MATE_SCORE, min(MATE_SCORE, score)), list(pv)))
        return out

    def play(self, board: chess.Board, time: float = 0.05) -> chess.Move:
        return self._engine.play(board, chess.engine.Limit(time=time)).move

    def close(self) -> None:
        try:
            self._engine.quit()
        except chess.engine.EngineTerminatedError:
            pass

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()
