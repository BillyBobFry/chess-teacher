#!/usr/bin/env python3
"""Simulate games between a weak 'student' engine and the teaching opponent.

This tests the riskiest part of the concept without a human in the loop:
  * How many mistakes become lessons, and of which kinds?
  * Do predicted consequences actually land in the real game?
  * Does levelling the opponent up make them land more often?
  * How long after the mistake do they land?

Writes reports/simulation.md (summary + sample explanations) and reports/simulation.json.
"""

from __future__ import annotations

import argparse
import json
import statistics
import time
from collections import Counter
from pathlib import Path

import chess

from teacher.engine import Engine
from teacher.explain import explain, facts
from teacher.lessons import CONSEQUENCE, MISSED_CHANCE, Config
from teacher.opponent import TeachingOpponent
from teacher.principles import PRINCIPLES
from teacher.session import Session


def play_game(game_no: int, level_up: bool, args, analyst: Engine, weak: Engine, student: Engine) -> dict:
    color = chess.WHITE if game_no % 2 == 0 else chess.BLACK
    session = Session(color, analyst, TeachingOpponent(weak, analyst), Config(level_up=level_up))
    triggered_events = 0
    while not session.board.is_game_over() and session.board.fullmove_number <= args.max_moves:
        if session.board.turn == color:
            for ev in session.start_user_turn():
                triggered_events += ev.kind == "chance_gone"
            session.user_move(student.play(session.board, args.student_time))
        else:
            _, _, events = session.opponent_move()
            triggered_events += sum(e.kind == "triggered" for e in events)
    session.finish()
    lessons = []
    for l in session.lessons:
        text, _ = explain(l)
        lessons.append({
            "game": game_no, "level_up": level_up, "colour": "white" if color else "black",
            "move": l.label(), "kind": l.kind, "feature": l.feature, "principle": l.principle,
            "status": l.status, "deferred": l.deferred, "gap_cp": l.gap,
            "delay_moves": None if l.resolved_ply is None else (l.resolved_ply - l.ply) / 2,
            "trigger_text": l.trigger_text, "explanation": text, "facts": facts(l),
        })
    return {
        "game": game_no, "level_up": level_up, "result": session.board.result(claim_draw=True),
        "user_colour": "white" if color else "black", "plies": session.board.ply(),
        "levelled_share": (session.opponent_modes.count("levelled") / len(session.opponent_modes))
        if session.opponent_modes else 0.0,
        "lessons": lessons,
    }


def summarise(games: list[dict]) -> dict:
    lessons = [l for g in games for l in g["lessons"]]
    cons = [l for l in lessons if l["kind"] == CONSEQUENCE]
    missed = [l for l in lessons if l["kind"] == MISSED_CHANCE]
    cons_triggered = [l for l in cons if l["status"] == "triggered"]
    delays = [l["delay_moves"] for l in cons_triggered if l["delay_moves"] is not None]
    plies = sum(g["plies"] for g in games)
    return {
        "games": len(games),
        "user_moves": plies // 2,
        "lessons": len(lessons),
        "lessons_per_game": round(len(lessons) / max(1, len(games)), 1),
        "consequence": len(cons),
        "consequence_status": dict(Counter(l["status"] for l in cons)),
        "consequence_trigger_rate": round(len(cons_triggered) / len(cons), 2) if cons else None,
        "median_delay_moves": statistics.median(delays) if delays else None,
        "max_delay_moves": max(delays) if delays else None,
        "missed_chance": len(missed),
        "missed_status": dict(Counter(l["status"] for l in missed)),
        "features": dict(Counter(l["feature"] for l in lessons).most_common()),
        "principles": dict(Counter(l["principle"] for l in lessons).most_common()),
        "levelled_share": round(statistics.mean(g["levelled_share"] for g in games), 2) if games else 0,
        "results": dict(Counter(g["result"] for g in games)),
    }


def write_report(out: Path, runs: dict[str, list[dict]], args, seconds: float) -> None:
    out.mkdir(parents=True, exist_ok=True)
    (out / "simulation.json").write_text(json.dumps(runs, indent=2))
    md = ["# Simulation report", "",
          f"{args.games} games per configuration. Student: Stockfish skill {args.student_skill} "
          f"({args.student_time}s/move). Opponent normal mode: Stockfish skill {args.opponent_skill}. "
          f"Analysis depth {args.depth}. Max {args.max_moves} moves per game. Took {seconds:.0f}s.", ""]
    summaries = {name: summarise(games) for name, games in runs.items()}
    keys = [
        ("lessons_per_game", "Lessons per game"),
        ("consequence", "Consequence lessons"),
        ("consequence_trigger_rate", "…of which landed in the real game"),
        ("median_delay_moves", "Median moves from mistake to consequence"),
        ("max_delay_moves", "Longest delay (moves)"),
        ("missed_chance", "Missed-chance lessons"),
        ("levelled_share", "Share of opponent moves levelled up"),
    ]
    names = list(summaries)
    md += ["| Metric | " + " | ".join(names) + " |", "|---|" + "---|" * len(names)]
    for k, label in keys:
        md.append(f"| {label} | " + " | ".join(str(summaries[n][k]) for n in names) + " |")
    for n in names:
        s = summaries[n]
        md += ["", f"## {n}", "",
               f"- Consequence lesson outcomes: {s['consequence_status']}",
               f"- Missed-chance outcomes: {s['missed_status']}",
               f"- Features: {s['features']}",
               f"- Principles: {', '.join(f'{PRINCIPLES[p].title} ({c})' for p, c in s['principles'].items())}",
               f"- Game results: {s['results']}"]
    sample_run = names[0]
    samples = [l for g in runs[sample_run] for l in g["lessons"] if l["status"] == "triggered"]
    seen, picked = set(), []
    for l in samples:  # prefer variety of features
        if l["feature"] not in seen:
            picked.append(l)
            seen.add(l["feature"])
    picked += [l for l in samples if l not in picked][: max(0, args.samples - len(picked))]
    md += ["", f"## Sample lessons ({sample_run})", "",
           "These are the template explanations; judge whether they're correct and useful.", ""]
    for l in picked[: args.samples]:
        md += [f"### Game {l['game']}, {l['move']} ({l['colour']}) — {l['feature']}, {l['kind']}", "",
               f"**What happened:** {l['trigger_text'] or '(chance gone)'}  ",
               f"**Delay:** {l['delay_moves']} moves; **eval gap:** {l['gap_cp']}cp", "",
               "```", l["explanation"], "```", ""]
    (out / "simulation.md").write_text("\n".join(md))
    print("\n".join(md[: 8 + 2 + len(keys)]))
    print(f"\nFull report: {out / 'simulation.md'}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--games", type=int, default=6)
    ap.add_argument("--student-skill", type=int, default=0)
    ap.add_argument("--student-time", type=float, default=0.01)
    ap.add_argument("--opponent-skill", type=int, default=3)
    ap.add_argument("--depth", type=int, default=10)
    ap.add_argument("--max-moves", type=int, default=50)
    ap.add_argument("--samples", type=int, default=8)
    ap.add_argument("--compare", action="store_true", help="also run with the level-up turned off")
    ap.add_argument("--out", default="reports")
    args = ap.parse_args()

    configs = {"teaching opponent": True}
    if args.compare:
        configs["no level-up (control)"] = False
    start = time.time()
    runs: dict[str, list[dict]] = {}
    with Engine(depth=args.depth) as analyst, Engine(skill=args.opponent_skill) as weak, \
            Engine(skill=args.student_skill) as student:
        for name, level_up in configs.items():
            runs[name] = []
            for g in range(args.games):
                result = play_game(g, level_up, args, analyst, weak, student)
                runs[name].append(result)
                print(f"[{name}] game {g + 1}/{args.games}: {result['result']}, "
                      f"{len(result['lessons'])} lessons", flush=True)
    write_report(Path(args.out), runs, args, time.time() - start)


if __name__ == "__main__":
    main()
