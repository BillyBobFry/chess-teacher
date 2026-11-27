# Components and styling

How the web app's UI is built: React Aria Components for behaviour, Tailwind for styling, a
theme of semantic tokens, and one folder of wrapped controls (D15 in
[`../architecture.md`](../architecture.md)). Behaviour and copy rules are in
[`ux-principles.md`](ux-principles.md) and win on conflict.

## Two folders

- **`apps/web/src/ui/`: primitives.** One file per control (`Button.tsx`, `Dialog.tsx`,
  `Menu.tsx`, `RadioGroup.tsx`, `TextField.tsx`...). Each wraps a React Aria component where
  React Aria has one, and owns all of its styling. This folder is the list of what exists.
- **`apps/web/src/components/`: features.** Screens and pieces of the game (`Reveal`,
  `NewGame`, `Futures`). They compose primitives and lay them out with Tailwind utilities.

Feature code never renders a raw interactive element (`<button>`, `<input>`, `<select>`,
`<textarea>`, `<dialog>`) and never imports `react-aria-components`; it uses `ui/`. Lint
enforces both. If the control you need isn't in `ui/`, add it there first, following the
pattern below, rather than building it inside a feature.

The board is the exception: `Board.tsx` and its keyboard grid are a chess-specific widget built
on react-chessboard (UX-100), not a primitive.

## Writing a primitive

- **Wrap the React Aria component** and pass its props through, so callers get its API
  (`onPress`, `isDisabled`, `isSelected`...). Don't rename them.
- **Variants are a small, closed union** declared with `tv()` from `tailwind-variants`
  (`variant: "primary" | "secondary" | "critical" | "link"`). A default must be what nearly
  every caller wants (UX-37); otherwise the prop is required.
- **Style states with React Aria's data attributes**, not CSS pseudo-classes:
  `data-hovered:`, `data-pressed:`, `data-focus-visible:`, `data-disabled:`, `data-selected:`.
  React Aria doesn't report hover from touch, so nothing hover-only leaks onto phones (UX-23),
  and `data-focus-visible` is keyboard focus only (UX-22). Every hover style has a pressed
  style (UX-46).
- **Meet the rules once, in the primitive:** 44px targets (UX-23), named transitions and
  reduced motion (UX-25, UX-26), button states (UX-12). Callers then get them for free.
- **Text arrives as props or children**, never as a literal inside the primitive (UX-32).
- **Check that attributes reach the element.** React Aria passes through only the props it
  knows, and TypeScript doesn't check hyphenated attributes, so something like
  `aria-keyshortcuts` can vanish without an error. A primitive that needs one declares it as a
  prop and sets it on the element itself (see `ui/Button`).
- **`className` is for placement only**: margin, width, grid or flex placement. Colour,
  typography and state styling belong to the primitive's variants; if a caller needs a
  different look, add a variant. Classes are merged with `tailwind-merge` (through `tv()`), so a
  caller's class wins over the primitive's on the same property.

## Icons

Icons come from [Lucide](https://lucide.dev), through `lucide-react`. Import each one by name
(`import { Undo2 } from "lucide-react"`), so only the icons used are bundled. No other icon set,
no hand-drawn SVG, and no emoji or symbol glyphs standing in for icons (UX-31).

- **An icon-only button is an `IconButton`** (`icon`, `label`, optional `shortcut`). The label is
  its accessible name and its tooltip, shown on hover and keyboard focus. Use one only where
  UX-24 allows; otherwise use a `Button` with text.
- **A toggle with an icon** is a `ToggleButton` with the icon as its child and an `aria-label`.
- **Icons are decorative:** `aria-hidden`, with the name on the control (UX-36). They draw in the
  text colour (`currentColor`), so they follow the tokens and dark mode with no colour of their
  own.
- **Size:** `size-5` (20px) inside a control, with `shrink-0` so a long label never squeezes it.

## Tokens

The theme lives in `apps/web/src/theme.css`, in Tailwind's `@theme` block. Each token is
defined once and given its dark value under `prefers-color-scheme: dark`, so components never
need `dark:` for colour. If a colour is missing, add a token rather than reaching for `dark:`.

Tailwind's default colour palette is removed (`--color-*: initial`): `bg-red-500` does not
exist, and lint rejects arbitrary colours (`bg-[#b42318]`). Use these:

| Token                             | Use                                                                      |
| :-------------------------------- | :----------------------------------------------------------------------- |
| `canvas`                          | Page background                                                          |
| `surface`                         | Panels, cards, controls at rest                                          |
| `surface-muted`                   | One neutral step from `surface`: hover on rows (UX-8), hints, zebra rows |
| `fg`                              | Body text                                                                |
| `fg-muted`                        | Secondary text, on neutral surfaces only (UX-47)                         |
| `border`                          | Dividers and control outlines                                            |
| `primary`, `on-primary`           | The view's one main action (UX-12), the player's turn, links             |
| `critical`, `on-critical`         | Destructive actions (UX-15)                                              |
| `warning`, `warning-subtle`       | Errors and consequences of a mistake                                     |
| `success`, `success-subtle`       | Good outcomes, the AI coach                                              |
| `chance`, `chance-subtle`         | Missed chances: a teaching concept, not a status, so it keeps its name   |
| `*-hover`, `*-pressed` (on fills) | Hover and pressed fills: darker in light, lighter in dark (UX-46)        |

"Secondary" is a button variant (a `surface` fill with a `border`), not a colour.

- **Text on a fill** uses `fg` or the fill's own colour, never `fg-muted` (UX-47). On
  `primary` and `critical` fills use `on-primary` and `on-critical`.
- **Board colours** (`--sq-*`, `--arrow-*`) stay plain CSS variables next to the board's
  styles. Only the board uses them, so they are not Tailwind colours.
- **Radius and shadow** are semantic too: `rounded-control` (buttons, inputs),
  `rounded-panel` (panels, dialogs, menus), `shadow-panel`. `rounded-full` is for circles.
- **Spacing and type** use Tailwind's default scales. Prefer the scale to arbitrary values.

## Library strings and locale

React Aria has a few strings of its own, mostly for screen readers ("Dismiss", "Clear
search"), translated for its supported locales. `main.tsx` wraps the app in
`<I18nProvider locale={getLocale()}>`, so they follow the player's locale. These strings are the
one exception to UX-32. When we ship a locale React Aria doesn't cover, or one of its strings
reads wrong, pass our own label from the catalogue through the component's label prop.

`@react-aria/optimize-locales-plugin` in `vite.config.ts` drops the languages we don't ship from
the bundle. It reads them from `project.inlang/settings.json`, so a new locale needs no change
there.

## Migration

`apps/web/src/styles.css` holds the styles from before D15, in a cascade layer below Tailwind's
utilities. Don't add rules to it. When you change a screen, move what you touch to primitives and
utilities and delete the rules it no longer needs. Every control already comes from `ui/`;
what's left in `styles.css` is feature layout and content styling. Tailwind's base reset
(preflight) is switched on in the same change that deletes the last of it, so until then a
primitive sets every property it relies on, including the background and border of a
`<button>`.
