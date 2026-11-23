# Chess Teacher

An app that teaches chess strategy by letting your mistakes come back to bite you, then
helping you work out which move caused it.

- Product concept: [`docs/concept.md`](docs/concept.md)
- Architecture and decisions: [`docs/architecture.md`](docs/architecture.md)

**Status:** Milestone 2 done: a playable web app. Stockfish runs in the browser, the
teaching opponent levels up to exploit your mistakes, and when one lands you find the
cause, compare the two futures and can rewind. Games are saved in the browser for now;
sign-in, the server and LLM explanations are Milestone 3.

## Layout

| Path | What |
|---|---|
| `apps/web` | The web app: Vite + React SPA served under `/app/`, Stockfish WASM in Web Workers. |
| `packages/core` | The teaching logic, in pure TypeScript (runs in the browser, Node and React Native): strategic features, lesson detection, triggers, the teaching opponent, explanations, and the game session as serialisable state. |
| `packages/engine` | Engine adapters: UCI protocol parser, a replay engine for tests, and a Node adapter for a Stockfish process (`@chess-teacher/engine/node`). |
| `tools/sim` | Simulation harness, parity tests against the Python prototype, profiling. |
| `prototype` | The original Python prototype, benchmarks and research tools. Kept as the reference implementation for now. |

## Setup

Needs Node 22+, pnpm, and [Stockfish](https://stockfishchess.org/) (`apt install stockfish`,
`brew install stockfish`, or set `STOCKFISH_PATH`).

```bash
pnpm install
pnpm --filter @chess-teacher/web dev      # http://localhost:5173/app/
pnpm check      # typecheck + lint + tests
pnpm sim -- --games 12 --compare --out ../../reports   # simulated games with real Stockfish
```

## Deploying (Vercel)

`vercel.json` at the repository root configures everything: pnpm install, the web build,
`/` → `/app/` redirect, and SPA routing under `/app/`. Import the GitHub repository in
Vercel with the root directory left as the repository root and framework preset
"Other"; every pushed branch then gets a preview URL.

## Tests

- **Feature parity:** all 11 strategic features measured on 268 positions (both colours)
  must exactly match the Python prototype.
- **Game parity:** 8 recorded games are replayed through the TypeScript core using the
  Python prototype's recorded engine output. Opponent moves, every event at every step,
  and every lesson (facts, explanation text, hints) must match exactly.
- **Resume:** the same games, saving and reloading the session state as JSON after every
  step, must produce identical results.
- Unit tests for the UCI parser, the Stockfish adapter, rewind, and edge cases.
- **Browser smoke test** (`pnpm --filter @chess-teacher/web build && pnpm --filter
  @chess-teacher/web smoke <dir>`): plays a move against Stockfish in headless Chromium,
  resumes after a reload, walks through a reveal (wrong guess → hint → answer →
  futures → rewind), the review, the licences page and the phone layout, and fails on
  any console error. Needs Playwright with Chromium installed.

To re-record the fixtures (needs the Python prototype set up, see `prototype/README.md`):

```bash
prototype/.venv/bin/python prototype/record_fixtures.py --games 8 --out tools/sim/fixtures
```
