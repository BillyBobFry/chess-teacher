#!/usr/bin/env python3
"""Play against the teaching opponent in the terminal.

Enter moves in standard notation (Nf3, exd5, O-O) or as coordinates (g1f3).
Commands: board, moves, help, quit.
"""

from __future__ import annotations

import argparse

import chess

from teacher.engine import Engine
from teacher.explain import explain, hints
from teacher.lessons import CONSEQUENCE, Config, Lesson
from teacher.opponent import TeachingOpponent
from teacher.principles import PRINCIPLES
from teacher.session import Session

RULE = "─" * 64


def render(board: chess.Board, color: chess.Color, ascii_only: bool) -> str:
    if ascii_only:
        rows = str(board).splitlines()
        ranks = list(range(8, 0, -1))
        if color == chess.BLACK:
            rows = [r[::-1] for r in reversed(rows)]
            ranks = ranks[::-1]
        files = "a b c d e f g h" if color == chess.WHITE else "h g f e d c b a"
        return "\n".join(f"{n} {r}" for n, r in zip(ranks, rows)) + f"\n  {files}"
    return board.unicode(borders=True, empty_square="·", orientation=color)


def side_by_side(left: str, right: str, titles: tuple[str, str]) -> str:
    l, r = left.splitlines(), right.splitlines()
    w = max(len(x) for x in l + [titles[0]])
    out = [f"{titles[0]:<{w}}    {titles[1]}"]
    out += [f"{a:<{w}}    {b}" for a, b in zip(l, r)]
    return "\n".join(out)


def end_of_line(lesson: Lesson, line: list[chess.Move]) -> chess.Board:
    b = lesson.board_before.copy()
    for m in line:
        b.push(m)
    return b


def ask(prompt: str) -> str:
    try:
        return input(prompt).strip()
    except EOFError:
        return "quit"


def read_move(board: chess.Board) -> chess.Move | None:
    while True:
        text = ask("Your move: ")
        if text in ("quit", "exit", "resign"):
            return None
        if text == "help":
            print(__doc__)
            continue
        if text == "moves":
            print(" ".join(sorted(board.san(m) for m in board.legal_moves)))
            continue
        if text == "board":
            return chess.Move.null()
        try:
            return board.parse_san(text)
        except ValueError:
            pass
        try:
            move = chess.Move.from_uci(text)
            if move in board.legal_moves:
                return move
        except ValueError:
            pass
        print("Not a legal move. Type 'moves' to see your options.")


def reveal(session: Session, lesson: Lesson, args) -> bool:
    """The find-the-cause flow. Returns True if the user wants to rewind."""
    print(f"\n{RULE}")
    if lesson.kind == CONSEQUENCE:
        print(f"⚠  {lesson.trigger_text}")
    else:
        print("⏳ The chance has gone: a few moves ago you had a clearly better option.")
    options = session.recent_user_moves(lesson)
    print("The cause was one of your recent moves. Can you find it?")
    for i, (_, label) in enumerate(options, 1):
        print(f"   {i}) {label}")

    found = False
    hint_list = hints(lesson)
    for attempt in range(3):
        answer = ask("Your answer (number, or Enter to see the answer): ")
        if not answer or answer == "quit":
            break
        if answer.isdigit() and 1 <= int(answer) <= len(options) and options[int(answer) - 1][0] == lesson.ply:
            print("✓ Yes, that's the one.")
            found = True
            break
        print("Not that one.")
        if attempt < len(hint_list):
            print(f"Hint: {hint_list[attempt]}")
    lesson.found_cause = found

    text, source = explain(lesson, args.llm)
    lesson.explanation = text
    print(f"\n{text}\n")
    print(side_by_side(
        render(end_of_line(lesson, lesson.user_line), session.user_color, args.ascii),
        render(end_of_line(lesson, lesson.best_line), session.user_color, args.ascii),
        ("After what you played", "After the better move"),
    ))
    if args.verbose:
        print(f"[explanation: {source}; eval gap {lesson.gap}cp; feature {lesson.feature}]")
    print(RULE)
    return ask(f"Rewind to before {lesson.label()} and try again? [y/N] ").lower().startswith("y")


def review(session: Session, args) -> None:
    lessons = [l for l in session.lessons if l.status != "rewound"]
    print(f"\n{RULE}\nPOST-GAME REVIEW\n{RULE}")
    if not lessons:
        print("No clear mistakes found. Well played!")
        return
    for l in lessons:
        p = PRINCIPLES[l.principle].title
        if l.status == "fixed":
            status = "you fixed it in time ✓"
        elif l.status == "triggered" and not l.deferred:
            status = "found it yourself ✓" if l.found_cause else "revealed during the game"
        elif l.status == "triggered":
            status = "happened at the same time as another lesson"
        elif l.status == "superseded":
            status = "overtaken by a later mistake of the same kind"
        elif l.kind == CONSEQUENCE:
            status = "you got away with it (a stronger player would have punished it)"
        else:
            status = "missed chance"
        print(f"• {l.label():<14} {p:<40} {status}")
    pending_text = [l for l in lessons if l.status in ("expired", "superseded") or l.deferred]
    for l in pending_text:
        text, _ = explain(l, args.llm)
        print(f"\n{l.label()} — {PRINCIPLES[l.principle].title}\n{text}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--color", choices=["white", "black"], default="white")
    ap.add_argument("--opponent-skill", type=int, default=3, help="Stockfish skill level 0-20 in normal mode")
    ap.add_argument("--depth", type=int, default=12, help="analysis depth")
    ap.add_argument("--easy", action="store_true", help="warn when the opponent has spotted a weakness")
    ap.add_argument("--no-level-up", action="store_true", help="opponent never levels up (test mode)")
    ap.add_argument("--llm", action="store_true", help="use Claude for explanations (needs ANTHROPIC_API_KEY)")
    ap.add_argument("--ascii", action="store_true", help="plain ASCII board")
    ap.add_argument("-v", "--verbose", action="store_true", help="show opponent mode and analysis details")
    args = ap.parse_args()

    user = chess.WHITE if args.color == "white" else chess.BLACK
    cfg = Config(easy=args.easy, level_up=not args.no_level_up)
    with Engine(depth=args.depth) as analyst, Engine(skill=args.opponent_skill) as weak:
        session = Session(user, analyst, TeachingOpponent(weak, analyst), cfg)
        print("Chess Teacher prototype. Type 'help' for commands.")
        print(render(session.board, user, args.ascii))
        while not session.board.is_game_over():
            board = session.board
            if board.turn == user:
                rewound = False
                for ev in session.start_user_turn():
                    if ev.kind == "chance_gone" and reveal(session, ev.lesson, args):
                        session.rewind(ev.lesson)
                        rewound = True
                        break
                if rewound:
                    print(render(session.board, user, args.ascii))
                    continue
                move = read_move(session.board)
                if move is None:
                    break
                if move == chess.Move.null():
                    print(render(session.board, user, args.ascii))
                    continue
                for ev in session.user_move(move):
                    if ev.kind == "fixed":
                        l = ev.lesson
                        if l.kind == CONSEQUENCE:
                            print(f"✓ Nice! Your move {l.label()} had left a weakness, and you fixed it before it cost you.")
                        else:
                            print(f"✓ Nice! You found the better idea you missed with {l.label()}.")
                    elif ev.kind == "warning":
                        print(f"👀 {ev.text}")
                    elif ev.kind == "created" and args.verbose:
                        print(f"[lesson #{ev.lesson.id} recorded: {ev.lesson.kind}, {ev.lesson.feature}]")
            else:
                move, mode, events = session.opponent_move()
                b = session.board.copy()
                b.pop()
                tag = " [levelled up]" if args.verbose and mode == "levelled" else ""
                print(f"\nOpponent plays {b.san(move)}{tag}")
                print(render(session.board, user, args.ascii))
                shown = [e for e in events if e.kind == "triggered" and not e.lesson.deferred]
                if shown and reveal(session, shown[0].lesson, args):
                    session.rewind(shown[0].lesson)
                    print(render(session.board, user, args.ascii))
        if session.board.is_game_over():
            print(f"\nGame over: {session.board.result()}")
        session.finish()
        review(session, args)


if __name__ == "__main__":
    main()
