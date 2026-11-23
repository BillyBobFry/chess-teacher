# AGENTS.md

Chess Teacher teaches chess strategy by letting a player's mistakes come back to bite them,
then helping them work out which move caused it. A pnpm monorepo: `apps/web` (Vite + React
SPA, Stockfish in Web Workers), `apps/api` (Hono, Better Auth, Drizzle), `packages/core` (the
teaching logic, pure TypeScript), `packages/engine`, `packages/contract` (Zod API schemas),
`tools/sim`, and `prototype` (the Python reference implementation).

This file is an index. Read the file that matches the task when you touch that area, and treat
it as mandatory; don't load everything up front.

| Concern                                                                     | Read                                            | When                                                                                        |
| :-------------------------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------ |
| What the product is and isn't, the teaching loop, the curriculum            | `docs/concept.md`                               | Feature decisions, anything that changes what the player sees or learns                     |
| Architecture and settled decisions (D1, D2...)                              | `docs/architecture.md`                          | Anything structural. §2 decisions are settled: don't reopen them without Will               |
| UI behaviour and copy (rules UX-1...)                                       | `docs/design/ux-principles.md`                  | Any change to UI, user-facing text, interaction or motion in `apps/web`                     |
| Localisation setup, adding a string or a locale                             | `docs/design/README.md`                         | Adding or changing any user-facing string                                                   |
| How to build it on the web platform (dialogs, popovers, forms, CSS, INP...) | skill `modern-web-guidance` (`.claude/skills/`) | Before writing HTML, CSS or client-side JS in `apps/web`. The UX principles win on conflict |

## Commands

- Install: `pnpm install`. Run locally: `pnpm dev` (API and web; open the URL it prints).
- Before a PR: `pnpm check` (typecheck, lint, unit, parity and API tests). It is what CI runs.
- UI changes: also `pnpm smoke <dir>` (production build driven in headless Chromium; needs
  Playwright and Chromium). Check the change yourself in a browser, in light and dark (UX-38).
- Format: `pnpm format`.

## Rules

- **`packages/core` stays platform-independent** (D3): no DOM, Node built-ins, network or
  storage, so it runs unchanged in the browser, Node and React Native. ESLint enforces it;
  never disable that rule. Code that needs the platform goes in an app or an adapter.
- **Parity with the Python prototype is exact.** The feature and game parity tests in
  `tools/sim` must match the prototype's recorded output. Never edit a fixture, a recorded
  game or an expected value to make a test pass; re-record fixtures only the way the README
  says, and say why in the PR.
- **The server is the trust boundary** (D4): identity, saved games, LLM spend, quotas. It
  never runs Stockfish. UI gating (UX-16) is presentation only; the server check stays.
- **Never spend real LLM tokens** unless Will asks. Use `FAKE_LLM=1` locally and in tests; never set or read a
  real `ANTHROPIC_API_KEY`.
- **Migrations:** generate them with Drizzle from `apps/api/src/db/schema.ts`. Never run a
  migration against a production `DATABASE_URL`; production migrates during the Vercel build.
- **One change per PR.** Work on a branch. Guidance (this file, `CLAUDE.md`, `docs/design/**`,
  `.claude/skills/**`) changes in its own PR, never mixed with code.

## Conventions

- Strict TypeScript. No `any`, no `@ts-` comments, no `as` casts that hide a real type error.
  Avoid `!` non-null assertions: narrow instead (existing ones are not a pattern to copy).
- Named exports, no default exports. No barrel files inside a package; a package's `index.ts`
  is its public API.
- No TypeScript `enum`: use a union of string literals or an `as const` object.
- Comments explain why, not what.
- An optional parameter or prop with a default must be what nearly every caller wants;
  behaviour tied to one caller or flow is a required parameter (UX-37).
- Before writing a helper, search `packages/core/src` and `apps/web/src/lib` for one.
- Renames go through every layer (DB column, contract, types, functions, UI, tests). No
  compatibility aliases or re-exports of the old name.
- Zod (`packages/contract`) at every untrusted boundary: API requests and responses, env vars
  and LLM output. Don't validate data we read from our own database or pass between our own
  functions.
- Tests assert outcomes a user or caller can observe, not implementation detail. One test per
  behaviour, at the level that owns it. No `.skip` or `.only` left behind.

## Web platform

- **Browser support:** Baseline Widely available. Newer features only behind feature
  detection, with the fallback the `modern-web-guidance` guide gives.
- Guides from `modern-web-guidance` use plain HTML, CSS and JS; adapt them to React. When a
  guide spreads new HTML attributes with `as any`, declare the attribute instead (module
  augmentation of React's `HTMLAttributes` in `apps/web/src/html.d.ts`).

## User-facing text

Every string a user can see or hear comes from the message catalogue
(`apps/web/messages/<locale>.json`, rendered with `m.key()`), never a literal in a component
(UX-32). en-GB is the source locale. Copy follows `docs/design/ux-principles.md` (Copy): no em
dashes and no emoji in user-facing text.
