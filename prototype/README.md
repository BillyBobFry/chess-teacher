# Python prototype

The original prototype of the teaching loop. The strategic features in `packages/core` are
still tested against fixtures recorded from it (`record_fixtures.py`); lesson detection and
the session have moved on, so whole games no longer match. New work happens in TypeScript; this folder will be removed once
it's no longer needed for comparison or research.

## Setup

```bash
cd prototype
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Contents

| File | What |
|---|---|
| `teacher/` | The prototype's teaching logic |
| `play.py` | Play against the teaching opponent in the terminal |
| `simulate.py` | Simulated games and the report in `reports/` |
| `record_fixtures.py` | Records parity fixtures for the TypeScript port (run from the repo root) |
| `bench/` | Engine and LLM cost benchmarks (see `bench/README.md`) |
| `scripts/export_lessons.py` | Exports every simulated lesson to a gradeable Markdown file |
| `reports/` | Simulation reports and `all-lessons.md` |

Run these from inside `prototype/`, except `record_fixtures.py`, which is run from the
repository root.
