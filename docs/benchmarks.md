# Benchmarks

Measurements behind the engine decisions (D2, §6). They were taken with the Python
prototype's benchmark scripts, which were removed along with the prototype; the numbers
stay here as the record.

## Engine

The engine work per user move: analysis of the position before the move with MultiPV 3,
plus the position after it, on 48 fixed positions from beginner-level games.

Nov 2026, 1 thread on a cloud container CPU; native is Stockfish 16, WASM is 19:

| Engine           | Download | Start-up | Per user move, depth 10 (median / p90) | Depth 12 (median / p90) | CPU per 30-move game (depth 12) |
| ---------------- | -------- | -------- | -------------------------------------- | ----------------------- | ------------------------------- |
| Native Stockfish | n/a      | 0.16 s   | 45 / 116 ms                            | 101 / 232 ms            | ~3.8 s                          |
| WASM lite        | 1.7 MB   | 0.15 s   | 48 / 120 ms                            | 139 / 282 ms            | ~4.7 s                          |
| WASM full        | 99 MB    | 0.86 s   | 67 / 213 ms                            | 233 / 493 ms            | ~8.0 s                          |

Not included: the opponent's own moves (~0.05 s each in normal mode) and the teaching code,
which costs a few milliseconds per move in TypeScript. Phones are slower than this CPU,
which is why the app measures itself at start-up and drops to depth 10 when it's slow.

## LLM explanations

Not measured yet. The prototype's LLM benchmark sent an older copy of the coach prompt, so
it no longer measured what the app does. Model choice and pricing (architecture §15, open
question 4) need a benchmark that calls `apps/api/src/explain.ts` with real lessons, run
only when Will decides to spend the tokens.
