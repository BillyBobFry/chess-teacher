# Drift checks for a survey

Each check is something the code can be tested for, with a command to start from and what it
found on `origin/main` at `0c2a6da`. The commands find candidates; confirm each one by reading
the code before it becomes a backlog item. Known instances are starting points, not items:
check they are still true, and check the backlog before adding them.

## 1. Platform code leaking into `packages/core` by indirect routes

The ESLint rule in `eslint.config.js` bans Node built-in imports and the globals `window`,
`document`, `process`, `require`, `Buffer`, `fetch` and `localStorage` in
`packages/core/src`. It does not catch other globals, new dependencies or workspace imports.

```sh
git grep -nwE 'globalThis|self|navigator|Worker|performance|setTimeout|setInterval|crypto|console|structuredClone|TextEncoder|Intl' -- packages/core/src
git grep -nE 'import\.meta|from "@chess-teacher/' -- packages/core/src
node -e 'console.log(require("./packages/core/package.json").dependencies)'   # only chess.js
```

Found: nothing. `packages/core/package.json` depends on `chess.js` only.

## 2. The server doing engine or teaching work (D4)

`apps/api` may use the core to read saved state (legality, facts for the coach, outcomes), not
to analyse or create lessons, and never runs an engine.

```sh
git grep -n '@chess-teacher/engine' -- apps/api/src          # devDependency for tests only
git grep -nwE 'diagnose|detectMistake|userMove|opponentMove|startUserTurn|verifyLesson|UciEngine|MaiaEngine' -- apps/api/src
```

Found: nothing. `apps/api/src/app.ts` uses `Game` (legality, `checkGame` :114), `facts`,
`diagnosisFacts`, `gameOutcome`, `playedLine`, `reviewLessons`, `upgradeSession`.

## 3. The web app re-deriving teaching facts or formatting chess itself

Lesson facts come from the core (`facts`, `diagnosisFacts`, `lessonMove`, `playedLine`), words
from `@chess-teacher/lesson-text` and `apps/web/src/lib/moves.ts`, FEN fields from the core's
`plyOf`, `fullmoveOf`, `turnOf` (`packages/core/src/game.ts`).

```sh
git grep -nE 'split\(" "\)\[' -- apps packages tools
git grep -nE 'new Chess\(|from "chess.js"' -- apps/web/src
git grep -nE '\.(source|mistake|feature|kind|awaits) ===' -- apps/web/src
```

Found: FEN fields parsed by hand at `apps/web/src/components/MoveList.tsx:21` (`turnOf` exists),
`packages/engine/src/maia.ts:100`, and the fullmove in `tools/sim/src/record-games.ts:73`,
`simulate.ts:97`, `validate-lessons.ts:82` (`fullmoveOf` exists). The reveal works out
"missed material" from lesson fields itself (`apps/web/src/components/Reveal.tsx:58`). The board
and move list use chess.js `Move` directly (`Board.tsx`, `lib/moves.ts`); that is the UI's own
representation, not drift by itself.

## 4. Controls that bypass `apps/web/src/ui/`

`eslint/ui-components.js` catches raw `<button>`, `<input>`, `<select>`, `<textarea>`,
`<dialog>` and `react-aria-components` imports in `.tsx` outside `ui/`, and arbitrary colour
utilities. It does not catch click handlers on other elements or hand-made roles.

```sh
git grep -nE 'role="(button|checkbox|dialog|menu|tab|radio)"|tabIndex=|onKeyDown=' -- 'apps/web/src/**/*.tsx' ':!apps/web/src/ui/**'
git grep -nE '<(div|span|li|td)[^>]*onClick=' -- 'apps/web/src/**/*.tsx' ':!apps/web/src/ui/**'
```

Found: only the board's keyboard grid (`apps/web/src/components/Board.tsx:262`, `:276`), which
`docs/design/components.md` names as the exception. Read that file before filing anything here.

## 5. User-visible strings outside the catalogue

`eslint/ui-text.js` sees JSX text and a few attributes only. Strings built in hooks, helpers
and `.ts` files, toasts, `document.title`, thrown errors shown to the player and `Intl`
formatters without `getLocale()` are left to review (`docs/design/README.md`).

```sh
git grep -nE '"[A-Z][a-z]+ [a-z][^"]*"' -- 'apps/web/src/**/*.ts' 'apps/web/src/**/*.tsx' ':!apps/web/src/paraglide/**'
git grep -nE 'Intl\.[A-Za-z]+\(' -- apps/web/src packages/lesson-text/src
git grep -nE 'c\.json\(\{ *error: *"[A-Z]' -- apps/api/src       # errors must be codes
```

Found: only comments. The landing page (`apps/web/landing/`) is a known gap listed in
`docs/design/ux-principles.md`; don't file it again.

## 6. One concept, two names across layers

Pin the vocabulary in `GLOSSARY.md` (seed in `backlog-formats.md`). Trace each term through
core, lesson-text, contract, API, web and `tools/sim`:

```sh
git grep -nwiE 'principle|concept|idea|factor|feature' -- apps/api/src packages/contract/src apps/web/src/components | grep -v paraglide
git grep -nwE 'weak|weakened' -- packages/core/src apps/web/src/engine
```

Found: progress counts principles and concepts in one list called `principles`
(`ProgressResponse`, `PrincipleProgress` in `packages/contract/src/index.ts:169`), and
`apps/api/src/app.ts:171` calls the same thing an `idea`. A measured feature (`FeatureName`,
`packages/core/src/features.ts:257`) is a "factor" in lesson text (`factorText`,
`packages/lesson-text/src/index.ts:148`) and the LLM facts. `Engines.weak` ("a weakened
opponent", `packages/core/src/engine.ts:26`) is now Maia at the chosen rating
(`apps/web/src/engine/engines.ts:85`). "Trigger" means both the `triggered` status (revealed) and
the `Trigger` record of what happened (`packages/core/src/text.ts:51`); diagnosed lessons call
the condition `awaits`. "Line" means both a line of play (`SessionState.line`, `Branch`) and an
engine line (`userLine`, `bestLine`, `LineOutcome`). "Kind" is both `LessonKind` and
`MistakeKind`. A rename that would change saved JSON or a catalogue key is T1 (`tiers.md`).

## 7. Teaching logic in the engine adapters or the contract

`packages/engine` translates UCI and Maia; `packages/contract` declares shapes and depends on
`zod` only.

```sh
git grep -nE 'from "@chess-teacher/core"' -- packages/engine/src
git grep -nE '^export (async )?function|=> *\{' -- packages/contract/src
node -e 'console.log(require("./packages/contract/package.json").dependencies)'
```

Found: the engine imports core types, `MATE_SCORE` and `Game` (for Maia's move legality,
`packages/engine/src/maia.ts:12`); no teaching logic. The contract has no functions.

## 8. Duplicated helpers and types across packages and `tools/sim`

Search `packages/core/src` and `apps/web/src/lib` before adding a helper (`AGENTS.md`).

```sh
git grep -nE '^(export )?(async )?function [a-zA-Z]+' -- packages apps tools | awk -F'function ' '{print $2}' | cut -d'(' -f1 | cut -d'<' -f1 | sort | uniq -d
git grep -nE '^export (interface|type) [A-Za-z]+' -- packages apps | awk '{print $3}' | sort | uniq -d
```

Found: the claim lookup `find` in `packages/core/src/reveals.ts:25`, `concepts.ts:90` (frozen
files: lift verbatim only) and a variant in `tools/sim/src/bench/teacher-next.ts:32`;
`ExplanationParts` in both `apps/api/src/explain.ts:81` and `packages/contract/src/index.ts:109`;
`GameOutcome` in `packages/core/src/session.ts:401` and `packages/contract/src/index.ts:77` (the
contract depends on `zod` only, so this may be deliberate: ask before merging them);
`sanToUci` in `tools/sim/src/audit-real-games.ts:75` and `tools/sim/src/bench/build-items.ts:120`;
`RevealState` re-exported by `apps/web/src/game/storage.ts:11` (AGENTS: no re-exports);
the recorded-game replay loop in both `tools/sim/test/games.ts` and
`apps/api/test/api.test.ts:37`. `detailText` and `triggerText` exist in both
`packages/lesson-text` and `tools/sim/src/prototype-text.ts` on purpose (check 9). The material balance written out inline in `claims.ts:113`,
`lessons.ts` and `session.ts:274` is inside frozen bodies: leave it.

## 9. Leftovers of the removed Python prototype

The prototype was removed in "Remove the Python prototype (#17)". Not leftovers, and must stay:
`pyRound` (`packages/core/src/explain.ts:29`), python-chess's game-over and ply rules
(`packages/core/src/game.ts`), the tie-break at `lessons.ts:325`, `scoreValue`'s mate convention
(`packages/engine/src/uci.ts:43`) and `tools/sim/src/prototype-text.ts`: they keep the frozen
fixtures exact. Python under `tools/maia/` and `tools/sim/bench/` is current tooling.

```sh
git grep -nE 'prototype/|\.py\b|python' -- ':!tools/maia' ':!tools/sim/bench' ':!reports' ':!*.json'
```

Look for paths, commands or docs that assume `prototype/` still exists, and for code whose only
reason was parity with tests that no longer exist.

## 10. Dead exports

```sh
for f in packages/*/src/*.ts apps/api/src/*.ts apps/web/src/lib/*.ts; do
  for name in $(grep -oE '^export (async )?(function|const|class|interface|type) [A-Za-z_][A-Za-z0-9_]*' "$f" | awk '{print $NF}'); do
    n=$(git grep -lw "$name" -- packages apps tools ":!$f" | grep -v '/index.ts$' | wc -l)
    [ "$n" -eq 0 ] && echo "$f $name"
  done
done
```

This lists exports no other file uses (about 50 on `0c2a6da`). Most only need `export` dropped;
a package's public types may stay. Used only by tests is not dead. Dropping `export` from a
frozen declaration is allowed. Not dead, and not the gardener's call: `Engines.classical`,
`TeachingConfig.verifyStrategic` and `SessionState.unverified`, kept for the classical check
(D14, see `frozen-code.md`).

## 11. Test and fixture duplication

```sh
git grep -nE 'detectMistake\(' -- '*.test.ts'
git grep -nE 'new RecordedEngine\(' -- packages apps tools
```

Found: hand-built feature lessons through `detectMistake` in `packages/core/test/core.test.ts:42`,
`tools/sim/test/resume.test.ts:46`, `tools/sim/test/takeback.test.ts:93`,
`apps/api/test/api.test.ts:88`; the replay set-up in two places (check 8). Never move or rewrite
the recorded data itself.

## 12. Large files with several responsibilities

```sh
git ls-files '*.ts' '*.tsx' ':!**/paraglide/**' | xargs wc -l | sort -n | tail -15
```

On `0c2a6da` the largest source files are `packages/core/src/claims.ts` (754), the lesson-text
renderer (625), `session.ts` (622), `apps/api/src/app.ts` (474), `apps/web/src/game/useGame.ts`
(450), `App.tsx` (448), `lessons.ts` (448), `features.ts` (414) and `apps/api/src/explain.ts`
(408). A split of a frozen file is a move (prove it); `session.ts` mixes frozen trigger flow with
T0 rewind, take-back and save upgrades.

## 13. Untrusted boundaries without Zod, and Zod over our own data

`AGENTS.md`: Zod at API requests and responses, env vars and LLM output; not over our own
database or between our own functions.

```sh
git grep -nE 'from "zod"' -- apps packages
git grep -nE 'JSON\.parse\(' -- apps/api/src apps/web/src
```

Found: env vars read by hand (`readEnv`, `apps/api/src/env.ts:31`) and LLM output checked by
hand (`parseParts`, `apps/api/src/explain.ts:140`). Responses are typed interfaces, not
schemas, in `packages/contract/src/index.ts`.

## 14. Docs that no longer match the code

Docs are William's: file a `guidance` item, never edit them. On `0c2a6da`:

- `docs/concept.md` §5.1 and `docs/architecture.md` D14 and §14 say strategic lessons are gated
  by the classical check; live play now creates diagnosed lessons and doesn't call it
  (`packages/core/src/session.ts:290`, `tools/sim/test/verify.test.ts:1`).
  `docs/lesson-core-design.md` still says "Not yet built" and lists this change for a guidance PR.
- `docs/architecture.md` §11 and `README.md` (Tests) describe game parity with the prototype
  and replays testing the classical check; the replays now pin engine calls and state, not
  lessons.
- `docs/architecture.md` §7 says the server checks each lesson's facts against the game;
  `checkGame` (`apps/api/src/app.ts:114`) checks move legality and line ids only. Its data
  model lists `users` and `lessons` tables; `apps/api/src/db/schema.ts` has `user` (Better Auth)
  and keeps lessons inside `games.state`.
- `docs/architecture.md` §5 shows a `GameEvent` union that differs from
  `GameEventKind` in `packages/core/src/session.ts:81`.

## Content: never reworded

The LLM prompts (`SYSTEM_PROMPT`, `DIAGNOSIS_PROMPT`, `MISTAKE_DESCRIPTION` in
`apps/api/src/explain.ts`), the lesson-text renderer and the catalogue decide what players are
taught. Code may move around them; a wording problem is a `finding`.
