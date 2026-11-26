# Frozen code

William's decision: the internals of **lesson detection**, the **classical-evaluation check**
and **triggers** are frozen. They may be moved, renamed, split across files, re-imported and
have their call sites changed. Their logic, constants, thresholds and ordering may not change.

The list below was derived from `origin/main` at `0c2a6da` (Maia opponent and diagnosed
lessons). Files move: re-derive it at the start of every run (next section) and trust what you
find over these line numbers.

## Re-derive at the start of every run

```sh
# The entry points and their callers
git grep -nE 'export (async )?function (detectMistake|diagnose|lessonFromDossier|consequenceLanded|describeConsequence|lostMaterial|awaitedHappened|describeAwaited|classicalVerdict|verifyLesson|chooseConcepts|rankConcepts|judgeLine|moveFacts|winFacts|positionalFacts|chooseOpponentMove|startUserTurn|userMove|opponentMove)\b' -- packages
git grep -nE '\b(detectMistake|diagnose|verifyLesson|classicalVerdict|consequenceLanded|awaitedHappened)\(' -- packages apps tools
# Private helpers, constants and thresholds
git grep -nE 'function (checkConsequences|sendWaitingToReview|chanceStillOpen|awaitedFor|positionalEvents|towardsEvent|findMotifs)\b|const (hasLanded|chanceStillThere|activeLesson)\b' -- packages/core/src
git grep -nE '\b(DEFAULT_CONFIG|DIAGNOSE_CONFIG|DEFAULT_VERDICT_OPTIONS|FEATURE_TERMS|IGNORED_TERMS|OPPORTUNITY_FEATURES|LOWER_BAR_FROM_MOVE|CONCEPT_FAMILIES|MOTIF_ORDER|MOTIF_CONCEPT)\b' -- packages/core/src
# What changed in the frozen files since this list was written
git log --oneline 0c2a6da..origin/main -- packages/core/src packages/engine/src/eval-trace.ts
```

Then read `userMove`, `opponentMove` and `startUserTurn` in the session file: whatever they call
to create, reveal, expire or supersede a lesson is frozen. If a frozen symbol has gone, or a new
path creates or reveals lessons, stop and ask William which parts are frozen before tending
anything near it. Record the re-derived list in the ledger entry when it differs from this one.

## The list

### 1. Lesson detection

Live play creates **diagnosed lessons**: `userMove` calls `diagnose` (`session.ts:290`), then
`lessonFromDossier` (`session.ts:295`).

| File                            | Frozen symbols                                                                                                                                                                                                         |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/diagnose.ts` | `DIAGNOSE_CONFIG` :43, `winChance` :56, `isMate` :58, `diagnose` :91, `shift` :197, `sameIdea` :200                                                                                                                    |
| `packages/core/src/claims.ts`   | Whole file: `judgeLine` :137, `netKey` :168, `findMotifs` :281, `moveFacts` :405, `winFacts` :491, `nullMoveFen` :517, `plainBalance` :531, `positionalFacts` :604, and every private helper and constant between them |
| `packages/core/src/concepts.ts` | `CONCEPT_FAMILIES` :18, `MOTIF_CONCEPT` :64, `MOTIF_ORDER` :74, `motifConcept` :83, `ignoredThreat` :100, `king` :109, `quiet` :118, `rankConcepts` :139, `chooseConcepts` :189                                        |
| `packages/core/src/reveals.ts`  | `lessonFromDossier` :34, `positionalEvents` :79, `awaitedFor` :107                                                                                                                                                     |
| `packages/core/src/session.ts`  | Inside `userMove` :241: the "fixed" check (:258 to :267), superseding material lessons (:269 to :284), the `diagnose` call and credit assignment (:286 to :313)                                                        |

**Feature lessons** are the older path. Live play no longer creates them, but saved games hold
them, their triggers still run, and tests and `tools/sim` call `detectMistake`.

| File                            | Frozen symbols                                                                                                                                                                                                            |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/core/src/lessons.ts`  | `OPPORTUNITY_FEATURES` :26, `LOWER_BAR_FROM_MOVE` :32, `DEFAULT_CONFIG` :78 (the thresholds), `scoreAfter` :204, `queensAfter` :211, `lineValues` :218, `detectMistake` :226                                              |
| `packages/core/src/features.ts` | Whole file: the measurements detection and triggers read (`material` :35, `settledBalance` :46, `hanging` :77, `FEATURES` :278, `FEATURES_BY_NAME` :405, `measureAll` :412). Pinned by `tools/sim/fixtures/features.json` |

### 2. The classical-evaluation check (D14)

| File                                | Frozen symbols                                                                                                                                                       |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/validate.ts`     | Whole file: `FEATURE_TERMS` :15, `IGNORED_TERMS` :31, `gamePhase` :38, `DEFAULT_VERDICT_OPTIONS` :67, `classicalVerdict` :69, `lineEndFen` :135, `verifyLesson` :150 |
| `packages/engine/src/eval-trace.ts` | `parseEvalTrace` :19 (the check's input: Stockfish 11's `eval` table)                                                                                                |

On `origin/main` live play does not call the check: `verifyLesson` and `classicalVerdict` are
called only from `tools/sim` (`near-miss.ts`, `audit-real-games.ts`, `validate-lessons.ts`,
`bench/teacher-current.ts`) and `tools/sim/test/verify.test.ts`. The web app still starts
Stockfish 11 for it (`apps/web/src/engine/engines.ts:52`), and `TeachingConfig.verifyStrategic`
and `SessionState.unverified` are no longer read by the core. The check stays frozen, and
removing its wiring is a D14 decision for William, not a refactor: file it as a `decision` item.

### 3. Triggers

| File                           | Frozen symbols                                                                                                                                                              |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/lessons.ts` | `consequenceLanded` :407, `lostMaterial` :417, `describeConsequence` :441, and `triggerAt` as `detectMistake` sets it                                                       |
| `packages/core/src/reveals.ts` | `awaitedHappened` :121, `moveRef` :146, `describeAwaited` :151, `chanceStillThere` :197                                                                                     |
| `packages/core/src/session.ts` | `activeLesson` :167, `chanceStillOpen` :192, `startUserTurn` :209, `hasLanded` :337, `checkConsequences` :341, `sendWaitingToReview` :375, and the expiry rules inside them |

### 4. Treated as frozen: they decide when a lesson fires or what it says

Not named by William, but changing their logic changes lessons, so the same rule applies. If in
doubt, ask him.

| File                            | Symbols and why                                                                                                                                                  |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/src/opponent.ts` | `chooseOpponentMove` :12, `towardsEvent` :66: the levelled-up opponent steers towards the trigger                                                                |
| `packages/core/src/explain.ts`  | `facts` :67, `hints` :96, `CLAIM_PLIES` :175, `claimFact` :184, `diagnosisFacts` :296: which facts a lesson shows the player and the coach                       |
| `packages/core/src/game.ts`     | `plyOf` :29 and the game-over rules in `Game` :37 (python-chess's automatic draws): they decide ply numbers, expiry and when a game ends; pinned by the fixtures |
| `packages/core/src/board.ts`    | `VALUES` :18, `legalCaptures` :219 and the attack helpers: material and exchanges are measured with them                                                         |

Shapes that saved games hold (`Lesson`, `Awaited`, `Claim`, `SessionState`, `TeachingConfig`)
are not frozen logic, but renaming a field changes saved JSON: it needs a
`SESSION_STATE_VERSION` bump and an `upgradeSession` step, so it is T1, never mechanical.

## What a legitimate move is

Allowed:

- Moving a frozen declaration to another file, or splitting a frozen file into several, with
  the declaration's text unchanged.
- Renaming a frozen symbol everywhere (every layer, no alias), so that the only difference in
  any frozen body is the new name.
- Changing imports and `export` keywords, and updating call sites outside frozen bodies.
- Lifting a helper verbatim (same body) so two frozen files share one copy, with every call site
  inside frozen bodies left byte-identical (for example the identical `find` helpers in
  `reveals.ts` and `concepts.ts`).
- Moving or editing comments outside frozen bodies.

Not allowed (these are `finding` items, not refactors): changing a constant, threshold,
condition, ordering, tie-break, rounding, default, loop bound or the order of claims; inlining
or replacing a helper inside a frozen body with a "same" one that is written differently;
changing which positions the engine is asked about, at what depth or MultiPV; and anything that
changes a lesson's wording, kind, concept, principle, awaited event or timing.

## Proving nothing changed

Do all four whenever a frozen file or symbol is touched, and quote the results in the PR.

**1. Declarations are identical apart from imports and exports.** Write this script to a
temporary file outside the repo (for example `/tmp/gardener-decls.mjs`) and run it from the
repo root. It prints every top-level declaration, with `export` and layout normalised, so moves
between files and Prettier re-wrapping don't count; comments inside a body do.

```js
// node /tmp/gardener-decls.mjs [--rev <git-rev>] [--rename old=new ...] <dir> [<dir> ...]
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const ts = createRequire(join(process.cwd(), "package.json"))("typescript");
const args = process.argv.slice(2);
let rev = null;
const renames = [];
const dirs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--rev") rev = args[++i];
  else if (args[i] === "--rename") renames.push(args[++i].split("="));
  else dirs.push(args[i]);
}
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 26 });
const files = dirs
  .flatMap((d) =>
    rev
      ? git("ls-tree", "-r", "--name-only", rev, "--", d).split("\n").filter(Boolean)
      : readdirSync(d, { recursive: true }).map((f) => join(d, String(f))),
  )
  .filter((f) => f.endsWith(".ts"));
const read = (f) => (rev ? git("show", `${rev}:${f}`) : readFileSync(f, "utf8"));

const blocks = new Map();
for (const f of files) {
  const sf = ts.createSourceFile(f, read(f), ts.ScriptTarget.Latest, true);
  for (const st of sf.statements) {
    const names = ts.isVariableStatement(st)
      ? st.declarationList.declarations.map((d) => d.name.getText(sf))
      : st.name
        ? [st.name.getText(sf)]
        : [];
    if (!names.length) continue;
    let text = st.getText(sf).replace(/^export\s+/, "");
    text = text
      .replace(/\s+/g, " ")
      .replace(/,\s*([)\]}])/g, "$1")
      .replace(/([([{])\s+/g, "$1")
      .replace(/\s+([)\]}])/g, "$1");
    for (const [from, to] of renames) text = text.replace(new RegExp(`\\b${from}\\b`, "g"), to);
    for (const n of names) {
      const name = renames.find(([from]) => from === n)?.[1] ?? n;
      blocks.set(name, [...(blocks.get(name) ?? []), text]);
    }
  }
}
for (const name of [...blocks.keys()].sort())
  for (const text of blocks.get(name).sort()) console.log(`### ${name}\n${text}`);
```

```sh
node /tmp/gardener-decls.mjs --rev origin/main packages/core/src packages/engine/src > /tmp/before.txt
node /tmp/gardener-decls.mjs packages/core/src packages/engine/src > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt
```

Pass `--rename old=new` on the `--rev` run for each symbol the PR renames. Any difference in a
frozen declaration fails the proof. A declaration that only exists on one side is fine if it is
not frozen (a new module's re-import, say) and must be explained in the PR.

**2. The diff shows moves as moves.**
`git diff --color-moved=dimmed-zebra --color-moved-ws=allow-indentation-change origin/main...HEAD -- packages/core/src`
shows every frozen line as moved, not added or removed. Paste the summary (which blocks moved
where) into the PR, not the coloured output.

**3. The tests that pin the teaching code pass, unchanged.** `pnpm check` runs them all; for a
quick loop while working, `pnpm exec vitest run packages/core tools/sim apps/api`. They are:
`tools/sim/test/features.test.ts` (every feature on about 270 positions against the frozen
recording), the recorded-game replays (`resume.test.ts`, `rewind.test.ts`, `takeback.test.ts`,
`scores.test.ts`, which fail with "no recorded analysis" if the core asks the engine anything
new), `tools/sim/test/verify.test.ts`, `packages/core/test/core.test.ts` and
`apps/api/test/api.test.ts`. `git diff origin/main...HEAD -- '*.test.ts'` shows at most import
changes and renamed symbols.

**4. No recorded data or expected value changed.**
`git diff --name-only origin/main...HEAD -- tools/sim/fixtures tools/sim/games packages/engine/test/fixtures`
prints nothing.

Know what the tests do not pin: the recorded games hold engine calls, not expected lessons, so
a change to a diagnosed lesson's claims, concept or wording that asks the engine nothing new can
pass every test. That is why step 1 is required, not optional. If the proof cannot be made, the
item does not ship: record it as a `finding`.
