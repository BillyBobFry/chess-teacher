# Chess Teacher

An app that teaches chess strategy by letting your mistakes come back to bite you, then
helping you work out which move caused it.

- Product concept: [`docs/concept.md`](docs/concept.md)
- Architecture and decisions: [`docs/architecture.md`](docs/architecture.md)

**Status:** Milestone 4 done: strategic lessons are checked against Stockfish 11's classical
evaluation before they're taught, every lesson can be rated 👍/👎, and there's a
per-principle progress page. Earlier: accounts, server-saved games, AI explanations, a
landing page, and a production build for Vercel + Neon. Next: open-source readiness, then
coached-game bundles (see `docs/concept.md` §9).

## Layout

| Path                | What                                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`          | The web app: Vite + React SPA served under `/app/`, Stockfish WASM in Web Workers; the static landing page in `apps/web/landing`.                                                                                     |
| `apps/api`          | The API: Hono, Better Auth, Drizzle (Neon in production, embedded PGlite locally), LLM explanations.                                                                                                                  |
| `packages/contract` | API request/response schemas (Zod), shared by the API and its clients.                                                                                                                                                |
| `packages/core`     | The teaching logic, in pure TypeScript (runs in the browser, Node and React Native): strategic features, lesson detection, triggers, the teaching opponent, explanations, and the game session as serialisable state. |
| `packages/engine`   | Engine adapters: UCI protocol parser, a replay engine for tests, and a Node adapter for a Stockfish process (`@chess-teacher/engine/node`).                                                                           |
| `tools/sim`         | Simulation harness, recorded-game tests, feature parity with the Python prototype, profiling.                                                                                                                         |
| `prototype`         | The original Python prototype, benchmarks and research tools. Kept as the reference implementation for now.                                                                                                           |

## Running locally

Needs Node 22+ and pnpm (`corepack enable pnpm`). No database or API keys needed.

```bash
pnpm install
pnpm dev          # API + web; open the URL it prints, e.g. http://localhost:5173/app/
```

Both servers take the next free port if theirs is busy (the web dev server proxies `/api` to
wherever the API ended up), and sign-in accepts any `localhost` port locally. Locally the API
uses an embedded Postgres stored in `apps/api/.data` (delete the folder to
start fresh). Optional settings go in `apps/api/.env`; see `apps/api/.env.example`:

- `ANTHROPIC_API_KEY`: real AI explanations (costs money; see `prototype/bench` for the
  cost benchmark). Without it the app uses the template explanations.
- `FAKE_LLM=1`: canned "explanations" with no key and no cost, to try the AI flow.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google sign-in.

Other commands:

```bash
pnpm check        # typecheck + lint + all unit, replay, parity and API tests
pnpm build        # production build in Vercel's format (.vercel/output)
pnpm serve        # serve that build locally on :3000, API included
pnpm smoke <dir>  # build, then the end-to-end browser test (needs Playwright + Chromium)
pnpm sim -- --games 12 --compare --out ../../reports   # simulations (needs native Stockfish)
pnpm sim -- --games 12 --verify                        # …with the classical-evaluation check
pnpm --filter @chess-teacher/sim exec tsx src/validate-lessons.ts --games 24 --out ../../reports
                                                       # kept/rejected strategic lessons, for grading
```

## Deploying (Vercel + Neon)

1. **Vercel:** import the GitHub repository, root directory = repository root, framework
   preset "Other". `vercel.json` runs `scripts/build-vercel.mjs`, which writes Vercel's
   Build Output directly (static site + one API function + routing).
2. **Database:** add Neon from the Vercel Marketplace (it sets `DATABASE_URL`, and can give
   each preview deployment its own database branch), or set `DATABASE_URL` yourself.
   Migrations run automatically during the build whenever `DATABASE_URL` is set.
3. **Environment variables** (Project → Settings → Environment Variables):

   | Variable                                   | Needed              | Value                                                                                        |
   | ------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------- |
   | `BETTER_AUTH_SECRET`                       | yes                 | a long random string: `openssl rand -base64 32`                                              |
   | `BETTER_AUTH_URL`                          | production          | your public URL, e.g. `https://chess.example.com` (previews use their own URL automatically) |
   | `ANTHROPIC_API_KEY`                        | for AI explanations | from console.anthropic.com → API Keys                                                        |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | for Google sign-in  | see below                                                                                    |
   | `LLM_MODEL`                                | no                  | default `claude-opus-5-5`                                                                    |
   | `FREE_EXPLANATIONS_PER_MONTH`              | no                  | default `30`                                                                                 |

4. **Google sign-in:** in Google Cloud Console → APIs & Services → Credentials, create an
   OAuth client ID (Web application) with the authorised redirect URI
   `<BETTER_AUTH_URL>/api/auth/callback/google`. Preview URLs change per deployment, so
   Google sign-in is easiest to use on the production domain; email + password works
   everywhere.

## Tests

- **Feature parity:** all 11 strategic features measured on 268 positions (both colours)
  must exactly match the Python prototype.
- **Recorded games:** 8 games played by a simulated student against the teaching opponent,
  with every engine result recorded, replayed through the core with no engine. They test
  takeback, rewind and the classical-evaluation check in real positions, and that saving
  and reloading the session state as JSON after every step changes nothing.
- Unit tests for the UCI parser, the eval-breakdown parser, the Stockfish adapter and the
  classical-evaluation verdict rules.
- **API tests:** the real Hono app with Better Auth on an in-memory Postgres: sign-up and
  sign-in, privacy between users, saving with version conflicts, illegal-move rejection,
  explanation caching, the guardrail, and the monthly allowance (with a fake LLM).
- **End-to-end browser test** (`pnpm smoke <dir>`): runs the _production build_ locally and
  drives it in headless Chromium: landing page, account creation, playing against
  Stockfish, resuming after a reload, a reveal with the AI explanation and rewind, the
  review, signing out and in, the phone layout, and no console errors.

To re-record the games, when a change to the core asks the engine about different
positions (the replay then fails with "no recorded analysis"):

```bash
pnpm --filter @chess-teacher/sim exec tsx src/record-games.ts --engine "node $PWD/node_modules/.pnpm/stockfish@19.0.1/node_modules/stockfish/bin/stockfish-19-single.js"
```

Leave out `--engine` if Stockfish is installed natively. The feature fixtures came from the
Python prototype (`prototype/record_fixtures.py`).
