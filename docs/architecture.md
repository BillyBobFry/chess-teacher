# Chess Teacher — Architecture

Status: **draft for review** (Milestone 1). Records the decisions made so far, why they
were made, and what is still open. The product concept is in [`concept.md`](concept.md);
the measurements behind several decisions are in [`../bench/README.md`](../bench/README.md).

---

## 1. Goals and constraints

| | |
|---|---|
| Scale | Hobby project with room to grow; a paid tier for teaching games later |
| Platforms | Web first; native mobile apps later, without a rewrite |
| Offline | Not needed now, but the design must not rule it out |
| Accounts | Sign-in from day one (LLM explanations cost money; no anonymous play) |
| Hosting | Vercel (web + functions) and Neon (Postgres), already in use |
| Cost | Server cost per game should be close to zero; LLM cost bounded per user |

## 2. Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **TypeScript everywhere** | Shared types *and* logic across server, web and mobile; keeps offline possible. The Python prototype is small enough to port cheaply now. |
| D2 | **The engine and teaching logic run on the player's device** | Benchmarks: the 1.7 MB WebAssembly Stockfish build runs at ~native speed (≈140 ms per user move, ≈5 s CPU per game). Serverless functions can't keep engine processes warm, so running the engine on Vercel would be awkward and cost money per move; on the device it is free and is most of the way to offline. |
| D3 | **A pure, portable teaching core** | One package holds all chess teaching logic, with no DOM, Node or network dependencies. It is tested in Node, runs in the browser, and later in React Native, unchanged. |
| D4 | **The server is the trust boundary** | It owns what must be trusted: identity, saved games and lessons, spending LLM tokens, quotas and (later) billing. It never runs Stockfish. |
| D5 | **Explanations are generated in the background, before the reveal** | A lesson is created several moves before it is revealed, so the LLM explanation can be generated while the game continues. The template is shown if it isn't ready. |
| D6 | **Per-user explanation quotas** | The server can't verify the device's engine analysis, so LLM spend is bounded per user instead. Free and paid tiers become different quotas. |
| D7 | **Neon Postgres + Drizzle ORM** | Already in use; serverless driver works from Vercel functions; Drizzle gives typed queries and migrations in TypeScript. |
| D8 | **Next.js on Vercel for the web app and API** *(confirm in MS2)* | One deploy for the UI and the API route handlers; mature auth options. The game screen is a client component, so it would port to React Native as well as a Vite app would. |
| D9 | **API schemas defined once with Zod** | Types for every TypeScript client come from the schemas; OpenAPI is generated from them for any future Swift/Kotlin app. |

## 3. Overview

```
 ┌──────────────────────── Player's device (browser now, app later) ───────────────────────┐
 │                                                                                         │
 │   UI (React)  ◄── events ──  Game session (core)  ── analyse ──►  Engine adapter        │
 │   board, reveal flow,        teaching opponent,                   Web Worker running    │
 │   side-by-side futures       lessons, triggers                    Stockfish WASM lite   │
 │                                     │                                                   │
 └─────────────────────────────────────┼───────────────────────────────────────────────────┘
                                       │ HTTPS (typed client, schemas from packages/api)
                                       ▼
 ┌──────────────────────────── Vercel ─────────────────────────────┐      ┌──────────────┐
 │  Next.js route handlers                                         │      │  Claude API  │
 │   auth · save moves & lessons · request explanation · quotas    │ ───► │              │
 │   validates games with the same core package (no engine)        │      └──────────────┘
 └────────────────────────────────┬────────────────────────────────┘
                                  ▼
                          Neon Postgres
             users · games · lessons · explanations · usage
```

## 4. Repository layout

A pnpm workspace monorepo.

```
packages/
  core/      Pure TypeScript teaching logic. Depends only on chess.js.
             features, principles, lesson detection, triggers, opponent policy,
             session state machine (moves in → events out). Engine injected via interface.
  engine/    The Engine interface, a UCI protocol parser, and adapters:
             - node: spawns a native Stockfish or `node stockfish.js` (tests, simulations)
             - worker: Stockfish WASM in a Web Worker (browser)          [MS2]
             - native module for React Native                            [later]
  api/       Zod schemas for every request/response; generated OpenAPI.  [MS3]
tools/
  sim/       Simulation harness, parity tests against the Python prototype, benchmarks.
apps/
  web/       Next.js app: game UI + API route handlers.                  [MS2–MS3]
  mobile/    Expo app.                                                   [later]
prototype/   The Python prototype, kept until parity is proven, then removed.
```

Rule enforced by lint: **`packages/core` may not import Node built-ins, DOM APIs or
anything that does I/O.** That is what keeps offline and mobile possible.

## 5. The teaching core

The core is a state machine. Its inputs are the player's moves and engine analyses; its
outputs are events. It never calls the network.

```ts
interface Engine {
  analyse(fen: string, opts: { depth: number; multipv: number }): Promise<Candidate[]>;
  bestMove(fen: string, opts: { skill?: number; movetimeMs?: number }): Promise<string>;
}

type GameEvent =
  | { type: "opponentMoved"; move: string; mode: "normal" | "levelled" }
  | { type: "lessonCreated"; lessonId: string }          // hidden from the player
  | { type: "warning"; lessonId: string }                 // easy mode only
  | { type: "lessonTriggered"; lessonId: string; text: string }
  | { type: "chanceGone"; lessonId: string }
  | { type: "fixed"; lessonId: string }
  | { type: "expired"; lessonId: string };
```

Thresholds (eval gap, line length, expiry, cause window) live in a `TeachingConfig` object
so they can be tuned, and later served from the server for experiments, without an app
release.

Porting notes from the Python prototype:

- chess.js covers move generation, SAN/FEN and attackers. Mobility for the side *not* to
  move is computed by generating moves from a copy of the position with the turn flipped
  in the FEN.
- python-chess's UCI handling is replaced by a small parser in `packages/engine`
  (`info ... multipv N score cp|mate ... pv ...` lines, `bestmove`).

## 6. The engine on the device

- **Build:** Stockfish 19 WASM *lite, single-threaded* (1.7 MB). Single-threaded avoids
  the COOP/COEP headers that multi-threaded WASM needs, and it was fast enough in the
  benchmarks. Revisit if phones prove too slow.
- **Where it runs:** a Web Worker, so analysis never blocks the UI.
- **Two engine instances:** one for analysis at full strength, one weakened (Skill Level)
  for the opponent's normal moves, matching the prototype.
- **Depth:** 12 by default; drop to 10 on slow devices (measured at start-up with a short
  benchmark). To be validated on real phones in MS2.
- **Maia** (human-like opponent) is a later swap behind the same `Engine` interface.

## 7. The server

Next.js route handlers on Vercel, Neon Postgres via Drizzle. Endpoint sketch (finalised in MS3):

```
POST /api/games                       start a game (colour, difficulty)
POST /api/games/:id/moves             append moves + events (batched; offline-friendly)
POST /api/games/:id/lessons           record a lesson's facts → queues its explanation
GET  /api/games/:id/lessons/:lessonId explanation (LLM text, or "pending" → use template)
POST /api/games/:id/lessons/:lessonId/outcome   found cause? hints used? rewound?
GET  /api/me/progress                 per-principle stats
```

**Validation.** The server reconstructs each game from its move list with the same core
package (no engine) to check legality, and checks that each lesson's facts are consistent
with the game: the move was played at that position, the two lines are legal from it, and
the fields are within size limits. It cannot check the engine's evaluations; quotas bound
the cost of anyone faking them.

**Data model (first cut):**

| Table | Key columns |
|---|---|
| `users` | id, email, plan, created_at |
| `games` | id, user_id, colour, settings (json), moves (SAN[]), result, created_at |
| `lessons` | id, game_id, ply, principle, feature, kind, facts (json), status, found_cause, hints_used, rewound |
| `explanations` | lesson_id, model, prompt_version, text, input_tokens, output_tokens, cost_usd, guardrail_ok |
| `usage` | user_id, period, explanations_used |

Lessons are stored as data from day one: they drive progress tracking and are how the
teaching gets improved (which principles players rarely find, which explanation versions
work better, which thresholds feel nitpicky).

**Auth:** decided in MS3. Candidates: Better Auth or Auth.js (self-hosted on Neon), or
Clerk (hosted). Email magic link plus Google sign-in to start.

## 8. LLM explanations

- Generated server-side only; the API key never reaches a client.
- Triggered when a lesson is recorded, run in the background (Vercel `waitUntil`), stored
  in `explanations`, and cached by a hash of the facts plus prompt version.
- Only the structured facts are sent. The guardrail rejects any output that mentions a
  square not in the facts; the template is used instead.
- Model choice and pricing come from the LLM benchmark (`bench/llm_bench.py`), which still
  needs to be run with an API key.

## 9. Doors left open

**Offline.** Already true for playing and lessons (D2, D3). Still needed: a local store
for unsynced games (IndexedDB), batched sync to `POST /moves`, and template explanations
while offline.

**Native mobile.** An Expo app reuses `packages/core`, the typed API client and most
state logic. It needs a Stockfish native module (or WASM in a WebView) behind the same
`Engine` interface.

## 10. Licensing (needs proper advice before charging)

Stockfish is **GPL-3.0**. Sending the WASM build to browsers, or bundling it in an app,
is distribution: include the licence and make Stockfish's source available. The app's own
code talks to the engine only over the UCI text protocol, which is generally considered
separate from it, but the App Store's terms and the GPL have a contentious history. chess.js
is BSD-2-Clause.

## 11. Milestone 1 plan

1. This document.
2. Monorepo scaffold: pnpm workspaces, TypeScript (strict), Vitest, ESLint (with the
   `core` import rule), Prettier.
3. `packages/engine`: interface, UCI parser, Node process adapter.
4. `packages/core`: port features, principles, lesson detection, triggers, opponent policy
   and session from the Python prototype.
5. **Parity tests.** Engine output varies run to run, so parity is tested on *recorded*
   engine output: the Python prototype records every analysis it receives plus the lessons
   it produces; the TypeScript core replays the same analyses through a recording engine
   adapter and must produce the same lessons and events.
6. `tools/sim`: the simulation harness in TypeScript, with the same report as the Python one.
7. When parity holds, move the Python prototype to `prototype/` (and later delete it).

Out of scope for MS1: any UI, the server, auth, the database, LLM calls.

## 12. Open questions

1. **Engine on the device (D2)**: confirm. It's the decision that most shapes the rest.
2. Next.js vs Vite SPA + Vercel functions (D8): confirm in MS2.
3. Auth provider: MS3.
4. LLM model and price points: after the LLM benchmark runs.
5. Licensing advice before any paid launch.
