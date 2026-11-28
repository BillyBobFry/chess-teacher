# Architecture ledger

One entry per gardener run, newest last. Never rewrite an old entry.

## 2026-11-27: survey

- **Base:** origin/main 7f729e3; branch `claude/gardener-survey-2026-11-27`; PR #24

- **Frozen list:** changed since the skill's reference (`0c2a6da`):
  - `packages/core/src/diagnose.ts:58`: `isMate` now calls `balanceOf` in
    `packages/core/src/engine.ts:15` (7b12c99), which uses `MATE_BAND` (`engine.ts:6`). Same
    result for every score, but `balanceOf` and `MATE_BAND` are now inside frozen detection and
    also drive the balance-of-power display. Filed as ARCH-013.
  - `packages/core/src/session.ts` moved down 3 lines (version 6, `Branch.scores`):
    `activeLesson` :170, `chanceStillOpen` :195, `startUserTurn` :212, `userMove` :244 (the
    "fixed" check :261 to :270, superseding :272 to :287, `diagnose` and credit assignment
    :289 to :316), `opponentMove` :321, `hasLanded` :340, `checkConsequences` :344,
    `sendWaitingToReview` :378.
  - Every other frozen symbol is where the reference puts it. No new path creates or reveals
    lessons; `userMove`, `opponentMove` and `startUserTurn` call what they did.
- **Skipped (open PRs):** none: `gh pr list --state open` returned no PRs.
- **Did:** first survey; created `docs/gardener/` (`BACKLOG.md`, `GLOSSARY.md`, this ledger; no
  ADRs yet, as William has decided nothing in a session). Started at
  `packages/core/src/session.ts` (read in full, with the frozen entry points it calls), then traced each glossary
  term through core, lesson-text, contract, API, web and `tools/sim`, and ran drift checks 1 to 14. `apps/web/src` and the docs were also read in full by two read-only passes; their findings
  were checked against the code before filing. Added ARCH-001 to ARCH-026:
  - refactor: 001, 003, 005 to 011, 017 to 019, 021 to 024, 026
  - tests-first: 004, 020
  - bug: 002, 025
  - guidance: 012, 013, 015, 016
  - decision: 014
- **Proven:** no source changes; `pnpm exec prettier --check .` passes; `git status` shows changes
  under `docs/gardener/` only.
- **Left deliberately:**
  - Known items the skill already lists: the emoji icons (UX-31 known gap), the landing page, the
    board's keyboard grid, `pyRound` and the other prototype-parity rules (check 9), the material
    balance written inline in frozen bodies, chess.js `Move` as the UI's move type.
  - `GameOutcome` declared in both the core and the contract (`packages/core/src/session.ts:404`,
    `packages/contract/src/index.ts:84`): the contract depends on `zod` only, so it may be
    deliberate; not filed until William says.
  - Hand-built feature lessons through `detectMistake` in four test files (check 11): they test
    the older lesson path, which saved games still hold.
  - `apps/api/src/vercel.ts` has a default export, which Vercel's function entry needs.
  - Smaller web notes from the read-only pass, not filed: `ARROW` (`Board.tsx:14`) and
    `MOVE_ARROW` (`MoveButton.tsx:13`) colour the player's move differently on two boards
    (possibly deliberate: ask before filing); `AiExplanation.tsx` exports `LessonExplanation`;
    `Review.tsx:62` names a local `lineMoves` like the `lib/moves.ts` function; `playedLine`
    computed twice at `Reveal.tsx:111`, `:112`; casts in `game/storage.ts:38`, `:56`, `:97` and
    `Principle.tsx:113`; `!` on `lessons.find` at `App.tsx:408`, `useGame.ts:300`, `:383`.
  - `apps/api/src/explain.ts:136` casts the Anthropic client with `as unknown as LlmClient`; left
    with ARCH-003's area, not filed.
- **Bugs seen:** ARCH-002 (feedback stores "null" for a lesson with no concept), ARCH-025 (the
  progress page has no retry). ARCH-014 also notes that `near-miss.ts` and `audit-real-games.ts`
  always report 0 unverified lessons and `validate-lessons.ts` reports nothing for current games.

## 2026-11-27: decision ARCH-001

- **Base:** origin/main 7f729e3; branch `claude/gardener-survey-2026-11-27`; PR #24
- **Frozen list:** unchanged from the survey entry above
- **Skipped (open PRs):** none
- **Did:** William decided the word for ARCH-001 in session: "principle" is the umbrella, and the
  two kinds of id are told apart by source (`"features"`, `"diagnosis"`). Recorded as ADR 0001;
  ARCH-001's proposed move and the glossary's principle rows updated. ARCH-001 stays `proposed`:
  the word is decided, shipping it is not yet approved.
- **Proven:** docs only; `pnpm exec prettier --check .` passes.
- **Left deliberately:** the `free_material` id shared by a principle and a concept (noted in
  the ADR as open).
- **Bugs seen:** none

## 2026-11-27: tend ARCH-001

- **Base:** origin/main 6e1427c; branch `claude/gardener-arch-001-principle`; PR #25
- **Frozen list:** unchanged from the survey entry: no commits to `packages`, `apps` or `tools`
  since 7f729e3. This item touches no frozen file.
- **Skipped (open PRs):** none
- **Did:** "principle" is the umbrella for what progress counts (ADR 0001). The contract's
  `PrincipleKind = "principle" | "concept"` became `PrincipleSource = "features" | "diagnosis"`, and
  `PrincipleProgress.kind` became `source`. The API's `ideaOf`, `isIdea` and `byIdea` became
  `principleOf`, `isPrinciple` and `byPrinciple`, and its route became
  `/api/me/progress/:source/:id`. The web router's principle route carries `source`, and maps it to
  the unchanged page URLs (`/app/progress/principle/:id`, `/app/progress/concept/:id`). 74 non-test
  lines added and 58 removed, across 11 files; no moves. `App.tsx` and `PastGame.tsx` were call
  sites the survey hadn't listed.
- **Proven:** `pnpm check` passes, before (on 6e1427c) and after: 15 test files, 150 tests, none
  skipped. `pnpm exec prettier --check .` passes. `pnpm smoke` passes, including the progress page
  and a principle's lessons, whose URL it checks. In the browser pane against the production
  build, with a test account and a replayed recorded game: the progress page and a principle page
  in light and dark, the principle page's URL unchanged and reloadable, no console errors; the API
  returns `source` and 404s the old `concept` segment. Recordings untouched (`git diff --name-only`
  over `tools/sim/fixtures`, `tools/sim/games` and `packages/engine/test/fixtures` prints nothing).
  No frozen file touched, so no declaration proof was needed. The test changes are the renamed
  field and the API's new path segments (`features`, `diagnosis`), with the same assertions.
- **Left deliberately:** the coach prompt's use of "idea" (`apps/api/src/explain.ts:224`), which is
  content; the `free_material` id shared by a principle and a concept (open in ADR 0001).
- **Bugs seen:** none new.

## 2026-11-28: tend ARCH-011

- **Base:** origin/main ea03d9c; branch `claude/gardener-arch-11-lesson-kinds`; PR #28
- **Frozen list:** unchanged from the 2026-11-27 survey entry: no commits to
  `packages/core/src` or `packages/engine/src/eval-trace.ts` since 7f729e3, and every frozen
  symbol is where that entry puts it. This item touches no frozen file; it imports the core's
  `CONSEQUENCE`, `MISSED_CHANCE` and `MATE_FEATURE` (`packages/core/src/lessons.ts:21` to `:24`)
  without changing them.
- **Skipped (open PRs):** none: the only open PR, #27 (survey 2026-11-28), touches
  `docs/gardener/` only and leaves ARCH-011's entry as it is. Both append to this ledger, so
  whichever merges second needs a rebase.
- **Did:** William approved ARCH-011 in session and chose no alternative, so it took the proposed
  move: the web app names a lesson kind with the core's constants. `"consequence"` became
  `CONSEQUENCE` in `Reveal.tsx` (three sites), `Explanation.tsx`, `LessonRow.tsx` and
  `useGame.ts`; `"missed_chance"` became `MISSED_CHANCE` in `LessonRow.tsx` and
  `AiExplanation.tsx`; `"mate"` became `MATE_FEATURE` in `Explanation.tsx`. 15 non-test lines
  added and 11 removed, across 5 files; no moves; no test changes.
- **Proven:** `pnpm check` passes, before (on ea03d9c) and after: 14 test files passed and 1
  skipped, 153 tests passed and 1 skipped, both times (the skip is
  `packages/engine/test/node.test.ts`, which needs a native Stockfish). Prettier's check passes.
  `pnpm smoke` passes, all 25 steps, including the consequence reveal, its explanation, and the
  review's lesson rows. The same smoke run with the browser in dark mode (a temporary copy of the
  script, deleted after) also passes all 25; the reveal and the review look the same in light and
  dark. No `"consequence"`, `"missed_chance"` or `feature === "mate"` literal is left in
  `apps/web/src`. Recordings untouched (`git diff --name-only` over `tools/sim/fixtures`,
  `tools/sim/games` and `packages/engine/test/fixtures` prints nothing). No frozen file touched,
  so no declaration proof was needed.
- **Left deliberately:** the kind used as a CSS class on the reveal's headline (`Reveal.tsx:86`),
  matched in `styles.css`, as the item says. `balance.kind === "mate"` in
  `apps/web/src/lib/balance.ts` is the balance-of-power kind, a different concept. Feature names
  compared as literals (`"material"` at `Reveal.tsx:59`) are not lesson kinds.
- **Bugs seen:** none.

## 2026-11-28: tend ARCH-010

- **Base:** origin/main 4c373f8; branch `claude/gardener-arch-10-reveal-state`; PR #29
- **Frozen list:** unchanged from the 2026-11-27 survey entry: no commits to
  `packages/core/src` or `packages/engine/src` since 7f729e3. This item touches no frozen file.
- **Skipped (open PRs):** none: the only open PR, #27 (survey 2026-11-28), touches
  `docs/gardener/` only and leaves ARCH-010's entry as it is. Both append to this ledger, so
  whichever merges second needs a rebase.
- **Did:** William approved ARCH-010 in session. `Reveal.tsx` imports `RevealState` from
  `@chess-teacher/contract`, and `apps/web/src/game/storage.ts` no longer re-exports it (it still
  imports it for `SavedGame.reveal`). Nothing else imported it through storage. 1 non-test line
  added and 3 removed, across 2 files; no moves; no test changes.
- **Proven:** `pnpm check` passes, before (on 4c373f8) and after: 14 test files passed and 1
  skipped, 153 tests passed and 1 skipped, both times (the skip is
  `packages/engine/test/node.test.ts`, which needs a native Stockfish). Prettier's check passes.
  The change is type-only (`import type`, `export type`), erased at build, so the bundle and what
  the player sees are unchanged. `pnpm smoke` passes, all 25 steps; the same run with the browser
  in dark mode (a temporary copy of the script, deleted after) also passes all 25, and the reveal
  looks the same in light and dark. Recordings untouched
  (`git diff --name-only` over `tools/sim/fixtures`, `tools/sim/games` and
  `packages/engine/test/fixtures` prints nothing). No frozen file touched, so no declaration
  proof was needed.
- **Left deliberately:** two more re-exports of an imported name, not in the backlog, for the
  next survey to judge: `export type { Key }` from React Aria in `apps/web/src/ui/Disclosure.tsx:11`
  (imported through it by five components; the `ui/` wrapper may be meant to own it) and
  `export { schema }` in `apps/api/src/db/client.ts:57`.
- **Bugs seen:** ARCH-030: in the reveal's smoke screenshot, light and dark, the full stop after
  a wrapped line of moves sits on a line of its own. Already on main; not fixed here.

## 2026-11-28: tend ARCH-007

- **Base:** origin/main 8c8e3bc; branch `claude/gardener-arch-7-fen-fields`; PR #30
- **Frozen list:** unchanged from the 2026-11-27 survey entry: no commits to
  `packages/core/src` or `packages/engine/src` since 7f729e3. This item touches no frozen file.
- **Skipped (open PRs):** none: the only open PR, #27 (survey 2026-11-28), touches
  `docs/gardener/` only and leaves ARCH-007's entry as it is. Both append to this ledger, so
  whichever merges second needs a rebase.
- **Did:** William approved ARCH-007 in session. Seven sites that split a FEN by hand now call the
  core's `turnOf` or `fullmoveOf`: `MoveList.tsx:37`, `maia.ts:100`, the max-moves stop in
  `record-games.ts`, `simulate.ts` and `validate-lessons.ts` (as `near-miss.ts` already did),
  `audit-real-games.ts:213` and `bench/build-items.ts:181`. Same result for every valid FEN; they
  differ only on a FEN missing its move number or with a side to move other than `w` or `b`,
  which chess.js and the recorded positions never produce. 14 non-test lines added and 10
  removed, across 7 files; no moves; no test changes.
- **Proven:** `pnpm check` passes, before (on 8c8e3bc) and after: 14 test files passed and 1
  skipped, 153 tests passed and 1 skipped, both times (the skip is
  `packages/engine/test/node.test.ts`, which needs a native Stockfish). Prettier's check passes.
  `pnpm smoke` passes all 25 steps; the same run in dark mode (a temporary copy of the script,
  deleted after) also passes all 25, and the move list looks the same in light and dark. The
  smoke game starts from the initial position, so it covers only `MoveList`'s white-to-move
  branch. Recordings untouched (`git diff --name-only` over `tools/sim/fixtures`,
  `tools/sim/games` and `packages/engine/test/fixtures` prints nothing); `record-games.ts`
  changed only in its stopping test, which stops at the same move, and nothing was re-recorded.
  No frozen file touched, so no declaration proof was needed.
- **Left deliberately:** `maia.ts:41` also reads the side to move by hand, but it takes the
  placement from the same split and is not in the item. `bench/build-items.ts:97` builds a
  null-move FEN by editing fields, a twin of the core's frozen `nullMoveFen` (`claims.ts:517`),
  for the next survey to judge. The core's own parsers (`board.ts:72`, `claims.ts:520`) are frozen.
- **Bugs seen:** none.

## 2026-11-28: tend ARCH-008

- **Base:** origin/main fd8ec57; branch `claude/gardener-arch-8-sim-win-pct`; PR #31
- **Frozen list:** unchanged from the skill's reference apart from line numbers in `session.ts`
  (each three lines later, from ARCH-007's import). This item touches no frozen file:
  `audit-real-games.ts` calls `detectMistake`, `verifyLesson`, `consequenceLanded` and
  `awaitedHappened`, and those calls are untouched.
- **Skipped (open PRs):** none: the only open PR, #27 (survey 2026-11-28), touches
  `docs/gardener/` only and leaves ARCH-008's entry as it is. Both append to this ledger, so
  whichever merges second needs a rebase.
- **Did:** William approved ARCH-008 in session. `winPct` and `sanToUci` now live once, in the
  new `tools/sim/src/lichess.ts`, lifted unchanged from `bench/build-items.ts`, and both
  `audit-real-games.ts` and `bench/build-items.ts` import them. `build-items.ts` exported its
  `winPct`, but nothing imported it. 23 non-test lines added and 32 removed, across 3 files; of
  the 21 lines in `lichess.ts`, 13 are the two bodies moved verbatim; no test changes.
- **Proven:** `pnpm check` passes, before (on fd8ec57) and after: 14 test files passed and 1
  skipped, 153 tests passed and 1 skipped, both times (the skip is
  `packages/engine/test/node.test.ts`, which needs a native Stockfish). Prettier's check passes.
  The removed `audit-real-games.ts` copies are written differently (it clamps after the mate
  test, and names the move before pushing it), so a throwaway script outside the repo compared
  them with the shared copies: `winPct` gives the same result for every integer score from
  -10000 to 10000, and `sanToUci` the same moves for a sample game. Recordings untouched
  (`git diff --name-only` over `tools/sim/fixtures`, `tools/sim/games` and
  `packages/engine/test/fixtures` prints nothing). No frozen file touched, so no declaration
  proof was needed. No `apps/web` change, so no smoke run.
- **Left deliberately:** the mate band. The shared `winPct` and `build-items.ts`'s `mateIn` still
  treat a score within 500 of `MATE_SCORE` as mate, where the core's `balanceOf` uses
  `MATE_BAND` (300); whether the tools should call the core's `winChance` and `balanceOf`
  instead changes benchmark numbers and is William's question, as the item says.
- **Bugs seen:** none.

## 2026-11-28: tend ARCH-009

- **Base:** origin/main 5ccf1f7; branch `claude/gardener-arch-9-engines-weak`; PR #32
- **Frozen list:** unchanged from the skill's reference apart from line numbers in `session.ts`
  (each three lines later, from ARCH-007's import); no commits to `packages/core/src` or
  `packages/engine/src/eval-trace.ts` since 0c2a6da beyond the review replay (7b12c99, 67b5f67),
  which added no lesson path. This item touches one frozen symbol: `chooseOpponentMove`
  (`packages/core/src/opponent.ts:12`, treated as frozen), where `engines.weak` becomes
  `engines.opponent`. `towardsEvent` in the same file is untouched.
- **Skipped (open PRs):** none: the only open PR, #27 (survey 2026-11-28), touches
  `docs/gardener/` only and leaves ARCH-009's entry as it is. Both append to this ledger, so
  whichever merges second needs a rebase.
- **Did:** William approved ARCH-009 in session, with the item's suggested name. `Engines.weak` is
  now `Engines.opponent`, and its comment says what it is ("the opponent's normal moves") rather
  than "a weakened opponent". Every layer follows: the core type and `chooseOpponentMove`, the
  web app's Maia engine (`engines.ts`, whose local is now `opponent` too), the five
  `tools/sim/src` scripts that build `Engines`, and the replay set-ups in
  `tools/sim/test/games.ts`, `apps/api/test/api.test.ts`, `apps/web/scripts/smoke.ts` and
  `packages/core/test/core.test.ts`. The recordings keep their `engineCalls.weak` key (and
  `RecordedGame`'s type and `record-games.ts`'s writer with it), so the replay set-ups map that
  key to the new field. `GLOSSARY.md`'s opponent-mode row now names `Engines.opponent`. 14 non-test lines added and 11 removed, across 9 files (Prettier
  re-wrapped the one changed line in `chooseOpponentMove` over four); no moves; tests changed
  only in the field name and the replay engine's label in error messages.
- **Proven:** `pnpm check` passes, before (on 5ccf1f7) and after: 14 test files passed and 1
  skipped, 153 tests passed and 1 skipped, both times (the skip is
  `packages/engine/test/node.test.ts`, which needs a native Stockfish). Prettier's check passes.
  The declaration proof over `packages/core/src` and `packages/engine/src`, with
  `--rename engines.weak=engines.opponent` on the `origin/main` side, differs only in the
  `Engines` interface (the renamed field, not frozen); `chooseOpponentMove` is identical. Every
  recorded-game replay passes, so the core asks the engines nothing new. Recordings untouched
  (`git diff --name-only` over `tools/sim/fixtures`, `tools/sim/games` and
  `packages/engine/test/fixtures` prints nothing). `pnpm smoke` passes all 25 steps, and its
  game's opponent replies (1. e4 e5) through the browser's Maia engine; a throwaway script
  outside the repo, against the same build in dark mode, played 1. d4 and got 1... d5 with no
  page errors, and the game screen looks the same in light and dark.
- **Left deliberately:** the recordings' `engineCalls.weak` key, `RecordedGame`'s matching type
  and the writer in `record-games.ts`: renaming them means editing or re-recording the games,
  which `AGENTS.md` forbids for this. The `weak` locals in `near-miss.ts`, `record-games.ts`,
  `simulate.ts` and `validate-lessons.ts` stay: there the opponent really is a skill-limited
  Stockfish. `docs/architecture.md` §6 and §12 still say a weakened Stockfish plays the opponent;
  that is ARCH-015's (guidance) to fix, not a tend run's.
- **Bugs seen:** none.
