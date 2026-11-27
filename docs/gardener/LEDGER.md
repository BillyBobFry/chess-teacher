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
