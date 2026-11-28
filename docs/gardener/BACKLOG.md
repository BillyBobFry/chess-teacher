# Architecture backlog

Written by the architecture gardener (`.claude/skills/architecture-gardener/`). Only William
approves an item: he says so in a session, or sets its status to `approved` here.

Statuses: proposed, approved, shipped, rejected, deferred. Tiers: T0, T1, FROZEN (see the
skill's `references/tiers.md`).

## ARCH-001: One name for what progress counts: "principle"

- **Concept:** principle
- **Kind:** refactor
- **Files:** `apps/api/src/progress.ts:39`, `:47`, `:70` (`ideaOf`, `isIdea`, `byIdea`),
  `apps/api/src/app.ts:196` to `:200`, `packages/contract/src/index.ts:182` to `:198`
  (`PrincipleKind`, `PrincipleProgress.kind`), `apps/web/src/lib/router.ts:17`, `:70`, `:71`,
  `apps/web/src/components/Principle.tsx`, `apps/web/src/components/Progress.tsx`,
  `apps/web/src/api/client.ts`, `apps/web/src/api/queries.ts`; also `apps/web/src/App.tsx` and
  `apps/web/src/components/PastGame.tsx`, which the survey missed (the typecheck found them)
- **Why it matters:** "Principle" named both the umbrella and one of its two members
  (`PrincipleKind = "principle" | "concept"`), and the API called the same umbrella an "idea".
  Code that reads `principle` couldn't tell whether it meant a curriculum principle only, and the
  drill-down page (04be4af) spread the ambiguity to routes and queries.
- **Proposed move:** As decided in ADR 0001: "principle" is the umbrella everywhere.
  - API: `ideaOf`, `isIdea` and `byIdea` become `principleOf`, `isPrinciple` and `byPrinciple`.
  - The discriminator says where the id comes from, with the values `Lesson.source` already has:
    `PrincipleKind = "principle" | "concept"` becomes `PrincipleSource = "features" | "diagnosis"`
    (declared in the contract, which doesn't depend on the core), and `PrincipleProgress.kind`
    becomes `source`. The API route's segment follows (`/api/me/progress/:source/:id`).
  - Web: the router's `{ page: "principle"; kind }` becomes `{ page: "principle"; source }`. The
    page's URLs stay `/app/progress/principle/:id` and `/app/progress/concept/:id`; the router maps
    each segment to its source.
  - Unchanged: the core's `PrincipleId` and `ConceptId`, `principleTitle` and `conceptTitle`, every
    catalogue key, saved JSON, and the `lesson_feedback.principle` column, which is now correctly
    named (it holds a principle in the umbrella sense).
- **Tier:** T0 (typecheck across contract, API and web; `apps/api/test/api.test.ts` progress
  tests; `apps/web/test/router.test.ts`)
- **Status:** shipped (approved by William in session, 2026-11-27)
- **Needs:** none (the word is decided: ADR 0001)
- **Evidence:** read on origin/main 7f729e3, 2026-11-27. Drift check 6. The contract's own
  comment says "What a progress id names: a principle (older lessons) or a concept". Decision
  recorded 2026-11-27 (ADR 0001). Shipped on branch `claude/gardener-arch-001-principle`, PR #25.

## ARCH-002: Feedback on a diagnosed lesson with no concept stores the text "null"

- **Concept:** concept
- **Kind:** bug
- **Files:** `apps/api/src/app.ts:332`, `packages/core/src/lessons.ts:180`
- **Why it matters:** `DiagnosedLesson.concept` is `ConceptId | null`, and the feedback route
  stores `String(lesson.concept)` in `lesson_feedback.principle`. A rating on a lesson with no
  concept is saved under the concept "null", so analysis by concept counts a concept that
  doesn't exist. `apps/api/src/progress.ts:42` already skips these lessons for progress.
- **Proposed move:** For William: store the mistake kind, an empty string or make the column
  nullable (a migration). Not fixed in any refactor PR.
- **Tier:** T0 (`api.test.ts` covers feedback)
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27, while tracing "concept" through the API.
  Still true on ea03d9c, 2026-11-28: `apps/api/src/app.ts:332` unchanged by ARCH-001.

## ARCH-003: The coach's explanation parts: one schema in the contract, used to parse the LLM's output

- **Concept:** explanation
- **Kind:** refactor
- **Files:** `apps/api/src/explain.ts:81` (`ExplanationParts`), `apps/api/src/explain.ts:140`
  (`parseParts`), `packages/contract/src/index.ts:116` (`ExplanationParts`)
- **Why it matters:** `ExplanationParts` is declared twice with the same fields, so a field
  added to one compiles while the API and the web app disagree. And `AGENTS.md` asks for Zod at
  LLM output; `parseParts` checks the JSON by hand with an `as` cast.
- **Proposed move:** Declare `ExplanationPartsSchema` (Zod) in `packages/contract`, derive the
  type from it, and have `parseParts` use `safeParse` with the same rules (three non-blank
  strings, optional string `concept`). `apps/api/src/explain.ts` drops its own interface. No
  prompt text touched.
- **Tier:** T0 (typecheck pins the shape; the "structured explanations" and guardrail tests in
  `apps/api/test/api.test.ts` pin parsing)
- **Status:** proposed
- **Needs:** none
- **Evidence:** both declarations and `parseParts` read on origin/main 7f729e3, 2026-11-27;
  drift checks 8 and 13.

## ARCH-004: Tests for reading the server's environment

- **Concept:** configuration
- **Kind:** tests-first
- **Files:** `apps/api/src/env.ts:31`, `apps/api/test/api.test.ts:132`, `:464` to `:500`
- **Why it matters:** `readEnv` is only tested through trusted origins and the allowance. Before
  ARCH-005 changes how it parses, its observable outcomes need pinning: defaults (model,
  allowance of 30, PGlite when `DATABASE_URL` is unset), production without
  `BETTER_AUTH_SECRET` throwing, Google only with both id and secret.
- **Proposed move:** Add those cases to `apps/api/test/` with fake environment objects. No source
  change.
- **Tier:** T1
- **Status:** proposed
- **Needs:** none
- **Evidence:** test file read on origin/main 7f729e3, 2026-11-27.

## ARCH-005: Environment variables through a Zod schema

- **Concept:** configuration
- **Kind:** refactor
- **Files:** `apps/api/src/env.ts:31` to `:59`
- **Why it matters:** `AGENTS.md` asks for Zod at env vars; `readEnv` reads them by hand. A
  mistyped `FREE_COACHED_GAMES_PER_MONTH` becomes `NaN` silently (`env.ts:58`), and the
  allowance then compares against `NaN` instead of failing at start-up.
- **Proposed move:** Parse the variables with a Zod schema in `apps/api/src/env.ts`, keeping
  every default and the production secret rule. Whether a bad number should fail at start-up
  (a behaviour change) is William's call; the refactor itself keeps today's results for valid
  input.
- **Tier:** T1, with the extra guard for auth and the allowance (`references/tiers.md`)
- **Status:** proposed
- **Needs:** ARCH-004
- **Evidence:** read on origin/main 7f729e3, 2026-11-27; drift check 13.

## ARCH-006: Drop `export` from names no other file uses

- **Concept:** (structure)
- **Kind:** refactor
- **Files:** `packages/core/src/index.ts` (`export *` from all 16 modules), and these exports with
  no user outside their own file: core `attacksFrom`, `attackersOf`, `Capture` (`board.ts`),
  `MotifFound`, `netKey`, `positionBefore` (`claims.ts`), `ConceptFamily`, `rankConcepts`
  (`concepts.ts`), `DiagnoseConfig`, `winChance`, `ScanResult`, `PreviousMove` (`diagnose.ts`),
  `ClaimFact` (`explain.ts`), `kingShield`, `kingZoneAttacks`, `centreControl`, `PawnStructure`,
  `pawnStructure`, `pawnWeaknessCount`, `describePawns`, `rooksOnOpenFiles`, `isEndgame`,
  `centreDistance` (`features.ts`), `UciParts` (`game.ts`), `PRINCIPLE_IDS` (`principles.ts`),
  `ReviewItem` (`review.ts`), `GameEventKind`, `StepResult`, `activeLesson` (`session.ts`),
  `FEATURE_TERMS`, `gamePhase`, `VerdictOptions`, `DEFAULT_VERDICT_OPTIONS`, `lineEndFen`
  (`validate.ts`); engine `MAIA_HISTORY`, `MAIA_FEATURES` (`maia.ts`), `UciScore`, `InfoLine`
  (`uci.ts`); lesson-text `pieceOnText`, `mistakeTitle`; API `AppDeps` (`app.ts`),
  `SYSTEM_PROMPT`, `languageName`, `systemPrompt`, `ExplanationResult`, `GameSoFar`
  (`explain.ts`), `restorePath` (`vercel.ts`); web `Segment` (`lib/moves.ts`), `MAX_RETRIES`,
  `shouldRetry` (`api/queries.ts`), `GameApi` (`game/useGame.ts`)
- **Why it matters:** Because the core's `index.ts` re-exports every module whole, every helper
  is public API, and nothing tells the next person which ones other packages rely on. Unused
  exports also hide dead code from the linter.
- **Proposed move:** Drop `export` from the names above where the type isn't part of another
  export's signature (a type used in an exported signature stays exported). Many are frozen
  declarations: dropping `export` is an allowed move; run the declaration proof in
  `references/frozen-code.md`. Whether the core's `index.ts` should list its public API
  explicitly instead of `export *` is a separate question for William.
- **Tier:** T0 (typecheck and lint)
- **Status:** proposed
- **Needs:** none
- **Evidence:** drift check 10 on origin/main 7f729e3, 2026-11-27 (54 names, rechecked by hand for
  the ones above).

## ARCH-007: FEN fields read by hand where the core has `turnOf` and `fullmoveOf`

- **Concept:** FEN
- **Kind:** refactor
- **Files:** `apps/web/src/components/MoveList.tsx:37`, `packages/engine/src/maia.ts:100`,
  `tools/sim/src/record-games.ts:73`, `tools/sim/src/simulate.ts:97`,
  `tools/sim/src/validate-lessons.ts:82`, `tools/sim/src/audit-real-games.ts:212`,
  `tools/sim/src/bench/build-items.ts:181`
- **Why it matters:** Each site splits the FEN and indexes a field itself; the core has
  `turnOf` and `fullmoveOf` (`packages/core/src/game.ts:34`, `:35`), and these sites drift from
  them unnoticed if the core's handling changes.
- **Proposed move:** Call `turnOf` / `fullmoveOf` at each site. Same results for every valid FEN.
  `packages/engine/src/maia.ts` already imports from the core. Recordings untouched.
- **Tier:** T0 (mechanical; `maia.test.ts` pins Maia's encoding)
- **Status:** proposed
- **Needs:** none
- **Evidence:** drift check 3 on origin/main 7f729e3, 2026-11-27.

## ARCH-008: `tools/sim` writes `sanToUci` and `winPct` twice, with its own mate band

- **Concept:** winning chances
- **Kind:** refactor
- **Files:** `tools/sim/src/audit-real-games.ts:70`, `:75`, `tools/sim/src/bench/build-items.ts:39`,
  `:46`, `:120`; core `winChance` (`packages/core/src/diagnose.ts:56`), `balanceOf`
  (`packages/core/src/engine.ts:15`)
- **Why it matters:** The two copies of each give the same results today but are written
  differently, so a fix to one misses the other. Both treat a score within 500 of `MATE_SCORE` as
  mate, while the core uses 300 (`MATE_BAND`), so the benchmark and the teacher disagree about
  scores between 9500 and 9700.
- **Proposed move:** Lift one copy of each into a shared `tools/sim/src` module, unchanged, and
  import it from both scripts. Whether the tools should use the core's `winChance` and
  `balanceOf` instead (which changes benchmark numbers) is a question for William, not part of
  this move.
- **Tier:** T0 (a duplicated helper; typecheck)
- **Status:** proposed
- **Needs:** none
- **Evidence:** both copies read on origin/main 7f729e3, 2026-11-27; drift check 8.

## ARCH-009: `Engines.weak` is Maia now, not a weakened engine

- **Concept:** opponent mode
- **Kind:** refactor
- **Files:** `packages/core/src/engine.ts:41`, `:44`, `packages/core/src/opponent.ts:20`,
  `apps/web/src/engine/engines.ts:85`, `:86`, `tools/sim/test/games.ts:29`,
  `apps/api/test/api.test.ts:50`, `apps/web/scripts/smoke.ts:67`, `tools/sim/src/*` (86 uses)
- **Why it matters:** Since D16 the normal opponent is Maia at the chosen rating, a different
  kind of engine from "weakened Stockfish". The name and its comment ("a weakened opponent")
  point the next person at the wrong model of how the opponent plays.
- **Proposed move:** Rename `Engines.weak` to `Engines.opponent` (or William's word) everywhere,
  and fix the comment. The recorded games keep their `engineCalls.weak` key: recordings are never
  edited, so the replay set-up maps that key to the new field. `opponent.ts:20` is inside
  `chooseOpponentMove`, which is treated as frozen: the rename is the only change in its body;
  run the declaration proof with `--rename`.
- **Tier:** T0 (typecheck; every recorded-game replay)
- **Status:** proposed
- **Needs:** none
- **Evidence:** drift check 6 on origin/main 7f729e3, 2026-11-27.

## ARCH-010: `game/storage.ts` re-exports `RevealState`

- **Concept:** reveal
- **Kind:** refactor
- **Files:** `apps/web/src/game/storage.ts:13`, `apps/web/src/components/Reveal.tsx:15`
- **Why it matters:** `AGENTS.md` allows no re-exports. `Reveal.tsx` imports the contract's type
  through the storage module, so the type seems to belong to storage.
- **Proposed move:** `Reveal.tsx` imports `RevealState` from `@chess-teacher/contract`; drop the
  re-export.
- **Tier:** T0 (typecheck)
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27; drift check 8.

## ARCH-011: Lesson kinds compared as string literals in the web app, as a constant in one place

- **Concept:** lesson kind
- **Kind:** refactor
- **Files:** `apps/web/src/components/AiExplanation.tsx:126`, `LessonRow.tsx:20`, `:22`,
  `Reveal.tsx:60`, `:71`, `:87`, `Explanation.tsx:107`, `apps/web/src/game/useGame.ts:159`;
  `"mate"` for `MATE_FEATURE` at `Explanation.tsx:99`; the constant in
  `apps/web/src/components/BalanceGraph.tsx:59` and `MoveList.tsx:98`; core `CONSEQUENCE`,
  `MISSED_CHANCE`, `MATE_FEATURE` (`packages/core/src/lessons.ts:21`, `:23`). `Reveal.tsx:85`
  also uses the kind as a CSS class, matched in `styles.css`: leave that one.
- **Why it matters:** Two spellings of the same comparison. The type catches a typo either way,
  but a reader can't tell whether the core's constants are the way to name a kind.
- **Proposed move:** Use the core's constants at every site, matching the core and
  `BalanceGraph.tsx`. Or, if William prefers literals, drop the constants' use in the web app
  instead; either way one spelling.
- **Tier:** T0 (typecheck; mechanical)
- **Status:** proposed
- **Needs:** none
- **Evidence:** drift check 3 on origin/main 7f729e3, 2026-11-27.

## ARCH-012: The docs still describe the classical check as what gates lessons

- **Concept:** diagnosis
- **Kind:** guidance
- **Files:** `docs/concept.md` §5.1 (lines 120 to 133; its "§12" points at the prototype
  findings), §5.5 (line 180), §6 (line 206), status line 9; `docs/architecture.md` D14 (line 39),
  §6 (line 162), §14; `docs/lesson-core-design.md` line 4 ("Not yet built"), §5, §6; `README.md`
  status
- **Why it matters:** Live play makes diagnosed lessons (`packages/core/src/session.ts:293`,
  `diagnose` with `DIAGNOSE_CONFIG`, `packages/core/src/diagnose.ts:43`) and never calls
  `verifyLesson` or `classicalVerdict`; diagnosed lessons carry claims and a concept, not one
  principle. Someone reading the docs will tune the wrong thresholds.
- **Proposed move:** For William: mark D14 as superseded by diagnosis (or as kept for the
  older path only; see ARCH-014), say how diagnosis decides (the scan at depth 12, the confirm at
  depth 16, the drop in winning chances), mark `docs/lesson-core-design.md` steps 2 and 3 as
  built, and describe what the LLM is sent for a diagnosed lesson.
- **Tier:** T0
- **Status:** proposed
- **Needs:** ARCH-014 (what D14 becomes)
- **Evidence:** a read-only comparison of the docs with the code on origin/main 7f729e3,
  2026-11-27; drift check 14.

## ARCH-013: The frozen list misses `balanceOf`, which diagnosis now calls

- **Concept:** balance (of power)
- **Kind:** guidance
- **Files:** `packages/core/src/diagnose.ts:58` (`isMate`), `packages/core/src/engine.ts:6`
  (`MATE_BAND`), `:15` (`balanceOf`); `.claude/skills/architecture-gardener/references/frozen-code.md`
- **Why it matters:** 7b12c99 changed the frozen `isMate` from
  `Math.abs(score) >= MATE_SCORE - 300` to `balanceOf(score).kind === "mate"`. It decides the
  same for every score, but `balanceOf` and `MATE_BAND` also drive the balance-of-power words and
  graph (`apps/web/src/lib/balance.ts`). A display change to them would now change which lessons
  are made, and the frozen list doesn't say so.
- **Proposed move:** For William: either add `balanceOf` and `MATE_BAND` to the frozen list, or
  decide that `isMate` should keep its own threshold so display code stays free to change (that
  would be a frozen-code change for William, not a gardener move).
- **Tier:** FROZEN
- **Status:** proposed
- **Needs:** none
- **Evidence:** `git diff 0c2a6da origin/main -- packages/core/src/diagnose.ts` on 7f729e3,
  2026-11-27, while re-deriving the frozen list.

## ARCH-014: The classical check's wiring is still in place, unused by play

- **Concept:** diagnosis
- **Kind:** decision
- **Files:** `apps/web/src/engine/engines.ts:48` to `:56`, `:86`; `apps/web/scripts/copy-stockfish.mjs:19`;
  `packages/core/src/engine.ts:45` (`Engines.classical`); `packages/core/src/lessons.ts:75`, `:94`
  (`TeachingConfig.verifyStrategic`); `packages/core/src/session.ts:68` (`SessionState.unverified`);
  `tools/sim/src/near-miss.ts:172`, `tools/sim/src/audit-real-games.ts:166`,
  `tools/sim/src/validate-lessons.ts:98`, `tools/sim/src/simulate.ts` (`--verify`)
- **Why it matters:** Nothing in play calls the check, so Stockfish 11 never loads but still
  ships in the build. The core never writes `unverified` any more, so `near-miss.ts` and
  `audit-real-games.ts` always report 0 for it, and `validate-lessons.ts` skips diagnosed lessons,
  so its report is empty for games played now.
- **Proposed move:** For William (D14): keep the check for a future use, or retire its wiring
  (the web worker and build copy, `verifyStrategic`, `unverified`, `--verify`) while keeping the
  frozen check itself for `tools/sim`. Either way the stale tool reports need a note or a fix.
- **Tier:** FROZEN (the check); the wiring around it is T1
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27; `references/frozen-code.md` section 2.

## ARCH-015: `docs/architecture.md` §3 to §8 describe an earlier server, types and layout

- **Concept:** lesson
- **Kind:** guidance
- **Files:** `docs/architecture.md` §3 (lines 54, 63), §4 (lines 71 to 87), §5 (lines 98 to 134),
  §6 (line 163), §7 (lines 172 to 214), §8 (lines 238, 239), §12 (lines 293, 294)
- **Why it matters:** The docs are what a newcomer reads first, and these sections disagree with
  the code: §7 says the server checks lesson facts, but `checkGame` (`apps/api/src/app.ts:133`)
  checks line ids and move legality only; there is no `users` or `lessons` table (lessons live in
  `games.state`, `apps/api/src/db/schema.ts`); the endpoint list lacks `/health`,
  `/me/progress`, `/me/progress/:kind/:id` and lesson feedback; §8 says explanations are made
  in the background when a lesson is recorded, but the API writes one when the reveal asks (D5);
  §5's `Engine`, `GameEvent`, `SessionState` and `step()` don't match `packages/core/src/engine.ts`
  and `session.ts`; §4 names `packages/api` and omits `packages/contract`, `packages/lesson-text`
  and `tools/maia`; §6 and §12 say a weakened Stockfish plays the opponent (Maia since D16); the
  auth paragraph still lists candidates.
- **Proposed move:** For William: bring those sections in line with the code (the read-only
  comparison in the ledger entry lists each line).
- **Tier:** T0
- **Status:** proposed
- **Needs:** none
- **Evidence:** a read-only comparison of the docs with the code on origin/main 7f729e3,
  2026-11-27; drift check 14.

## ARCH-016: Test and command docs still describe prototype parity

- **Concept:** (tests)
- **Kind:** guidance
- **Files:** `docs/architecture.md` §11 item 5 (lines 271 to 274); `README.md` Tests and the
  `pnpm sim -- --verify` and `validate-lessons` commands; `AGENTS.md` line 25 ("parity"), line 77
  (`apps/web/src/html.d.ts`, which doesn't exist yet)
- **Why it matters:** The recorded games hold steps and engine calls only
  (`tools/sim/src/recorded-game.ts`); the replays pin state, save and reload, rewind, take back
  and scores, not the prototype's lessons or the classical check. Only
  `tools/sim/fixtures/features.json` is still the prototype's recording. A reader trusting the
  docs believes lesson content is pinned when it isn't (`references/frozen-code.md` says the same).
- **Proposed move:** For William: reword those lines; say `html.d.ts` is created when first
  needed.
- **Tier:** T0
- **Status:** proposed
- **Needs:** none
- **Evidence:** a read-only comparison of the docs with the code on origin/main 7f729e3,
  2026-11-27.

## ARCH-017: The recorded-game replay loop is written three times

- **Concept:** (tests)
- **Kind:** refactor
- **Files:** `tools/sim/test/games.ts:26` to `:45` (`enginesFor`, `startOf`, `step`),
  `apps/api/test/api.test.ts:39` to `:60`, `apps/web/scripts/smoke.ts:57` to `:83`
- **Why it matters:** The API test and the smoke test each declare their own fixture type and
  step loop. A change to how a recorded game is replayed (a new step type, a renamed engine)
  has to be found in three places, and the copies already differ (the smoke test's loop also
  records the first reveal).
- **Proposed move:** The API test and the smoke test use the loader, `enginesFor` and `step` from
  one place. Where that place lives (`tools/sim/test/games.ts` imported across workspaces, or a
  small module `tools/sim` exports) is a question for William. Recordings untouched.
- **Tier:** T0 (they are the tests; the smoke test runs in CI)
- **Status:** proposed
- **Needs:** none
- **Evidence:** the three loops read on origin/main 7f729e3, 2026-11-27; drift check 11.

## ARCH-018: Move saved-game upgrades out of `session.ts`

- **Concept:** (structure)
- **Kind:** refactor
- **Files:** `packages/core/src/session.ts:544` to `:637` (`LessonV4`, `LessonV1`,
  `SavedSessionState`, `upgradeSession`, `upgradedLesson`, `upgradedDetails`)
- **Why it matters:** `session.ts` (637 lines) mixes the frozen trigger flow with rewind, take
  back, lines of play and saved-game upgrades. The upgrades are a separate concern that grows with
  every `SESSION_STATE_VERSION`, and keeping them beside frozen code makes every change to them
  look riskier than it is.
- **Proposed move:** Move that section, unchanged, to `packages/core/src/saved.ts`, exported
  through `index.ts` as today. No frozen symbol moves.
- **Tier:** T0 (`upgradeSession` tests in `packages/core/test/core.test.ts`; every
  recorded-game replay)
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27; drift check 12.

## ARCH-019: The find-the-cause rules live in the web app's game hook

- **Concept:** reveal
- **Kind:** refactor
- **Files:** `apps/web/src/game/useGame.ts:150` to `:153` (skip "find" when the mistake was the
  player's last move), `:296` to `:322` (three wrong guesses end the search),
  `packages/contract/src/index.ts:44` (`RevealSchema`)
- **Why it matters:** These are teaching rules, and D3 puts teaching logic in the core so a
  native app reuses it. Today a second client would copy them from a React hook, and only the
  smoke test notices if they change.
- **Proposed move:** Pure functions in the core (for example `openReveal(state, lesson)` and
  `guessCause(reveal, lesson, ply)`) over a core type shaped like the contract's `RevealState`;
  `useGame` calls them. The contract keeps its schema (it doesn't depend on the core). Same
  results; the core gets unit tests of them.
- **Tier:** T1 (web components are covered only by the smoke test)
- **Status:** proposed
- **Needs:** ARCH-020
- **Evidence:** read on origin/main 7f729e3, 2026-11-27, in a read-only pass over `apps/web/src`.

## ARCH-020: Smoke-test the reveal's rules and the replay's line facts

- **Concept:** reveal
- **Kind:** tests-first
- **Files:** `apps/web/scripts/smoke.ts`
- **Why it matters:** ARCH-019 and ARCH-021 move logic out of components that only the smoke
  test covers. Before they move, the outcomes a player sees need pinning: a lesson from the last
  move opens on the explanation; three wrong guesses show the answer; the reveal's headline for
  missed material; "Back to the game" from an earlier try lands where the lines part.
- **Proposed move:** Add the checks the smoke test doesn't make yet (read it first: some may be
  there), driven through the UI. No source change.
- **Tier:** T1
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27.

## ARCH-021: Lesson and line facts worked out in web components

- **Concept:** line (of play)
- **Kind:** refactor
- **Files:** `apps/web/src/components/Reveal.tsx:57`, `:58` ("missed material" from `source`,
  `feature` and `mistake`); `apps/web/src/game/useReplay.ts:81` to `:83` and
  `apps/web/src/components/ReplayBoard.tsx:88` to `:92` (where two lines part, counted by hand;
  the core has `commonPrefix`, `packages/core/src/review.ts:25`, unexported);
  `lesson.ply - plyOf(state.startFen)` at `useReplay.ts:40`, `:57`, `BalanceGraph.tsx:54`, `:62`,
  `Reveal.tsx:140`
- **Why it matters:** The same facts about a lesson or a line are derived in several components,
  each a little differently, and a native app would derive them again.
- **Proposed move:** Small core helpers (where two lines part, a lesson's index in its line's
  moves, whether a lesson is about missed material) with unit tests, called from those sites.
  `packages/core/src/session.ts:284` does a similar material test inside frozen code: leave it
  as it is.
- **Tier:** T1
- **Status:** proposed
- **Needs:** ARCH-020
- **Evidence:** read on origin/main 7f729e3, 2026-11-27, in a read-only pass over `apps/web/src`.

## ARCH-022: Queries and mutations defined outside `api/queries.ts`

- **Concept:** (requests)
- **Kind:** refactor
- **Files:** `apps/web/src/game/storage.ts:28` to `:63` (`savedGameQuery`, `createGameMutation`,
  `saveGame`), `apps/web/src/components/LessonFeedback.tsx:15` (an inline mutation)
- **Why it matters:** D17 says queries and mutations are defined once in `api/queries.ts`. Two
  places define their own, so the next one has no single file to look in for keys and retries.
- **Proposed move:** Move those definitions into `api/queries.ts`, unchanged, and import them.
  Optionally an ESLint rule so only `api/` imports `api/client.ts` (ESLint config is T1).
- **Tier:** T1 (smoke test only)
- **Status:** proposed
- **Needs:** none (the smoke test covers saving and feedback)
- **Evidence:** read on origin/main 7f729e3, 2026-11-27, in a read-only pass over `apps/web/src`.

## ARCH-023: `App.tsx` and `useGame.ts` hold several jobs each

- **Concept:** (structure)
- **Kind:** refactor
- **Files:** `apps/web/src/App.tsx` (538 lines: `Shell` :61 to :96, focus and page titles :101 to
  :125, undo shortcuts :40 to :59 and :226 to :237, the account menu :295 to :326, the moves
  panel :499 to :531, the drawer :246 to :253); `apps/web/src/game/useGame.ts` (413 lines: toasts,
  the redo stack, the reveal)
- **Why it matters:** The largest web files; a change to the account menu or the drawer means
  reading the whole game page.
- **Proposed move:** Move, unchanged, in one PR per concept: `Shell` and the account menu into
  components; page titles and focus into `lib/router.ts`; the undo shortcuts into a hook. The
  reveal's rules go with ARCH-019, not here.
- **Tier:** T1 (smoke test only)
- **Status:** proposed
- **Needs:** none for pure moves; the smoke test and a look in light and dark for each PR
- **Evidence:** read on origin/main 7f729e3, 2026-11-27; drift check 12. On ea03d9c, 2026-11-28,
  `App.tsx` is 544 lines and everything below the imports sits 2 lines lower (`Shell` :63, the
  account menu from :297, the moves panel from :501, now with two `IconButton`s, 5d6b186).

## ARCH-024: Small helpers written twice in the web app

- **Concept:** (structure)
- **Kind:** refactor
- **Files:** the spoken move label, `apps/web/src/components/MoveList.tsx:79` to `:82` and
  `MoveButton.tsx:40` to `:43`; "is focus in a text field", `App.tsx:50` to `:53` and
  `ReplayBoard.tsx:21`, `:65`; a game's colour, result and date line, `Games.tsx:26`, `:55` to
  `:60` and `Principle.tsx:78` to `:82`; the move list rebuilt by hand, `MoveList.tsx:33` to `:37`,
  where `lib/moves.ts` has `lineMoves`
- **Why it matters:** Each pair already reads the same; a wording or rule change to one misses
  the other.
- **Proposed move:** One helper each in `apps/web/src/lib/`, with a test in `apps/web/test/` where
  it is plain TypeScript (the spoken label, the game line).
- **Tier:** T1
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27, in a read-only pass over `apps/web/src`.
  New on ea03d9c, 2026-11-28: e617b12 added a third copy of the spoken move label, in
  `LineButton` (`apps/web/src/components/MoveButton.tsx:83`), beside `MoveButton.tsx:41` and
  `MoveList.tsx:79`; and the board id made from `useId` is written twice in the same file
  (`MoveButton.tsx:38`, `:107`). One `spokenMoveLabel(move)` helper in `lib/moves.ts` covers all
  three.: The progress page offers no retry when it fails to load

- **Concept:** (requests)
- **Kind:** bug
- **Files:** `apps/web/src/components/Progress.tsx:14`, `:27`; compare `Games.tsx:24`, `:29`,
  `Principle.tsx:31`, `:33`, `PastGame.tsx:46`
- **Why it matters:** Every other page that loads data shows an error with a way to try again;
  the progress page shows the error only.
- **Proposed move:** For William: give it the same retry as the other pages.
- **Tier:** T1
- **Status:** proposed
- **Needs:** none
- **Evidence:** read on origin/main 7f729e3, 2026-11-27.

## ARCH-026: The board's `marked` prop is never passed

- **Concept:** (structure)
- **Kind:** refactor
- **Files:** `apps/web/src/components/Board.tsx:39`, `:86`, `:180`, its `lesson` mark text, and
  the `board_mark_lesson` message in `apps/web/messages/*.json`
- **Why it matters:** Dead code with a translated string behind it: each locale added pays for a
  string nobody sees, and the next person assumes the board can mark a lesson's squares.
- **Proposed move:** Remove the prop, its mark and the message; or, if William wants lesson
  squares marked, file that as a feature instead.
- **Tier:** T0 (typecheck; `apps/web/test/messages.test.ts` checks keys)
- **Status:** proposed
- **Needs:** none
- **Evidence:** `git grep 'marked='` on origin/main 7f729e3, 2026-11-27 finds no caller.

## ARCH-027: Stepping a board through a line is written twice: the futures and the line popover

- **Concept:** engine line
- **Kind:** refactor
- **Files:** `apps/web/src/components/Futures.tsx:24` to `:35` (`view`), `:83` to `:89`;
  `apps/web/src/components/MoveButton.tsx:105` to `:138` (`LineSteps`)
- **Why it matters:** Both work out the board at step n of a line the same way: the position
  before the first move with its arrow at step 0, then the position after move n with it as the
  last move. e617b12 copied the rule into `LineSteps` rather than sharing it, so a change to how a
  line is shown (say, an arrow for the next move at every step) reaches one stepper and not the
  other, though UX-58 asks for every line to step alike (`Stepper.tsx:10`).
- **Proposed move:** One plain-TS helper in `apps/web/src/lib/moves.ts` (for example
  `boardAtStep(fenBefore, line, step)` returning `fen`, `lastMove` and the first move for the
  arrow), with a test in `apps/web/test/moves.test.ts`; `Futures` and `LineSteps` call it and keep
  their own arrow colours and labels. Same boards at every step.
- **Tier:** T1 (web components; the smoke test already steps both, the futures and the line
  popover's "Before the move" and "Move 1 of n" since e617b12, so it needs no separate
  tests-first item; the lift brings its own unit test)
- **Status:** proposed
- **Needs:** none
- **Evidence:** both read on origin/main ea03d9c, 2026-11-28, while following e617b12.

## ARCH-028: The line popover borrows the futures' messages for where it is

- **Concept:** engine line
- **Kind:** refactor
- **Files:** `apps/web/src/components/MoveButton.tsx:131`, `apps/web/src/components/Futures.tsx:87`;
  `futures_before`, `futures_step` in `apps/web/messages/en-GB.json:240`, `:241` and `en-US.json`
- **Why it matters:** Every `Stepper` shows its position as "Before the move" or "Move n of m",
  but the keys are named for the futures. Someone rewording `futures_before` for the futures
  ("Before your move") also changes the coach's line popover without knowing it, and a
  translator can't tell the key is shared.
- **Proposed move:** Rename the two keys to `stepper_before` and `stepper_step`, beside
  `stepper_start` and the other stepper keys, in every locale and at both call sites. Same text;
  keys only.
- **Tier:** T0 (`apps/web/test/messages.test.ts` checks keys and placeholders; typecheck finds
  every `m.` call)
- **Status:** proposed
- **Needs:** none
- **Evidence:** `git grep futures_before` on origin/main ea03d9c, 2026-11-28: the two call sites
  above, nowhere else.

## ARCH-029: The checkbox's tick is hand-drawn SVG, where the icon guidance says Lucide

- **Concept:** (controls)
- **Kind:** refactor
- **Files:** `apps/web/src/ui/Checkbox.tsx:36` to `:41`; `docs/design/components.md` (Icons)
- **Why it matters:** ea03d9c says icons come from Lucide, with no hand-drawn SVG, and 5d6b186
  replaced the drawer's hand-drawn chevron (`apps/web/src/ui/Drawer.tsx:87`). The checkbox's tick
  is the one hand-drawn icon left in `ui/` (the balance graph's SVG at `BalanceGraph.tsx:93` is a
  chart, not an icon), so the next person can't tell which rule holds.
- **Proposed move:** For William first: whether a primitive's own mark counts as an icon. If it
  does, draw it with Lucide's `Check` at the same size and in `on-primary`, shown only when
  selected, and look at it in light and dark. If not, reject this item.
- **Tier:** T1 (`ui/` is covered only by the smoke test; a visual check in light and dark)
- **Status:** proposed
- **Needs:** none
- **Evidence:** `git grep '<svg' apps/web/src` on origin/main ea03d9c, 2026-11-28 lists
  `Checkbox.tsx:36` and `BalanceGraph.tsx:93` only.
