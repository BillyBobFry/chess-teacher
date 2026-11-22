#!/usr/bin/env python3
"""Export every lesson from a simulation run into a gradeable Markdown file.

Usage: python scripts/export_lessons.py [reports/simulation.json] [reports/all-lessons.md]
"""

from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from teacher.principles import PRINCIPLES  # noqa: E402

STATUS = {
    "triggered": "revealed during the game",
    "fixed": "student fixed it in time",
    "expired": "never punished (would be in the review)",
    "superseded": "overtaken by a later mistake of the same kind",
    "rewound": "rewound",
}


def main() -> None:
    src = Path(sys.argv[1] if len(sys.argv) > 1 else "reports/simulation.json")
    dst = Path(sys.argv[2] if len(sys.argv) > 2 else "reports/all-lessons.md")
    runs = json.loads(src.read_text())

    md = [
        "# All lessons", "",
        f"Every lesson from `{src}`, grouped by run and then by the factor that was used to explain it.",
        "",
        "For each lesson, judge: **is the explanation the real reason the better move was better?**",
        "Tick one box per lesson. Material lessons should almost always be right; the strategic",
        "ones are what we most need graded.", "",
        "Contents:", "",
    ]
    body: list[str] = []
    for run, games in runs.items():
        lessons = [l for g in games for l in g["lessons"]]
        by_feature: dict[str, list[dict]] = defaultdict(list)
        for l in lessons:
            by_feature[l["feature"]].append(l)
        md.append(f"- **{run}**: {len(lessons)} lessons — " + ", ".join(
            f"{f} ({len(ls)})" for f, ls in sorted(by_feature.items(), key=lambda kv: -len(kv[1]))))
        body += ["", "---", "", f"## {run} ({len(lessons)} lessons)"]
        for feature, ls in sorted(by_feature.items(), key=lambda kv: -len(kv[1])):
            body += ["", f"### {feature} ({len(ls)})"]
            for l in sorted(ls, key=lambda l: (l["game"], l["move"])):
                principle = PRINCIPLES[l["principle"]].title
                body += [
                    "", f"#### Game {l['game'] + 1}, {l['move']} ({l['colour']}) — {l['kind'].replace('_', ' ')}", "",
                    f"- **Outcome:** {STATUS.get(l['status'], l['status'])}"
                    + (f", {l['delay_moves']:g} move(s) after the mistake" if l["status"] == "triggered" and l["delay_moves"] else ""),
                    f"- **What happened in the game:** {l['trigger_text'] or '—'}",
                    f"- **Eval gap:** {l['gap_cp'] / 100:.1f} pawns · **Principle:** {principle}", "",
                    "```", l["explanation"], "```", "",
                    "Grade: ☐ right ☐ partly right ☐ wrong reason — notes:", "",
                ]
    dst.write_text("\n".join(md + body) + "\n")
    print(f"Wrote {sum(len(g['lessons']) for gs in runs.values() for g in gs)} lessons to {dst}")


if __name__ == "__main__":
    main()
