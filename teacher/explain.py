"""Turn a lesson's measured facts into words.

The template explanation always works. The LLM explanation is optional: it is
given only the structured facts, and its output is rejected (falling back to the
template) if it mentions any square that isn't in those facts.
"""

from __future__ import annotations

import json
import re

import chess

from .features import PIECE_NAMES
from .lessons import CONSEQUENCE, MATE_FEATURE, Lesson
from .principles import PRINCIPLES

FEATURE_LABELS = {
    "material": "material", "development": "development", "king_safety": "king safety",
    "centre": "control of the centre", "mobility": "piece activity", "own_pawns": "your pawn structure",
    "their_pawns": "your opponent's pawn weaknesses", "passed_pawns": "passed pawns",
    "outposts": "knight outposts", "open_files": "rooks on open files", "king_activity": "king activity",
    MATE_FEATURE: "king safety",
}


def facts(lesson: Lesson) -> dict:
    p = PRINCIPLES[lesson.principle]
    div = lesson.divergence
    return {
        "move_number": lesson.move_number,
        "player_colour": "white" if lesson.user_color == chess.WHITE else "black",
        "you_played": lesson.user_san,
        "better_was": lesson.best_san,
        "your_line": lesson.line_san(lesson.user_line),
        "better_line": lesson.line_san(lesson.best_line),
        "evaluation_cost_in_pawns": round(lesson.gap / 100, 1),
        "lesson_type": "something went wrong because of this move" if lesson.kind == CONSEQUENCE
        else "a better opportunity was missed",
        "what_happened_in_the_game": lesson.trigger_text,
        "key_factor": FEATURE_LABELS[lesson.feature],
        "before_your_move": lesson.baseline_detail,
        "end_of_your_line": lesson.user_detail,
        "end_of_better_line": lesson.best_detail,
        "lines_diverge_after_ply": div + 1,
        "pieces_left_undefended_by_your_move": [
            f"{PIECE_NAMES[lesson.board_before.piece_type_at(s) or chess.PAWN]} on {chess.square_name(s)}"
            for s in lesson.hanging_after if s != lesson.user_move.to_square
        ] + ([f"the piece you moved, now on {chess.square_name(lesson.user_move.to_square)}"]
             if lesson.user_move.to_square in lesson.hanging_after else []),
        "principle": {"title": p.title, "explanation": p.text},
    }


def hints(lesson: Lesson) -> list[str]:
    piece = lesson.board_before.piece_type_at(lesson.user_move.from_square)
    first = ("It was when you castled." if lesson.board_before.is_castling(lesson.user_move)
             else f"It was a {PIECE_NAMES[piece]} move.")
    return [
        first,
        f"Look at move {lesson.move_number}, when you played {lesson.user_san}.",
    ]


def template_explanation(lesson: Lesson) -> str:
    p = PRINCIPLES[lesson.principle]
    f = FEATURE_LABELS[lesson.feature]
    lines = [
        f"On move {lesson.move_number} you played {lesson.user_san}. {lesson.best_san} was better.",
        "",
        f"  What you played:  {lesson.line_san(lesson.user_line)}",
        f"  What was better:  {lesson.line_san(lesson.best_line)}",
        "",
    ]
    if lesson.feature == MATE_FEATURE:
        lines.append("After your move, your opponent had a forced checkmate.")
    elif lesson.kind == CONSEQUENCE:
        lines.append(f"The difference is {f}. Before your move: {lesson.baseline_detail}.")
        lines.append(f"After your line: {lesson.user_detail}. After the better line: {lesson.best_detail}.")
    else:
        lines.append(f"Your move wasn't a disaster, but {lesson.best_san} would have improved {f}.")
        lines.append(f"After the better line: {lesson.best_detail}. After yours: {lesson.user_detail}.")
    undefended = facts(lesson)["pieces_left_undefended_by_your_move"]
    if lesson.principle == "hanging" and undefended:
        lines.append(f"Your move left this undefended: {', '.join(undefended)}.")
    lines += ["", f"Principle: {p.title}. {p.text}"]
    return "\n".join(lines)


# --------------------------------------------------------------------------- optional LLM

SYSTEM_PROMPT = """You are a friendly chess coach. Your student knows how the pieces move but \
not the strategy. You will receive facts about one of their mistakes. A chess engine and \
measuring code produced every fact, and they are correct.

Write a short explanation (under 120 words) in plain English:
1. what their move allowed, or what it missed,
2. why the better move was better, using the measured factor,
3. the principle to remember, in one sentence.

Use only the facts given. Do not analyse the position yourself, and do not mention any \
move or square that does not appear in the facts. If the facts don't say why something \
happened, don't guess."""

SQUARE_RE = re.compile(r"\b[a-h][1-8]\b")


def llm_explanation(lesson: Lesson, model: str = "claude-opus-5-5") -> tuple[str | None, str]:
    """Returns (text, status). text is None when we should fall back to the template."""
    try:
        import anthropic
    except ImportError:
        return None, "anthropic package not installed"

    fact_json = json.dumps(facts(lesson), indent=2)
    try:
        client = anthropic.Anthropic()
        response = client.beta.messages.create(
            model=model,
            max_tokens=2000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            output_config={"effort": "low"},
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": f"Facts about the mistake:\n{fact_json}"}],
        )
    except anthropic.AuthenticationError:
        return None, "no valid Anthropic credentials"
    except anthropic.APIConnectionError:
        return None, "could not reach the Anthropic API"
    except anthropic.APIStatusError as e:
        return None, f"API error {e.status_code}"
    except TypeError as e:  # no credentials configured at all
        return None, f"client not configured ({e})"

    if response.stop_reason == "refusal":
        return None, "model declined"
    text = "".join(b.text for b in response.content if b.type == "text").strip()
    if not text:
        return None, "empty response"

    # Guardrail: every square the LLM mentions must appear in the facts.
    allowed = set(SQUARE_RE.findall(fact_json))
    invented = set(SQUARE_RE.findall(text)) - allowed
    if invented:
        return None, f"rejected: mentioned squares not in the facts ({', '.join(sorted(invented))})"
    return text, "ok"


def explain(lesson: Lesson, use_llm: bool = False) -> tuple[str, str]:
    if use_llm:
        text, status = llm_explanation(lesson)
        if text:
            p = PRINCIPLES[lesson.principle]
            return (
                f"{text}\n\n  What you played:  {lesson.line_san(lesson.user_line)}"
                f"\n  What was better:  {lesson.line_san(lesson.best_line)}\n\nPrinciple: {p.title}.",
                "llm",
            )
        return template_explanation(lesson), f"template (LLM unavailable: {status})"
    return template_explanation(lesson), "template"

