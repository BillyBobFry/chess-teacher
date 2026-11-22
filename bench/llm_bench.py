#!/usr/bin/env python3
"""Benchmark LLM explanations: tokens, cost, latency and guardrail pass rate per model.

Sends the same lesson facts (from a simulation run) to each model with the same prompt
the app uses, then projects cost per game and per user per month.

Usage:
  python simulate.py --games 8 --out bench/data        # produces lessons with facts
  python bench/llm_bench.py --lessons 12               # needs Anthropic API credentials
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
import time
from pathlib import Path

import anthropic

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from teacher.explain import SQUARE_RE, SYSTEM_PROMPT  # noqa: E402

HERE = Path(__file__).resolve().parent

# USD per million tokens (input, output). Thinking tokens are billed as output.
PRICES = {
    "claude-haiku-5-5": (0.10, 0.50),
    "claude-sonnet-5-5": (2.00, 10.00),
    "claude-opus-5-5": (4.00, 20.00),
}
# Models that support server-side refusal fallbacks.
FALLBACK_MODELS = {"claude-sonnet-5-5", "claude-opus-5-5"}


def call(client: anthropic.Anthropic, model: str, effort: str, fact_json: str) -> dict:
    kwargs = dict(
        model=model,
        max_tokens=4000,
        output_config={"effort": effort},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": f"Facts about the mistake:\n{fact_json}"}],
    )
    if model in FALLBACK_MODELS:
        kwargs.update(betas=["server-side-fallback-2026-07-01"], fallbacks="default")
    t = time.perf_counter()
    response = client.beta.messages.create(**kwargs)
    latency = time.perf_counter() - t
    text = "".join(b.text for b in response.content if b.type == "text").strip()
    invented = sorted(set(SQUARE_RE.findall(text)) - set(SQUARE_RE.findall(fact_json)))
    return {
        "latency_s": round(latency, 2),
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
        "stop_reason": response.stop_reason,
        "served_by": response.model,
        "guardrail_ok": bool(text) and not invented and response.stop_reason != "refusal",
        "invented_squares": invented,
        "words": len(text.split()),
        "text": text,
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data", default=str(HERE / "data" / "simulation.json"))
    ap.add_argument("--models", nargs="+", default=list(PRICES))
    ap.add_argument("--effort", default="low")
    ap.add_argument("--lessons", type=int, default=12, help="lessons to send to each model")
    ap.add_argument("--base-url", default="https://api.anthropic.com",
                    help="API endpoint (explicit, so a proxy set in ANTHROPIC_BASE_URL isn't used by accident)")
    ap.add_argument("--out", default=str(HERE / "results"))
    args = ap.parse_args()

    runs = json.loads(Path(args.data).read_text())
    games = runs["teaching opponent"]
    lessons = [l for g in games for l in g["lessons"]]
    lessons_per_game = len(lessons) / len(games)
    # Spread the sample across factors rather than taking the first N.
    lessons.sort(key=lambda l: (l["feature"] == "material", l["game"]))
    sample = lessons[:: max(1, len(lessons) // args.lessons)][: args.lessons]

    client = anthropic.Anthropic(base_url=args.base_url)
    results: dict[str, list[dict]] = {}
    for model in args.models:
        results[model] = []
        for i, l in enumerate(sample, 1):
            fact_json = json.dumps(l["facts"], indent=2)
            try:
                r = call(client, model, args.effort, fact_json)
            except anthropic.AuthenticationError:
                sys.exit("Authentication failed: set ANTHROPIC_API_KEY (or log in with `ant auth login`).")
            except anthropic.RateLimitError:
                time.sleep(10)
                r = call(client, model, args.effort, fact_json)
            except anthropic.APIStatusError as e:
                print(f"  {model} lesson {i}: API error {e.status_code}: {e.message}")
                continue
            r.update(lesson=f"game {l['game'] + 1}, {l['move']} ({l['feature']})", template=l["explanation"])
            results[model].append(r)
            print(f"{model:<18} {i:>2}/{len(sample)}  {r['latency_s']:>5.1f}s  "
                  f"in {r['input_tokens']:>4}  out {r['output_tokens']:>4}  "
                  f"{'ok' if r['guardrail_ok'] else 'REJECTED ' + str(r['invented_squares'])}", flush=True)

    rows = []
    for model, rs in results.items():
        if not rs:
            continue
        pin, pout = PRICES[model]
        cost = [(r["input_tokens"] * pin + r["output_tokens"] * pout) / 1e6 for r in rs]
        per_lesson = statistics.mean(cost)
        per_game = per_lesson * lessons_per_game
        rows.append({
            "model": model, "effort": args.effort, "n": len(rs),
            "mean_input_tokens": round(statistics.mean(r["input_tokens"] for r in rs)),
            "mean_output_tokens": round(statistics.mean(r["output_tokens"] for r in rs)),
            "median_latency_s": round(statistics.median(r["latency_s"] for r in rs), 1),
            "p90_latency_s": round(sorted(r["latency_s"] for r in rs)[int(0.9 * len(rs)) - 1], 1),
            "guardrail_pass": f"{sum(r['guardrail_ok'] for r in rs)}/{len(rs)}",
            "usd_per_lesson": per_lesson, "usd_per_game": per_game,
            "usd_per_user_month": {n: per_game * n for n in (10, 30, 100)},
        })

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "llm.json").write_text(json.dumps({"summary": rows, "results": results}, indent=2))
    md = ["# LLM explanation benchmark", "",
          f"{len(sample)} lessons per model, effort `{args.effort}`. "
          f"Projected with {lessons_per_game:.1f} explained lessons per game "
          "(every lesson gets explained, during the game or in the review).", "",
          "| Model | In tok | Out tok | Latency (median / p90) | Guardrail | $/lesson | $/game "
          "| $/user/month at 10 · 30 · 100 games |",
          "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        m = r["usd_per_user_month"]
        md.append(f"| {r['model']} | {r['mean_input_tokens']} | {r['mean_output_tokens']} | "
                  f"{r['median_latency_s']}s / {r['p90_latency_s']}s | {r['guardrail_pass']} | "
                  f"{r['usd_per_lesson']:.4f} | {r['usd_per_game']:.3f} | "
                  f"{m[10]:.2f} · {m[30]:.2f} · {m[100]:.2f} |")
    md += ["", "## Side-by-side explanations", ""]
    for i, l in enumerate(sample):
        md += [f"### {i + 1}. Game {l['game'] + 1}, {l['move']} ({l['feature']})", "",
               "**Template:**", "", "```", l["explanation"], "```", ""]
        for model, rs in results.items():
            match = [r for r in rs if r["lesson"].startswith(f"game {l['game'] + 1}, {l['move']} ")]
            if match:
                r = match[0]
                flag = "" if r["guardrail_ok"] else f" — REJECTED (invented {', '.join(r['invented_squares'])})"
                md += [f"**{model}**{flag}:", "", "> " + r["text"].replace("\n", "\n> "), ""]
    (out / "llm.md").write_text("\n".join(md))
    print("\n".join(md[:8 + len(rows)]))
    print(f"\nFull report: {out / 'llm.md'}")


if __name__ == "__main__":
    main()
