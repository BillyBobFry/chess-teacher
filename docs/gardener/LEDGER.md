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
