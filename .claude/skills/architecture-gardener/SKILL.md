---
name: architecture-gardener
description: Use when William asks to survey the architecture, tidy a concept, or ship a backlog item ("survey the architecture", "tidy how moves are named", "tend ARCH-004"). A survey writes a docs-only backlog under docs/gardener/; tend ships one approved, behaviour-neutral refactor as one PR.
---

# Architecture gardener

Keeps Chess Teacher's structure tidy without changing what it teaches. Two modes, run only
when William asks in a Claude Code session. There is no scheduler, no cron and no auto-merge.

- **survey**: read the code, write or update `docs/gardener/` (backlog, ledger, glossary,
  ADRs). No source changes. Ships as its own docs-only PR.
- **tend ARCH-n**: ship exactly one approved backlog item as one PR.

"Tidy a concept" is a survey scoped to one concept (start there, then the usual whole-app pass).

## Read at run time (they win on conflict)

This skill points at the repo's rules; it does not copy them. Read these at the start of every
run, and when one disagrees with this skill, the repo file wins:

- `AGENTS.md`: conventions, PR rules, commands. Mandatory.
- `docs/architecture.md` §2: the settled decisions (D1 to D16 at the time of writing; read the
  table, it grows). Never reopen one: record a `decision` item in the backlog instead.
- `docs/concept.md`: what a lesson is and when it fires, before judging any teaching code.
- `docs/design/ux-principles.md` and `docs/design/components.md`: for anything in `apps/web`.
  Cite a UX rule by number only after reading it.
- `docs/design/README.md`: for anything that touches a user-facing string.

| Reference                                                      | Read when                                                           |
| :------------------------------------------------------------- | :------------------------------------------------------------------ |
| [references/frozen-code.md](references/frozen-code.md)         | Every run: re-derive the frozen list; before touching core teaching |
| [references/tiers.md](references/tiers.md)                     | Giving an item a tier, or before tending one                        |
| [references/drift-checks.md](references/drift-checks.md)       | Running a survey                                                    |
| [references/backlog-formats.md](references/backlog-formats.md) | Creating or editing anything under `docs/gardener/`                 |

## The rules a gardener PR most often breaks

All are in `AGENTS.md` (Rules, Conventions, User-facing text); read the detail there.

- Named exports only, no default exports, no barrel files inside a package (a package's
  `index.ts` is its public API).
- No `any`, no `@ts-` comments, no hiding `as` casts, no TypeScript `enum`; avoid `!`.
- A rename goes through every layer (DB column, contract, types, functions, UI, tests) with no
  compatibility alias or re-export of the old name.
- Every user-visible string comes from the message catalogue (`m.key()`); lesson text goes
  through `packages/lesson-text`.
- Zod only at untrusted boundaries (API requests and responses, env vars, LLM output), never
  over our own data.
- A behaviour tied to one caller is a required parameter, not an optional one with a default.
- `packages/core` stays platform-independent (D3); the server never runs Stockfish (D4).
- One change per PR; guidance (`AGENTS.md`, `CLAUDE.md`, `docs/design/**`, `.claude/skills/**`)
  only in its own PR. The gardener never edits guidance, `docs/architecture.md` or
  `docs/concept.md`: it files a `guidance` item for William instead.

## Frozen code and content

William's decision: the app has no users, so almost anything may change, **except the
internals of lesson detection, the classical-evaluation check, and triggers**. They may be
moved, renamed, split across files, re-imported and have their call sites changed; their logic,
constants, thresholds and ordering may not change. The list, how to re-derive it and how to
prove a move changed nothing are in `references/frozen-code.md`.

What players are taught is content: the LLM prompts in `apps/api/src/explain.ts`, the lesson
text in `packages/lesson-text` and the message catalogue. Move code around them; never reword
them.

If an item would change what a lesson says or when it fires, do not ship it. File it as a
`finding` (a lesson-quality finding) for William to decide.

## Guard rails

- Never spend LLM tokens. Tests use a fake client; anything that runs the API runs with
  `FAKE_LLM=1`. Never read, print or set a real `ANTHROPIC_API_KEY`, and never read
  `apps/api/.env`.
- Never run a migration or any command against a real `DATABASE_URL`. Locally the API uses
  embedded PGlite when `DATABASE_URL` is unset; keep it unset.
- Never edit recorded data or an expected value to make a test pass: `tools/sim/fixtures/`,
  `tools/sim/games/`, `packages/engine/test/fixtures/`. A replay that fails with "no recorded
  analysis" means the change altered what the core asks the engine: it is not behaviour-neutral.
- Never approve an item on William's behalf. Never merge, never enable auto-merge, never
  schedule anything.
- Every PR targets `main`, branched from `origin/main`; `main` keeps a linear history.

## Mode: survey

1. `git fetch origin`, then `git switch -c claude/gardener-survey-<yyyy-mm-dd> origin/main`.
2. Read the run-time files above. Re-derive the frozen list (`references/frozen-code.md`,
   "Re-derive"); note any difference from the reference in the ledger entry.
3. List files touched by open PRs (`gh pr list --state open --json number,files`; without
   `gh`, `git branch -r --no-merged origin/main` and `git diff --name-only origin/main...<branch>`
   per branch, or ask William). Skip those files: no new items on them; the ledger says which.
4. Start where William pointed (an area, a file or a concept); with no pointer, start at
   `packages/core/src/session.ts`. Follow imports out of it, file by file, and note each
   concept you meet.
5. Then one concept-first pass across the whole app: take each concept in `GLOSSARY.md` (or the
   seed in `references/backlog-formats.md` on a first run) and trace it through every layer:
   core, lesson-text, contract, API, web, tools/sim. Run the checks in
   `references/drift-checks.md`.
6. For each candidate: confirm it in the code with `path:line`; check it against `BACKLOG.md`
   (update the evidence of an existing item instead of adding a duplicate; leave rejected items
   rejected unless the evidence is new, and say what is new); give it a concept tag, a kind and
   a tier (`references/tiers.md`).
7. Write `docs/gardener/` (create it on a first run from `references/backlog-formats.md`): new
   and updated items in `BACKLOG.md`, the pinned vocabulary in `GLOSSARY.md`, one entry in
   `LEDGER.md`. A survey that finds nothing new is a valid result: the ledger says so.
8. `pnpm exec prettier --write docs/gardener`, then `pnpm exec prettier --check .`.
   `git status` shows changes under `docs/gardener/` only.
9. Commit, push, and open a docs-only PR against `main` titled "Gardener survey <date>". Do
   not merge. Report the new items to William by id, tier and one line each.

## Mode: tend ARCH-n

Each step ends with its check; do not go on until it holds.

1. **Approved.** The item's status in `BACKLOG.md` is `approved`, or William approved it in this
   session (then set it to `approved` in this PR, noting the date). Its kind is `refactor` or
   `tests-first`, and a T1 `refactor` has its tests-first item shipped. Check: none of
   `finding`, `guidance`, `decision`, `bug`, and nothing that changes frozen logic.
2. **Branch.** `git fetch origin`, then `git switch -c claude/gardener-arch-<n>-<slug> origin/main`.
   Check: `git merge-base HEAD origin/main` equals `git rev-parse origin/main`. If the item
   needs an unmerged PR, stop and tell William.
3. **Frozen list.** Re-derive it (`references/frozen-code.md`). Check: you can name every frozen
   symbol in the files this item touches.
4. **Still true.** Re-read the item's evidence on current `main`. Check: the lines still say
   what the item claims; if not, stop and report (the next survey updates the item).
5. **Baseline.** `pnpm check 2>&1 | tee /tmp/gardener-baseline.log`. Check: it passes. If it
   fails on `main`, stop and report; do not fix it inside the refactor.
6. **Change.** Make the move the item proposes, one concept only, following `AGENTS.md`. Keep it
   to about 300 changed non-test lines, counting pure file moves and renames separately (see
   `references/tiers.md`, "Counting lines"). Check: `git diff --stat origin/main` shows only
   files the item names, plus `docs/gardener/`.
7. **Verify.** `pnpm check`; `pnpm exec prettier --check .`; when `apps/api/src/db/schema.ts`
   or `apps/api/drizzle/` changed, `pnpm --filter @chess-teacher/api db:check`. For `apps/web`
   changes only, `pnpm smoke <dir>` and a look in a browser in light and dark, as `AGENTS.md`
   says; if Playwright or Chromium is missing, say so plainly, never claim it passed. Check: all
   pass, and no test was skipped that passed in the baseline.
8. **Prove frozen code unchanged** if any frozen file was touched (`references/frozen-code.md`,
   "Proving nothing changed"). Check: the declaration diff is empty for frozen names, and
   `git diff --name-only origin/main -- tools/sim/fixtures tools/sim/games packages/engine/test/fixtures`
   prints nothing.
9. **Records.** In the same PR: the item's status becomes `shipped` with the branch name, and a
   `LEDGER.md` entry says what moved, what was proven, what was left and any bugs seen. Bugs
   are filed as `bug` items, never fixed in this PR. Check: `prettier --check` still passes.
10. **PR.** Commit (ending with the session's attribution lines), push, and open one PR against
    `main`. The description says: the item and tier; what moved; non-test lines changed, with
    moves and renames counted apart; what was proven (commands and results); what was
    deliberately left. A tests-first PR is titled and labelled as one; never pass a tests-only
    PR off as the refactor. Never merge. Check: the PR exists and targets `main`.
11. **Read it back.** `gh pr view <n>` and `gh pr diff <n> --name-only` (or
    `git diff --stat origin/main...HEAD` without `gh`). Check: files and description match what
    you did. Then report to William: PR link, what moved, what was proven, what was left.

Guidance changes (this skill included) are never made by a tend run: file a `guidance` item.
