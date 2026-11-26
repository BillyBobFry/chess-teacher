# Tiers

The app has no users, so tiers come from **what the tests pin** and the frozen list, not from
production risk. "Pinned" means a test that runs in `pnpm check` (typecheck, lint, then Vitest
over `packages/*/test`, `tools/*/test` and `apps/*/test`; see `vitest.config.ts`) fails if the
behaviour changes. CI also runs `prettier --check .`, `db:check`, `pnpm build` and the smoke
test (`.github/workflows/ci.yml`); the smoke test is not part of `pnpm check`.

| Tier       | Meaning                                                                                                                                                           | How it ships                                                                              |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **T0**     | The behaviour is pinned by tests in `pnpm check`, or the change is mechanical: a rename, a move, dead code, a duplicated helper, import clean-up, a platform leak | One PR                                                                                    |
| **T1**     | Open to change but thinly tested                                                                                                                                  | Two items: a `tests-first` PR adding tests of observable outcomes, then the `refactor` PR |
| **FROZEN** | Logic in `frozen-code.md`                                                                                                                                         | Moves and renames only, proven unchanged; anything else is a `finding` for William        |

## Extra guards (not frozen, never mechanical)

Auth, the explanation allowance and usage ledger, quotas and the database schema can change, but:

- Migrations are only generated with Drizzle from `apps/api/src/db/schema.ts`
  (`pnpm --filter @chess-teacher/api db:generate`), and `pnpm --filter @chess-teacher/api db:check`
  must pass. Nothing runs against a real `DATABASE_URL`.
- The server stays the trust boundary and never runs Stockfish (D4). Moving logic across that
  line (engine or teaching work into `apps/api`, or a server check into the client) is not a
  refactor: file a `decision` item.
- Renaming a field that saved games hold (`SessionState`, `Lesson` and what they contain) needs a
  `SESSION_STATE_VERSION` bump and an `upgradeSession` step (`packages/core/src/session.ts`):
  T1, with a test that an old save still loads.

## Areas, as of `origin/main` `0c2a6da`

Re-check against the tests before relying on a row: tests get added.

| Area                                                                                                 | Tier         | Pinned by                                                                                                                                                                     |
| :--------------------------------------------------------------------------------------------------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core detection, classical check, triggers, opponent policy (`frozen-code.md`)                        | FROZEN       | Fixtures and replays; content of diagnosed lessons only by the declaration proof                                                                                              |
| `packages/core/src/session.ts`, the rest (new game, rewind, take back, branches, upgrades)           | T0           | `tools/sim/test/{resume,rewind,takeback,scores}.test.ts`, `packages/core/test/core.test.ts` (rewind, resign, `gameOutcome`, `upgradeSession`, one lesson at a time)           |
| `packages/core/src/review.ts`                                                                        | T0           | `reviewTree` tests in `core.test.ts`                                                                                                                                          |
| `packages/core/src/board.ts`, `game.ts` (moves and renames)                                          | T0           | `features.test.ts`, `core.test.ts` (`Game`, `variationSan`); their logic is frozen (section 4 of `frozen-code.md`)                                                            |
| `packages/core/src/text.ts`, `principles.ts`, `engine.ts` (types)                                    | T0           | Typecheck; a rename goes through lesson-text, API, web and the catalogue keys                                                                                                 |
| `packages/core/src/explain.ts` (code around the facts)                                               | T1           | One `diagnosisFacts` test in `core.test.ts`, and the "AI prompt facts" tests in `apps/api/test/api.test.ts`; what the facts say is frozen                                     |
| `packages/engine/src/uci.ts`, `eval-trace.ts`, `maia.ts` (encoding)                                  | T0           | `packages/engine/test/uci.test.ts`, `maia.test.ts` against `packages/engine/test/fixtures/maia-encoding.json`                                                                 |
| `packages/engine/src/recorded.ts`                                                                    | T0           | Every recorded-game replay                                                                                                                                                    |
| `packages/engine/src/uci-engine.ts`, `node.ts`                                                       | T1           | `node.test.ts` only where Stockfish is installed (skipped locally without it, required in CI)                                                                                 |
| `packages/contract/src/index.ts`                                                                     | T0           | Typecheck in API and web; `api.test.ts` sends real and malformed bodies. Schema changes also carry the trust-boundary guard                                                   |
| `packages/lesson-text/src/index.ts`                                                                  | T1           | No tests of its own; `api.test.ts` checks en-GB wording of facts, `apps/web/test/messages.test.ts` checks keys. Wording is content: never reworded                            |
| `apps/api/src/app.ts` (routes, progress, saving, allowance)                                          | T0           | `apps/api/test/api.test.ts` (auth, games, explanations, allowance, feedback, progress, errors)                                                                                |
| `apps/api/src/explain.ts`                                                                            | T0 / content | `api.test.ts` (guardrail, structured parts, locale, prompt facts); `SYSTEM_PROMPT`, `DIAGNOSIS_PROMPT` and `MISTAKE_DESCRIPTION` are content: never reworded                  |
| `apps/api/src/env.ts`, `auth.ts`, `server.ts`, `db/client.ts`                                        | T1           | Indirectly through `api.test.ts` (trusted origins, sign-in); extra guards apply                                                                                               |
| `apps/api/src/db/schema.ts`, `apps/api/drizzle/`                                                     | T1 + guard   | `db:check` in CI; Drizzle only                                                                                                                                                |
| `apps/web/src/lib/moves.ts`, `lib/router.ts`                                                         | T0           | `apps/web/test/moves.test.ts`, `router.test.ts`                                                                                                                               |
| Message catalogues (`apps/web/messages/*.json`), keys and structure                                  | T0           | `apps/web/test/messages.test.ts` (keys, placeholders, no em dashes or emoji)                                                                                                  |
| `apps/web/src/ui/`, `components/`, `game/`, `engine/`, `App.tsx`                                     | T1           | Only the smoke test (`apps/web/scripts/smoke.ts`), outside `pnpm check`. Tests first means plain-TS tests of logic lifted into `lib/` or `game/`, or extending the smoke test |
| `tools/sim/test/` helpers                                                                            | T0           | They are the tests                                                                                                                                                            |
| `tools/sim/src/` scripts (`simulate`, `near-miss`, `audit-real-games`, `validate-lessons`, `bench/`) | T1           | Typecheck only; their output is reports and benchmarks. `prototype-text.ts` is pinned by `features.test.ts` and `resume.test.ts` and must keep the prototype's wording        |
| `tools/sim/src/record-games.ts`, `tools/sim/fixtures/`, `tools/sim/games/`                           | Guarded      | Re-record only as `AGENTS.md` allows, never in a gardener PR; fixtures are never edited                                                                                       |
| `eslint/`, `eslint.config.js`, `scripts/`                                                            | T1           | `pnpm lint` and `pnpm build` exercise them; the platform rule for `packages/core` is never disabled                                                                           |

A pinning test the frozen code lacks (for example, the lessons each recorded game produces,
asserted as observable outcomes) is a `tests-first` item William may approve. It adds new
expected values; it never edits a recording.

## Counting lines

The limit is about 300 changed non-test lines per PR. Count them with

```sh
git diff --numstat -M origin/main...HEAD -- . ':(exclude)**/test/**' ':(exclude)**/*.test.ts' ':(exclude)docs/gardener/**'
```

and report pure file moves and renames apart: a rename with no edits shows as `0 0` in
`--numstat -M`, and blocks moved inside or between files show as moved in
`git diff --color-moved`. Say in the PR, for example, "62 lines changed, plus 210 moved
unchanged from `session.ts` to `triggers.ts`". If an item will not fit, split it into several
items in the backlog before starting.
