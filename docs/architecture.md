# Chess Teacher — Architecture

Status: **agreed** (Milestones 1–4 complete). Records the decisions made so far, why they
were made, and what is still open. The product concept is in [`concept.md`](concept.md);
the measurements behind several decisions are in [`../bench/README.md`](../bench/README.md).

---

## 1. Goals and constraints

| | |
|---|---|
| Scale | Hobby project with room to grow |
| Model | Open source (AGPL-3.0), free to self-host. Hosted version: free play, N free coached games a month, pay-as-you-go bundles of coached games (concept §9) |
| Platforms | Web first; native mobile apps later, without a rewrite |
| Offline | Not needed now, but the design must not rule it out |
| Accounts | Sign-in from day one (LLM explanations cost money; no anonymous play) |
| Self-hosting | One server process plus Postgres (or the embedded database), no Vercel required |
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
| D6 | **Per-user metering of the AI coach** | The server can't verify the device's engine analysis, so LLM spend is bounded per user instead: by coached games (D13). |
| D7 | **Neon Postgres + Drizzle ORM** | Already in use; serverless driver works from Vercel functions; Drizzle gives typed queries and migrations in TypeScript. |
| D8 | **A Vite + React single-page app, with a Hono API on Vercel Functions** | The game runs entirely on the device, so server rendering would add complexity without helping the core screen. A static SPA keeps offline (service worker) and React Native reuse simple. The API is written with Hono, which is independent of the web framework, so the API that mobile apps depend on isn't tied to it. Server-rendered public pages are handled separately (see §7.1). |
| D9 | **API schemas defined once with Zod** | Types for every TypeScript client come from the schemas; OpenAPI is generated from them for any future Swift/Kotlin app. |
| D10 | **Game sessions are plain, serialisable state, saved after every move** | The engine is stateless (position in, analysis out), so everything needed to continue a game is the session state: moves, pending lessons with their trigger conditions, resolved lessons and settings. Saved to the server after each move, any game can be resumed later on any device by loading the state and starting a fresh engine (~0.15 s). |
| D11 | **AGPL-3.0, with a CLA** | Free to use and self-host; anyone running a modified version as a service must publish it, so a competitor can't run a closed fork. Compatible with Stockfish's GPL, which also settles shipping Stockfish to browsers and app stores (Lichess's GPL app is on both stores). The CLA keeps other licensing options open. |
| D12 | **One codebase, two modes: hosted and self-hosted** | A setting, not a fork. Self-hosted: no billing, the operator's own API key, coached games unlimited or limited by config. Hosted: monthly free coached games and paid bundles. Self-hosting ships as a Docker image (one Node process serving the static app and the API) with Postgres or the embedded database. |
| D13 | **Coached games as the unit, with a server-side ledger** | A user-facing unit that's easy to understand. A game becomes "coached" when its first AI explanation is generated, and that's when one is consumed (free monthly allowance first, then purchased). AI explanations per game are capped. Balances live in one ledger on the server so Stripe purchases (web) and in-app purchases (mobile) share it. |
| D14 | **Strategic lessons need a second opinion** | Our features say *what* differs between the two lines; Stockfish 11's classical evaluation says which of its terms account for the difference. A strategic lesson is only taught when its feature's term is a main reason. Stockfish 11 runs as a third, lazily loaded worker (3.7 MB, ~175 ms to start); when absent, lessons aren't checked. |

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
 │  Hono API on Vercel Functions                                   │      │  Claude API  │
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
  web/       Vite + React SPA: the game UI.                              [MS2]
  api/       (in apps/web or alongside) Hono API on Vercel Functions.    [MS3]
  site/      Marketing site (Astro), if and when marketing outgrows one page. [later]
  mobile/    Expo app.                                                   [later]
prototype/   The Python prototype: the reference for parity tests, removed when no longer needed.
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

**Serialisable state (D10).** The session is a plain JSON-compatible object, never a live
board or engine handle:

```ts
interface SessionState {
  version: number;              // schema version, for migrating saved games
  startFen: string;
  moves: string[];              // UCI, the source of truth for the position
  userColour: "w" | "b";
  config: TeachingConfig;
  lessons: Lesson[];            // pending ones included, with their trigger conditions
  opponentModes: ("normal" | "levelled")[];
}

function step(state: SessionState, input: Input, engine: Engine): Promise<{ state: SessionState; events: GameEvent[] }>;
```

Every step returns a new state, which the client saves (locally first, then to the
server). Resuming is `load state → create engine → continue`. Rewind is a state
transition like any other, so it is saved and resumable too. Tests check that
save → load → continue gives exactly the same events as never stopping.

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

A Hono API on Vercel Functions, Neon Postgres via Drizzle. Endpoint sketch (finalised in MS3):

```
GET  /api/config                                  is Google sign-in / are AI explanations available
GET|POST /api/auth/*                              Better Auth (sign up, sign in, Google, sign out)
GET  /api/me                                      user + AI explanation allowance
GET  /api/games?status=active                     recent unfinished games
POST /api/games                                   create a game (session state)
GET  /api/games/:id                               load a game (resume on any device)
PUT  /api/games/:id                               save { state, reveal, finished, expectedVersion };
                                                  409 if another device saved first
GET  /api/games/:id/lessons/:lessonId/explanation the stored AI explanation, if any
POST /api/games/:id/lessons/:lessonId/explanation generate it (from the *saved* lesson), or
                                                  return the stored one; counts against the allowance
```

The client saves the whole session state after every step (one queued, coalesced save at
a time) rather than posting individual moves: simpler, and the state is small.

**Validation.** The server reconstructs each game from its move list with the same core
package (no engine) to check legality, and checks that each lesson's facts are consistent
with the game: the move was played at that position, the two lines are legal from it, and
the fields are within size limits. It cannot check the engine's evaluations; quotas bound
the cost of anyone faking them.

**Data model (first cut):**

| Table | Key columns |
|---|---|
| `users` | id, email, plan, created_at |
| `games` | id, user_id, colour, settings (json), moves (UCI[]), state (json, the latest `SessionState`), state_version, status (active/finished), result, created_at, updated_at |
| `lessons` | id, game_id, ply, principle, feature, kind, facts (json), status, found_cause, hints_used, rewound |
| `explanations` | lesson_id, model, prompt_version, text, input_tokens, output_tokens, cost_usd, guardrail_ok |
| `usage` | user_id, period, explanations_used |

Lessons are stored as data from day one: they drive progress tracking and are how the
teaching gets improved (which principles players rarely find, which explanation versions
work better, which thresholds feel nitpicky).

**Auth:** decided in MS3. Candidates: Better Auth or Auth.js (self-hosted on Neon), or
Clerk (hosted). Email magic link plus Google sign-in to start.

### 7.1 Hosting layout

One Vercel project, one domain, so sign-in uses a first-party session cookie with no
cross-origin setup:

```
example.com/          static landing / pricing pages (prerendered HTML, search-friendly)  [MS3+]
example.com/app/...   the SPA: sign-in screen, games, progress
example.com/api/...   the Hono API
```

Visiting `/app` signed out redirects to `/app/sign-in`; the marketing pages' "Sign in" and
"Start learning" buttons link there. Mobile apps call the same API with token-based
sessions. If marketing grows (blog, SEO content), an Astro site can take over `/` through
Vercel rewrites, or move the app to `app.example.com`; neither changes the app or the API.

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

## 10. Licensing

The app is **AGPL-3.0** (D11), with a CLA for contributors. Stockfish is **GPL-3.0** and
is distributed to browsers (and later bundled in the mobile app); its licence ships next to
the engine and the Licences screen links to its source. GPL-3.0 and AGPL-3.0 are
compatible. chess.js is BSD-2-Clause; react-chessboard and React are MIT. Worth a proper
legal check before charging money, particularly for the app stores.

## 11. Milestone 1 (done)

1. This document.
2. Monorepo scaffold: pnpm workspaces, TypeScript 6 (strict), Vitest, ESLint (with the
   `core` platform-independence rule), Prettier.
3. `packages/engine`: UCI parser, replay engine for tests, Node process adapter.
4. `packages/core`: features, principles, lesson detection, triggers, teaching opponent,
   explanations and the session state machine, ported from the Python prototype.
5. **Parity tests** on recorded engine output: 268 positions × 11 features, and 8 whole
   games (moves, events at every step, lessons, facts and explanation text) match the
   Python prototype exactly, both straight through and with the state saved and reloaded
   as JSON after every step. A deliberate one-constant change makes all of them fail.
6. `tools/sim`: the simulation harness in TypeScript against real Stockfish. First run
   (6 games per configuration): 90% of predicted consequences landed with the teaching
   opponent vs 61% without, consistent with the Python results; ~64 ms per user move
   including the engine at depth 10 (native Stockfish).
7. The Python prototype moved to `prototype/`.

Performance note: the teaching code itself costs a few milliseconds per move. The one hot
spot (resolving exchanges for the material count) was rewritten from chess.js move
generation to a dedicated capture generator: 20.7 → 0.3 ms per position.

Known gaps carried forward: no checkmate or endgame king-activity *lessons* occur in the
recorded games (those features are still covered by the per-position parity test).

## 12. Milestone 2 (done)

A playable web app (`apps/web`), deployable to Vercel from `vercel.json`:

- Vite + React SPA under `/app/`; Stockfish 19 WASM lite (single-threaded, 1.8 MB) in two
  Web Workers: full strength for analysis, weakened for the opponent's normal moves.
  Analysis depth 12, dropping to 10 if a start-up benchmark is slow.
- The engine adapter is now transport-agnostic (`UciEngine` over a `UciTransport`): the
  Node child process and the browser Web Worker share all UCI logic.
- Game screen: click or drag to move (promotions are always to a queen for now), move
  list, status, easy-mode warnings and "you fixed it" toasts.
- The reveal: find the cause (wrong guesses give hints), the explanation built from the
  lesson's facts, the two futures side by side with a shared stepper, rewind or carry on.
- Post-game review of every lesson with its outcome.
- Games are saved to `localStorage` after every step and resume on reload (D10 in
  practice); this moves to the server in MS3.
- Licences page with the Stockfish GPL text and source links; the licence file ships
  next to the engine.
- Browser smoke test in headless Chromium covering all of the above, including the phone
  layout and a zero-console-errors check.

Not yet verified: the actual Vercel deployment (needs the repository connected to your
Vercel account), and speed on real phones.

## 13. Milestone 3 (done)

- `apps/api`: Hono API; Better Auth (email + password, Google when configured); Drizzle on
  Neon's HTTP driver in production and PGlite (Postgres in WebAssembly) locally and in
  tests, so no database setup is needed to develop.
- Games saved to the server after every step with optimistic version checks; resume on
  any device; abandoning a game finishes it.
- AI explanations: requested when the lesson is *created* (several moves before its
  reveal), generated from the saved lesson's facts only, guardrail-checked, stored once per
  lesson, counted against a monthly allowance (default 30) only when successful. Shown
  above the measured facts; the facts stand alone when there's no AI explanation.
- `packages/contract`: API schemas in Zod, used for validation and client types.
- Static landing page at `/`; the app at `/app/`; sign-in screens in the app.
- `scripts/build-vercel.mjs` writes Vercel's Build Output API format directly;
  `scripts/serve-vercel-output.mjs` serves that output locally for end-to-end testing.
- Tests: 12 API integration tests; the end-to-end browser test now runs against the
  production build.

Not yet verified against the real services: Vercel itself, Neon's HTTP driver (tests use
PGlite, the same SQL), Google sign-in, and the real Anthropic API (the request shape
follows the SDK documentation; tests use a fake client).

Deferred: per-principle progress page, password reset (needs an email service), payments.

## 14. Milestone 4 (done): lesson quality

**The classical-evaluation check (D14).** For each strategic lesson, Stockfish 11's `eval`
breakdown is taken at the end of both lines (stepping back past positions in check),
blended between middlegame and endgame by material as Stockfish does, and compared term by
term from the user's side. Features map to terms: pawn structure → Pawns, passed pawns →
Passed, outposts → Knights/Bishops, open files → Rooks, activity and development →
Mobility (+ Knights/Bishops), king safety → King safety, centre → Space/Mobility. King
activity has no matching term and can't be verified. A lesson is kept only if its terms
gain ≥ 0.10 pawns, rank in the top two gains, and aren't dwarfed (> 3×) by another term.

**What it does** (judged by hand on 88 simulated strategic lessons, two samples; see
`reports/classical-check.md`):

- It removes most rationalisations: of the rejected lessons, roughly 4 in 5 were really
  about tactics or a king attack with a strategic story attached.
- It isn't a complete fix: about 1 in 5 kept lessons is still wrong (typically the better
  line simply wins a pawn a little later), and a few real lessons are lost (e.g. a
  development lesson alongside a larger king-safety swing).
- It's strict: in one 12-game simulation, strategic lessons fell from 19 to 5; material
  lessons were unaffected, and 75% of consequences still landed.

**Also in this milestone:**
- "Did this lesson make sense? 👍 👎" on every explanation (in the reveal and the review),
  with an optional comment on 👎, stored in `lesson_feedback` with the lesson's feature
  and principle for analysis.
- A per-principle progress page (`GET /api/me/progress`): lessons by principle across the
  last 50 games, how often the user found the cause themselves, fixed a weakness in time,
  and how many of their last five games it came up in. Reachable from the account menu
  and the game review.
- `pnpm sim -- --verify` runs simulations with the check; `tools/sim/src/validate-lessons.ts`
  produces the kept/rejected report for grading.

**Next for lesson quality** (data-driven, from the ratings):
- Relabel instead of drop: many rejected lessons were really about king safety; teaching
  the dominant term's principle could turn them into correct lessons.
- Treat "the better line wins material a few moves later" as a material lesson.
- Tune the thresholds against 👍/👎 data and a strong player's grading of the report.

## 15. Open questions

1. ~~Engine on the device (D2)~~: confirmed.
2. ~~Next.js vs Vite SPA + Vercel functions (D8)~~: SPA + Hono.
3. ~~Auth provider~~: Better Auth (email + password, Google).
4. LLM model, N (free coached games a month), bundle sizes and prices: after the LLM
   benchmark runs.
5. Legal check before any paid launch (AGPL + app stores, CLA wording).

## 16. Next milestones

5. **Open-source ready.** Licence and CLA, contributor guide, Docker image and
   self-hosting docs, hosted/self-hosted mode (D12), bring-your-own API key.
6. **Coached games and payments.** Ledger (D13), monthly free coached games, Stripe
   Checkout for bundles, per-game cap on AI explanations, "ask the coach".
7. **Mobile app.** Expo, sharing the core and API client; native Stockfish; in-app
   purchases feeding the same ledger.
