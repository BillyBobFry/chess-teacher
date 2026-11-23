# Chess Teacher

An app that teaches chess strategy by letting your mistakes come back to bite you, then
helping you work out which move caused it.

- Product concept: [`docs/concept.md`](docs/concept.md)
- Architecture and decisions: [`docs/architecture.md`](docs/architecture.md)

**Status:** Milestone 1 done. The teaching core is in TypeScript and proven to behave
identically to the original Python prototype. No UI yet; that's Milestone 2.

## Layout

| Path | What |
|---|---|
| `packages/core` | The teaching logic, in pure TypeScript (runs in the browser, Node and React Native): strategic features, lesson detection, triggers, the teaching opponent, explanations, and the game session as serialisable state. |
| `packages/engine` | Engine adapters: UCI protocol parser, a replay engine for tests, and a Node adapter for a Stockfish process (`@chess-teacher/engine/node`). |
| `tools/sim` | Simulation harness, parity tests against the Python prototype, profiling. |
| `prototype` | The original Python prototype, benchmarks and research tools. Kept as the reference implementation for now. |

## Setup

Needs Node 22+, pnpm, and [Stockfish](https://stockfishchess.org/) (`apt install stockfish`,
`brew install stockfish`, or set `STOCKFISH_PATH`).

```bash
pnpm install
pnpm check      # typecheck + lint + tests
pnpm sim -- --games 12 --compare --out ../../reports   # simulated games with real Stockfish
```

## Tests

- **Feature parity:** all 11 strategic features measured on 268 positions (both colours)
  must exactly match the Python prototype.
- **Game parity:** 8 recorded games are replayed through the TypeScript core using the
  Python prototype's recorded engine output. Opponent moves, every event at every step,
  and every lesson (facts, explanation text, hints) must match exactly.
- **Resume:** the same games, saving and reloading the session state as JSON after every
  step, must produce identical results.
- Unit tests for the UCI parser, the Stockfish adapter, rewind, and edge cases.

To re-record the fixtures (needs the Python prototype set up, see `prototype/README.md`):

```bash
prototype/.venv/bin/python prototype/record_fixtures.py --games 8 --out tools/sim/fixtures
```
