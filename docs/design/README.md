# Design docs

How the layers fit, highest precedence first. On conflict the higher layer wins.

1. [`ux-principles.md`](ux-principles.md): behaviour. Numbered rules (UX-1...) for structure,
   saving, feedback, forms, motion, copy, accessibility, localisation and the board.
2. [`components.md`](components.md): how the UI is built (D15). Controls are primitives in
   `apps/web/src/ui/` wrapping React Aria Components, styled with Tailwind and the semantic
   tokens in `apps/web/src/theme.css` (colour, radius, shadow, with their dark values). There is
   no separate brand document yet; use the tokens, never a raw colour.
3. The `modern-web-guidance` skill (`.claude/skills/`): how to build on the web platform where
   React Aria doesn't (layout, CSS, non-interactive HTML, performance). For controls React Aria
   provides, React Aria wins, even where the skill prefers a native element. Browser support
   target: Baseline Widely available.
4. Browser defaults: only where none of the above says anything.

Enforcement: where a rule is checkable, a script enforces it in `pnpm check`, which CI runs:

- `pnpm lint`: no words written directly in JSX text or in `aria-label`, `title`,
  `placeholder` or `alt` (`eslint/ui-text.js`, UX-32). It sees JSX only; strings built in hooks
  and helpers are left to review.
- `pnpm lint` (`eslint/ui-components.js`, components.md): no raw `<button>`, `<input>`,
  `<select>`, `<textarea>` or `<dialog>` and no `react-aria-components` import outside
  `apps/web/src/ui/` (UX-37); no arbitrary colour utilities such as `bg-[#b42318]`.
- `pnpm test` (`apps/web/test/messages.test.ts`): every locale has every key and placeholder of
  the en-GB catalogue, and en-GB has no em dashes or emoji (UX-31).
- `pnpm smoke`: the main journey in en-GB, and the phone layout in en-US.

The prose covers what scripts cannot; reviewers cite it.

## Localisation status

The localisation rules (UX-31 to UX-33, UX-39 to UX-41) apply to every locale, shipped or
added later.

- **Library:** [Paraglide JS](https://paraglidejs.com) 3 (inlang), with
  `@inlang/paraglide-js-react` for messages that contain markup. Project:
  `apps/web/project.inlang/settings.json` (locales, message-format plugin); compiler options:
  `apps/web/project.inlang/paraglide.config.ts`. The Vite plugin and `pnpm typecheck` compile
  the catalogues to typed functions in `apps/web/src/paraglide/`, which is generated and
  git-ignored: never edit or commit it.
- **Locales shipped:** en-GB (the source; Will writes in it) and en-US. Other languages are
  added when there's a reason to, each with a review of its own copy.
- **Catalogues:** `apps/web/messages/<locale>.json`, inlang message format. Keys are snake_case
  ids grouped by screen (`reveal_find`, `progress_title`), not English text.
  - Placeholders: `{name}`.
  - Numbers: declare them so they're formatted for the locale (UX-33):
    `"declarations": ["input count", "local countValue = count: number"]`.
  - Plurals: a `plural` selector with `one` and `other` variants; see `progress_lessons`.
  - Markup inside a sentence (bold, a link, a styled move): `{#strong}…{/strong}`, rendered with
    `ParaglideMessage` and a `markup` map; see `explanation_lead` and `Licences.tsx`.
- **Adding a string:** add the key to every `messages/<locale>.json` (identical text where the
  locales agree), then `import { m } from "../paraglide/messages.js"` and render `{m.key()}`.
  Never index `m` dynamically (`m[key]`); it defeats tree-shaking and type checks.
- **Lesson text:** `packages/core` never writes a sentence. It returns ids and values
  (`Detail`, `Trigger`, `Hint`, `MoveRef`, principle ids; see `packages/core/src/text.ts`), and
  `@chess-teacher/lesson-text` (`packages/lesson-text`) renders them from the same catalogue,
  with the locale passed explicitly: the web app passes `getLocale()`, the API passes en-GB for
  the facts it sends the LLM. That package compiles its own copy of the catalogue
  (`pnpm i18n`, generated and git-ignored like `apps/web/src/paraglide/`). A new kind of
  lesson text is a new variant in `text.ts`, a key per locale, and a case in the renderer; the
  parity tests word it as the Python prototype did, in `tools/sim/src/prototype-text.ts`.
- **Server errors:** the API answers with a code (`ApiErrorCode` in `packages/contract`), never
  a sentence; `apps/web/src/api/errors.ts` words codes and Better Auth's error codes.
- **AI explanations:** the client sends the player's locale; the server tells the model to
  write in it (and stores it with the explanation). The facts the model reads stay in en-GB.
- **Locale:** `localStorage` (`PARAGLIDE_LOCALE`), then the browser's preferred languages, then
  en-GB; never in the URL. The locale detected on a first visit is saved, so it stays the same
  until the player changes it. `main.tsx` sets `<html lang>`. Read the locale with `getLocale()`
  from `paraglide/runtime.js` and pass it to every `Intl` formatter. There is no language
  setting in the UI yet (UX-54: it appears when a second language does).
- **Adding a locale:** add `messages/<locale>.json` with every key, register it in `locales` in
  `settings.json`, check the layout in the longest locale (UX-40), review that language's
  punctuation and wording items (UX-31), and decide how moves are written (UX-106). React Aria
  picks up the new language from `settings.json`; check its own strings read well in it
  (components.md).
- **Not in the catalogue yet:** the static landing page `apps/web/landing/`. See Known gaps in
  [`ux-principles.md`](ux-principles.md).
