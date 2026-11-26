# Backlog, ledger, glossary and ADR formats

All gardener state lives in the repo under `docs/gardener/` (not `docs/architecture/`:
`docs/architecture.md` already exists). On a first survey, create:

```
docs/gardener/
  BACKLOG.md    items, newest last; ids never reused
  LEDGER.md     one entry per run, newest last; append only
  GLOSSARY.md   the pinned vocabulary, one row per concept
  adr/          one file per decision William makes in a session (0001-<slug>.md)
```

Every file must pass `pnpm exec prettier --check .`: run `prettier --write docs/gardener` before
committing.

## BACKLOG.md

```markdown
# Architecture backlog

Written by the architecture gardener (`.claude/skills/architecture-gardener/`). Only William
approves an item: he says so in a session, or sets its status to `approved` here.

Statuses: proposed, approved, shipped, rejected, deferred. Tiers: T0, T1, FROZEN (see the
skill's `references/tiers.md`).

## ARCH-001: <short title>

- **Concept:** <glossary term, e.g. moves, lesson, progress>
- **Kind:** refactor | tests-first | finding | guidance | decision | bug
- **Files:** `path/to/file.ts:line`, ...
- **Why it matters:** <one or two sentences: what goes wrong for the next person who touches it>
- **Proposed move:** <the change, small enough for one PR; or the question for William>
- **Tier:** T0 | T1 | FROZEN
- **Status:** proposed
- **Needs:** <ARCH-nnn that must ship first, or none>
- **Evidence:** <what you ran or read, with `path:line`; date and `origin/main` commit>
```

Field rules:

- **Id:** `ARCH-` and three digits, one more than the highest id in the file. Never reuse or
  renumber.
- **Kind:** `refactor` and `tests-first` are the only kinds a tend run ships. `finding` is a
  lesson-quality finding (it would change what a lesson says or when it fires). `guidance`
  proposes a change to `AGENTS.md`, `CLAUDE.md`, `docs/design/**`, `.claude/skills/**`,
  `docs/architecture.md` or `docs/concept.md`. `decision` would reopen or settle a §2 decision.
  `bug` is a defect seen while surveying or tending; it is never fixed inside a refactor PR.
- **Tier:** a T1 refactor gets a `tests-first` item of its own, and lists it under **Needs**.
- **Status:** `proposed` when filed. `approved` only by William. `shipped` once its PR is open,
  with the branch or PR number added to **Evidence**. `rejected` and `deferred` carry William's
  reason in one line. A later survey updates **Evidence** instead of filing a duplicate.

### Worked example (EXAMPLE ONLY: not a real item, do not copy it into the backlog as is)

```markdown
## ARCH-001: One definition of the coach's explanation parts

- **Concept:** explanation
- **Kind:** refactor
- **Files:** `apps/api/src/explain.ts:81`, `packages/contract/src/index.ts:109`
- **Why it matters:** `ExplanationParts` is declared twice with the same fields. A field added
  to one (a fourth part, say) compiles while the API and the web app disagree about the shape.
- **Proposed move:** `apps/api/src/explain.ts` imports `ExplanationParts` from
  `@chess-teacher/contract` and drops its own copy. No behaviour change; no prompt text touched.
- **Tier:** T0 (typecheck pins the shape; the "structured explanations" tests in
  `apps/api/test/api.test.ts` pin parsing)
- **Status:** proposed
- **Needs:** none
- **Evidence:** both declarations read on origin/main 0c2a6da, 2026-11-26; the exported-type
  duplicate check in the skill's `references/drift-checks.md` (check 8) lists it.
```

## LEDGER.md

```markdown
# Architecture ledger

One entry per gardener run, newest last. Never rewrite an old entry.

## <yyyy-mm-dd>: survey | tend ARCH-nnn

- **Base:** origin/main <short sha>; branch `<branch>`; PR <#n or "not opened">
- **Frozen list:** unchanged from the skill's reference | changed: <what>
- **Skipped (open PRs):** <files and PR numbers, or none>
- **Did:** <survey: items added and updated by id; tend: what moved, lines changed, lines moved>
- **Proven:** <commands and results: pnpm check, prettier, db:check, smoke (or "not run: no
  Chromium"), the frozen declaration diff, the fixtures diff>
- **Left deliberately:** <what was out of scope, and why>
- **Bugs seen:** <filed as ARCH-nnn, or none>
```

An empty survey still gets an entry: "Did: no new items; ARCH-004 and ARCH-007 evidence
refreshed" is a valid result.

## GLOSSARY.md

One row per concept: the name to use, what it means, and where each layer spells it. When two
names exist, the row says which one is pinned and the backlog holds the rename (a `refactor`,
or `guidance` if the docs must change). Never rename to match the glossary outside a tend run.

```markdown
# Glossary

| Term | Meaning | Core | Lesson text and catalogue | Contract and API | Web | Notes |
| :--- | :------ | :--- | :------------------------ | :--------------- | :-- | :---- |
```

### Seed, derived from `origin/main` `0c2a6da` (verify each anchor before copying)

| Term           | Meaning                                                                           | Where                                                                                                                                                                                                                   | Drift seen                                                                                                        |
| :------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| lesson         | A mistake the app will teach, from detection to review                            | `Lesson` = `FeatureLesson` (`source: "features"`) or `DiagnosedLesson` (`source: "diagnosis"`), `packages/core/src/lessons.ts:129`, `:176`, `:188`. Stored inside `games.state` (`apps/api/src/db/schema.ts`), no table | `docs/architecture.md` §7 lists a `lessons` table                                                                 |
| lesson kind    | Consequence (the move made things worse) or missed chance                         | `LessonKind`, `CONSEQUENCE`, `MISSED_CHANCE`, `lessons.ts:21` to `:34`                                                                                                                                                  | Web compares string literals (`Reveal.tsx:61`); "kind" also names `MistakeKind`                                   |
| mistake kind   | What diagnosis found: mated, loses or misses material or mate, positional         | `MistakeKind`, `packages/core/src/concepts.ts:62`                                                                                                                                                                       |                                                                                                                   |
| principle      | One of the fixed curriculum's ideas; feature lessons only                         | `PrincipleId`, `packages/core/src/principles.ts:23`; `principleTitle` in lesson-text                                                                                                                                    |                                                                                                                   |
| concept        | The idea a diagnosed lesson names                                                 | `ConceptId`, `CONCEPT_FAMILIES`, `concepts.ts:18`, `:55`; `conceptTitle` in lesson-text                                                                                                                                 | Progress lists both as `principles` (`packages/contract/src/index.ts:169`); `apps/api/src/app.ts:171` says `idea` |
| feature        | A measured property of a position (material, king safety...)                      | `FeatureName`, `packages/core/src/features.ts:257`                                                                                                                                                                      | "factor" in `factorText` (`packages/lesson-text/src/index.ts:148`) and the LLM facts                              |
| claim          | A fact about a move that the probes verified                                      | `Claim`, `packages/core/src/claims.ts:63`; gathered in a `Dossier` (`diagnose.ts:60`)                                                                                                                                   |                                                                                                                   |
| facts          | A lesson's claims or measurements as shown to the player and the coach            | `LessonFacts`, `DiagnosisFacts`, `ClaimFact`, `packages/core/src/explain.ts:47`, `:107`, `:146`                                                                                                                         |                                                                                                                   |
| diagnosis      | Confirming a move was a mistake and gathering its claims                          | `diagnose`, `packages/core/src/diagnose.ts:91`                                                                                                                                                                          | `docs/lesson-core-design.md` says "Not yet built"                                                                 |
| trigger        | The lesson's consequence landing, which reveals it                                | Status `triggered` (`LessonStatus`, `lessons.ts:36`); `Trigger`, what happened (`packages/core/src/text.ts:51`); `triggerAt` (feature lessons); `awaits` (`Awaited`, `lessons.ts:156`) for diagnosed lessons            | One word for the event, the status and the record                                                                 |
| reveal         | The pause that shows a triggered lesson: find the cause, then the explanation     | `RevealSchema` (`packages/contract/src/index.ts:37`, steps `find`, `explain`); `apps/web/src/components/Reveal.tsx`                                                                                                     | Status is `triggered`, not `revealed`                                                                             |
| cause          | The player's own move that caused the lesson, which they try to find              | `foundCause`, `causeWindow` (`lessons.ts:57`, `:124`); `recentUserMoves` (`session.ts:486`)                                                                                                                             |                                                                                                                   |
| line (of play) | The moves of the game, or a line left behind by going back past a revealed lesson | `SessionState.line`, `Branch` (`packages/core/src/session.ts:46`, `:76`); `reviewTree`                                                                                                                                  | Also means an engine line                                                                                         |
| engine line    | The engine's predicted continuation after the move or the better move             | `userLine`, `bestLine` (`lessons.ts:115`, `:117`); `LineOutcome` (`claims.ts:48`); "futures" in the UI (`Futures.tsx`)                                                                                                  |                                                                                                                   |
| move           | UCI in state, engine and contract; SAN only for display                           | `SessionState.moves`, `Candidate.move`; `uci` (`packages/contract/src/index.ts:8`); `uciParts`, `sanOf`, `variationSan` (`packages/core/src/game.ts:21`, `:100`, `:105`); `MoveRef` (`text.ts:11`)                      | The web board and move list use chess.js `Move` (`apps/web/src/lib/moves.ts`)                                     |
| FEN            | A position as a string                                                            | `plyOf`, `fullmoveOf`, `turnOf` (`game.ts:29` to `:35`); `Position` (`packages/core/src/board.ts:64`)                                                                                                                   | Fields parsed by hand elsewhere (drift check 3)                                                                   |
| opponent mode  | Normal (at the chosen rating) or levelled up (exploiting a lesson)                | `OpponentMode`, `packages/core/src/opponent.ts:10`                                                                                                                                                                      | `Engines.weak` ("a weakened opponent", `packages/core/src/engine.ts:26`) is now Maia                              |
| score          | Engine evaluation in centipawns from the user's side; winning chances in percent  | `SessionState.scores` (`session.ts:72`), `MATE_SCORE` (`engine.ts:3`), `winChance` (`diagnose.ts:56`)                                                                                                                   |                                                                                                                   |

## adr/

Only for a decision William makes in a session about structure or naming ("we call it a
concept everywhere"). The settled decisions D1 onwards stay in `docs/architecture.md`; the
gardener never writes or changes those.

```markdown
# ADR 0001: <decision>

- **Date:** <yyyy-mm-dd>
- **Decided by:** William, in session
- **Backlog:** ARCH-nnn

## Context

<what the survey found, with `path:line`>

## Decision

<the decision, in one paragraph>

## Consequences

<what changes, and which backlog items follow>
```
