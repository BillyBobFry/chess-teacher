# Benchmarks

Cost and speed measurements to inform hosting and pricing. They use the Python
prototype, which does the same work per move as the planned TypeScript app.

## Engine (`engine_bench.py`)

Times the engine work per user move (analysis of the position before the move with
MultiPV 3, plus the position after it) on 48 fixed positions from beginner-level games
(`data/positions.json`).

```bash
npm install stockfish            # WebAssembly builds, in node_modules/stockfish/bin
.venv/bin/python bench/engine_bench.py \
  --engine native=/usr/games/stockfish \
  --engine "wasm-lite=node node_modules/stockfish/bin/stockfish-19-lite-single.js" \
  --engine "wasm-full=node node_modules/stockfish/bin/stockfish-19-single.js"
```

Results (Nov 2026, 1 thread on a cloud container CPU; native is Stockfish 16, WASM is 19):

| Engine | Download | Start-up | Per user move, depth 10 (median / p90) | Depth 12 (median / p90) | CPU per 30-move game (depth 12) |
|---|---|---|---|---|---|
| Native Stockfish | — | 0.16 s | 45 / 116 ms | 101 / 232 ms | ~3.8 s |
| WASM lite | 1.7 MB | 0.15 s | 48 / 120 ms | 139 / 282 ms | ~4.7 s |
| WASM full | 99 MB | 0.86 s | 67 / 213 ms | 233 / 493 ms | ~8.0 s |

Not included: the opponent's own moves (~0.05 s each in normal mode) and the teaching
code (feature measurement), which will be faster in TypeScript than in Python.
Phones will be slower than this CPU; measure on real devices before choosing a depth.

## LLM explanations (`llm_bench.py`)

Sends the same lesson facts to Haiku 5.5, Sonnet 5.5 and Opus 5.5 with the app's prompt,
and reports tokens, latency, guardrail pass rate, cost per lesson / game / user-month,
plus every explanation side by side with the template for a quality comparison.

```bash
.venv/bin/python simulate.py --games 8 --out bench/data   # lessons with facts (already committed)
ANTHROPIC_API_KEY=... .venv/bin/python bench/llm_bench.py --lessons 12
```

Writes `results/llm.md` and `results/llm.json`. Costs a few cents to a few tens of cents per run.
