# UX principles

Cite rules by number (`UX-7`) in PRs and reviews. How these fit with the other design layers,
and the localisation setup: [`README.md`](README.md).

Numbering follows quiz-builder's `docs/design/ux-principles.md` so a rule improved in one repo
can be carried to the other by number; gaps are rules that don't apply here. Rules only this
app needs start at UX-100.

## Structure

**UX-1 One page, one purpose.** One `h1` per page. Keep heading levels consistent: the same kind
of thing gets the same level everywhere. Pick the element for the outline, the size for the
hierarchy: a panel title inside the game view can be an `h2` styled as a quiet label.

**UX-5 Progressive disclosure.** Show the essential options first. Put advanced settings behind an
expandable section. Use a stepper for complex multi-step flows.

**UX-6 Names wrap, metadata truncates.** Text the user came to read (a principle, an explanation,
a player's name) wraps; it never truncates and never sets a fixed width. Truncation is for
secondary metadata only, with the full text in `title`. Unbroken text must never set a row's
minimum width (`overflow-wrap: anywhere`).

**UX-49 A group's parts sit closer than groups do.** Wherever spacing alone ties things together,
the space inside a group is clearly smaller than the space around it. A form field's label,
control, hint and error sit close together; fields in a form sit well apart, so a label never
looks as if it belongs to the field above. The same holds for a heading and its content, and
for controls laid out in a row.

**UX-50 Give content the width it needs, not the width available.** Running text (explanations,
principles, empty states, help) is at most about 65 characters a line (`max-inline-size: 65ch`),
even when the column around it is wider. A page's content column has a maximum width. The
board takes the space it needs and the side panel has a width sized for its content; never size
a panel by a percentage of the screen.

**UX-54 Don't show what isn't built.** The UI never hints at a feature that does not work yet: no
disabled "Coming soon" buttons, placeholder tabs or teaser copy (coached-game bundles, mobile
apps, other languages before they ship). A feature appears when it does something.

## Saving and feedback

**UX-9 One save contract per page.** A page either saves every change instantly or saves
everything through one Save button. Never mix them. A game saves after every move, silently; the
player never has to think about saving it.

**UX-10 Update first, then sync.** Apply cheap, reversible changes to the UI immediately and sync
in the background (optimistic). If the sync fails, restore the previous value, keep what the user
typed, and say so (UX-14). Use a pending state instead when the user must wait for the result.

**UX-11 Show work within 100ms.** Any action that is not instant shows a loading indicator within
100ms: skeletons for content (matching its final dimensions), a spinner or status text for
actions. Drive the pending UI from the request's own state, not a second flag set before and
reset after the `await`; that copy drifts (for example when a component unmounts mid-flight).

**UX-12 Button states.** Loading: disabled against double submission, spinner over the label with
the width unchanged, label kept as the accessible name. Disabled: visibly disabled, not just
faded, and the reason is visible nearby. Disable only an action that cannot run right now (a
request in flight, the engine still thinking, a limit reached); never disable a submit because
the form is not filled in correctly yet (UX-20). After a failed action the button is enabled
again so the user can retry, and the error appears inline (UX-14). Each view has at most one
primary button (`.primary`).

**UX-13 Success is contextual.** Prefer feedback where the change happened (a tick, the new item in
the list, the board itself) over a toast. Use a toast only when there is no sensible place in
context.

**UX-14 Errors say what, why and what next.** Explain what happened in plain language, say how to
fix it, and offer a retry. Always tell the user when a request fails. Never lose a move, a game
or what the user typed on error.

**UX-15 Undo removals; confirm what cannot be undone.** Removing something still on screen happens
at once and offers Undo, with no confirmation. Throwing away something the server cannot restore
(abandoning a game in progress, deleting an account) asks first in a dialog that names it, with a
danger confirm and no Undo. Never use `window.confirm`: it can't be styled, translated by us or
tested well.

**UX-16 Gate on entitlements at the entry point.** If a limit (the monthly AI explanations, later
coached games) makes something unavailable, the entry point already shows that, with the limit and
the remedy. Never let the player discover it only at the end of a flow. UI gating is presentation
only; the server check stays the authorisation boundary.

**UX-17 Empty states lead to the fix.** Say what is missing and why in one sentence, and offer the
one action that fills it as the view's primary button. Hide controls that only act on content
(sort, filter, tabs) until there is content for them to act on.

## Forms

**UX-18 Defaults and memory.** Pre-fill sensible defaults. Remember the player's choices (colour,
opponent strength) for next time.

**UX-19 Focus on open, except on touch.** Auto-focus the first input in forms and dialogs, but not on
touch devices, where the on-screen keyboard covers the page (check
`matchMedia('(pointer: coarse)')` before any programmatic `.focus()` the user did not trigger).

**UX-20 Validate on blur or submit; submit stays enabled.** Not on every keystroke unless real-time
feedback is the point. A field's hint and error sit between its label and the control. The error
replaces the hint: red text and an icon, `aria-invalid`, `aria-describedby`, specific and
actionable ("Use at least 8 characters", not "Invalid"). The submit button stays enabled while the
form is invalid: pressing it shows every error and moves focus to the first invalid field, and
nothing is sent. Show loading in the submit button while submitting (UX-12).

**UX-21 Fewer clicks.** Auto-submit single-field forms on Enter. Keyboard shortcuts for common
actions (stepping through moves with the arrow keys), shown in the UI with `<kbd>`.

**UX-55 One column, fields as wide as their input.** A form is a single column of fields, label
above each. A field's width says how much it expects; only free text is full width.

**UX-56 Pick the control by the number of options.** One choice from 2 to 4 short options: a
segmented control. From about 5 to 10: radio buttons, all visible. More: a select. A choice that
applies when the form is submitted is a checkbox; one that applies at once is a switch. Checkbox
and switch labels say what happens when on, never a negative.

**UX-57 Every field says what it wants.** A visible label above, in sentence case, without "my" or
"your" ("Email", not "Your email"). An optional field says so in its label ("Comment
(optional)"); required is the default and is not marked. Placeholder text never stands in for a
label or a hint.

## Interaction and motion

**UX-22 Keyboard first.** Everything works with a keyboard, the board included (UX-100). Use
semantic HTML and ARIA where HTML is not enough. Focus styles use `:focus-visible`, never
`:focus`.

**UX-23 Hit targets.** Interactive targets are at least 44 by 44px, and neighbouring targets at least
8px apart. Touch has no hover, so nothing may depend on hover to be found or understood.

**UX-24 Repeated actions are icons.** When the same action appears on every row, use an icon-only
button with a specific accessible label ("Show lesson on move 12", not "Show"). A single action
that appears once keeps its text label. A lone icon is fine only for convention glyphs with one
plausible reading (close, previous/next, first/last, settings).

**UX-58 Looks alike, works alike.** Things that look the same behave the same, and things that
behave differently look different. Nothing that cannot be pressed is styled like a button.

**UX-61 Text links are underlined.** A link inside text is underlined at rest, so it is never colour
alone (UX-36). Things that already look pressable need no underline.

**UX-8 Hover is a surface step.** Cards and rows change background one neutral step on hover
(`--surface` to `--surface-2`). The border and everything else stay as at rest: no coloured hover
border, no hover shadow.

**UX-45 An open menu's trigger looks active.** While a menu is open, its trigger holds its hover look,
driven by the element's own state (`[open]`, `aria-expanded`), not a second state flag.

**UX-46 Interactive states step lighter in dark.** Hover and pressed states move one step towards the
viewer: slightly darker in light, lighter in dark, so a control never goes near-black when
touched. Every element with a hover style also has a pressed style.

**UX-25 Calm motion.** Utility chrome (forms, settings, lists, navigation) gets colour transitions
and small affordance moves only, no entrances or bounces. Name the transitioned properties, never
`transition: all`. Spend motion on the game's moments: a piece moving, the reveal, stepping through
the futures. Animate `transform` and `opacity`. Settle with `cubic-bezier(0.22, 1, 0.36, 1)` and
finish within about 0.5s (a piece move is about 180ms). Nothing loops except a loading indicator.
Motion never carries meaning alone: a move or a result is also said in text.

**UX-26 Reduced motion.** Under `prefers-reduced-motion: reduce` everything appears in its final
state: CSS animations and transitions are off, and JavaScript-driven motion (piece animation,
smooth scroll) checks `matchMedia('(prefers-reduced-motion: reduce)')` and jumps to the end. A
loading indicator may stay, in a calmer form.

**UX-27 No layout shift.** Reserve space for the board, images and dynamic content; skeletons match
content dimensions; nothing pushes content around as it loads; loading buttons keep their width.

## Copy

**UX-30 Clarity first; a coach's voice.** Clarity overrides everything else, tone included. The
player knows the rules but not the strategy (roughly 600 to 1400 rated), so use plain words and
explain any chess term the first time it matters. The voice is a good coach: calm, honest and
encouraging. Describe the move and what it led to, never the player ("Your move left the knight
undefended", not "You blundered"). Praise only what was earned, specifically ("You fixed the
weakness before it cost you"); an exclamation mark only for a genuine success, at most one per
screen. No jokes in errors, the allowance or account settings. Buttons say what they do: a verb
and its object.

| Before                                    | After                                                                                        |
| :---------------------------------------- | :------------------------------------------------------------------------------------------- |
| "Blunder! You hung your knight."          | "Your move left the knight on f3 undefended."                                                |
| "Something went wrong. Please try again." | "Your move wasn't saved because the connection dropped. It's still on the board. Try again." |
| Button: "OK"                              | "Rewind to before Nf3"                                                                       |

**UX-31 Punctuation and words are per-locale style.** Each locale has its own style items, applied
in that locale's catalogue. English (en-GB, en-US): no em dash (use a hyphen, colon, semicolon or
comma), and no "lands" (land, landed, landing) for arriving or appearing; say what happens. Every
locale: no emoji; use an icon. When a locale is added, its review lists that language's own items.
These apply to user-facing copy, not code comments.

**UX-32 Every string comes from the catalogue.** No user-facing string is hardcoded in a component:
text, `aria-label`, `title`, `placeholder`, `alt` and error messages all come from the message
catalogue (`apps/web/messages/<locale>.json`, rendered as `m.key()`; see
[`README.md`](README.md)). en-GB is the source locale; every key exists in every catalogue.
Messages use named placeholders and plural variants; never concatenate fragments or build a
sentence from parts, because word order differs by language. Spelling and vocabulary follow the
locale (colour and color), never one hardcoded variant.

**UX-33 Numbers, dates and lists use Intl.** Format dates, numbers, lists and plurals with `Intl`,
passing the active locale (`getLocale()`), never hand-built and never the browser default by
accident. A count inside a sentence is a plural message, not a number glued to a word ("3
lessons", not `${n} lessons`). Join inline facts with `·`.

**UX-59 One word for each thing.** Use the same word for the same thing everywhere, in labels,
buttons, headings and errors. The glossary (en-GB; each locale keeps its own list):

| Word              | Means                                                                              | Not                                  |
| :---------------- | :--------------------------------------------------------------------------------- | :----------------------------------- |
| game              | one game against the opponent                                                      | match                                |
| move              | one player's move                                                                  | ply, half-move, turn                 |
| opponent          | the side the player plays against                                                  | bot, computer, AI                    |
| engine            | Stockfish, only when we mean its analysis or its prediction                        | AI, computer                         |
| mistake           | a move with a clearly better alternative that cost, or would have cost, the player | blunder, inaccuracy, error           |
| missed chance     | a clearly better option the player didn't take                                     |                                      |
| better move       | the move that would have been better                                               | best move, engine move, correct move |
| lesson            | one mistake or missed chance, with its explanation                                 | tip, card                            |
| principle         | one idea from the curriculum ("Keep your king safe")                               | rule, tip, theme                     |
| coach             | the voice of the AI explanation ("Your coach")                                     | AI tutor, assistant, bot             |
| AI explanation    | one explanation written by the coach; the unit of the monthly allowance            | credit, token, analysis              |
| rewind            | go back to before the mistake and play on from there                               | undo, take back                      |
| undo, redo        | remove the player's latest move and the opponent's reply; play them again          | take back, takeback, rewind          |
| carry on          | continue the game after a lesson                                                   | resume, continue                     |
| sign in, sign out | start and end a session; a new player's button is "Create account"                 | log in, log out, register            |

**UX-60 Copy mechanics.** Sentence case for every piece of UI text, buttons and headings included.
Put the key words first in headings, links and list items. A link's text names where it goes,
never "Learn more" or "click here". No full stop on labels, buttons, headings and other fragments;
a full sentence ends with one. Numbers are numerals, formatted with `Intl` (UX-33). Errors don't
say "please", "sorry" or "oops"; they say what happened and what to do (UX-14). Keep sentences
under about 20 words.

## Typography

**UX-34 Contrast through extremes.** Make hierarchy clear with weight, size and colour (`--text`
against `--muted`) used boldly, not many small steps. When the important thing does not stand out,
first quieten what competes with it before making it louder.

**UX-47 Text on a fill uses that fill's colours.** `--muted` is for neutral surfaces; on a tinted
fill (`--warn-bg`, `--chance-bg`, `--good-bg`) text uses `--text` or the fill's own colour. Never
lower text contrast with `opacity`.

**UX-48 Labels are a last resort.** When showing data rather than asking for it, fold the label into
the value: "12 lessons", "Found it yourself 3 of 5 times", not "Lessons: 12". Form fields always
keep their visible label.

**UX-51 Mixed sizes on one line share a baseline.** Align text of different sizes on one line with
`align-items: baseline`, not `center`. Centre only when one side is a box (a button, an icon).

**UX-52 Numbers hold still and line up.** A number that changes in place (a count, "Move 3 of 8")
uses `font-variant-numeric: tabular-nums`. Numbers in a column are end-aligned and tabular.

**UX-53 Centre only short text.** Centre a headline or a block of at most two lines. Anything
longer is start-aligned (`text-align: start`). One text alignment per view.

## Accessibility and code

**UX-36 Never colour alone.** Every status has text or a shape as well as a colour. Decorative
icons are `aria-hidden`; icon-only buttons have a label. On the board this means UX-101.

**UX-37 Reuse components.** Check `apps/web/src/components/` before building a control. An optional
prop with a default must be what nearly every caller wants and environment-agnostic; behaviour
tied to one caller, endpoint or flow is a required prop.

**UX-38 Appearance is checked by eye, not by unit test.** Tests assert what a user can read, press
and what the app sends, selecting by role and accessible name. Don't assert classes or computed
styles; verify layout and appearance in a real browser, in light and dark, at 375px wide and on a
desktop. Then squint: the view's one primary action and its most important content should still
stand out.

## Localisation

**UX-39 Locale is a setting.** The locale is the player's saved choice, otherwise the browser's
preferred languages matched to a shipped locale, otherwise en-GB; it never comes from the URL.
`<html lang>` follows it. Don't assume left-to-right in layout code: use logical properties
(`margin-inline-start`, `inset-inline-end`, `text-align: start`).

**UX-40 Layout survives text expansion.** Many languages run about 30% longer than English, so build
for that before any of them ship. No fixed-width buttons or columns that clip; essential labels
wrap rather than truncate (UX-6).

**UX-41 Player content is user data.** A player's name and anything else they typed is shown exactly
as entered and never translated. Text we generate (lessons, principles, AI explanations) is ours
and is shown in the player's locale.

## Actions

**UX-42 Preview, then commit explicitly.** A change that replaces content or is hard to reverse is
previewed first and commits only on an explicit action named for what it does, with Cancel. When
the player cannot know the result in advance, preview-then-commit beats commit-then-undo.

**UX-43 Feedback belongs to the action.** Confirmation, errors and Undo appear where the player
acted, or in the shared toast region, and are labelled with the action.

**UX-44 Important controls are not quiet.** A control the player needs at the moment of need (Rewind,
Carry on, Start game) has a visible label and normal-contrast styling. Low-emphasis styling is for
secondary actions only. Put an action next to the thing it acts on, and show it rather than hide
it in a menu when there is room.

## Chess

**UX-100 The board works for everyone.** Click-to-move and drag both work, everywhere a move can be
made. The board is usable with a keyboard and a screen reader: a square can be reached and a move
made without a pointer, and the position and the last move can be read out.

**UX-101 Board marks are never colour alone.** Last move, selection, legal targets, lesson squares and
arrows each differ by shape or pattern as well as colour (a dot for a move, a ring for a capture),
and arrows are always explained by a caption in text ("What happened", "The better move, then…").

**UX-102 Engine time is visible.** Whenever play waits on the engine, the status line above the board
says what is happening within 100ms (UX-11), and it is a live region (`role="status"`). The board
never looks ready while it is not: no move is accepted until it is the player's turn.

**UX-103 Predictions are labelled.** A line the engine predicted is always labelled as a prediction;
moves that were really played are labelled as what happened. Never present a prediction as fact.

**UX-104 Teach only what we measured.** Lesson text states only facts the core measured (`facts()`),
and an AI explanation is written from those same facts and labelled as AI-written. Neither claims
a reason the analysis does not support. When unsure, say less.

**UX-105 One interruption at a time.** A lesson is the only thing that pauses play. Other feedback
(an error, a toast, the allowance) waits or appears in context, and never covers the board while
it is the player's move.

**UX-106 Moves go through one formatter.** Moves are shown in standard algebraic notation with move
numbers ("12. Nf3", "12… Nf6"), always through one formatter, never hand-built. Piece letters are
language-specific (N is S in German), so a new locale either localises them or switches to
figurines (♘f3) in that formatter. A move's accessible name reads it in words from the catalogue
("knight to f3").

## Known gaps

Parts of the current UI don't meet these rules yet. Fix them when you touch that code, not as
drive-by changes in an unrelated PR:

- UX-31: emoji and symbol glyphs as icons (👍 👎 ⚠ ⏳ ✓ and the stepper's ⏮ ◀ ▶ ⏭); there is no icon
  set yet.
- UX-32: the landing page (`apps/web/landing/`) is static English HTML. The sample explanation
  that the fake LLM writes in development (`FAKE_LLM=1`) is English whatever the locale. When a
  piece is dragged with the pointer, react-chessboard's drag library (dnd-kit) announces it to
  screen readers in its own English; react-chessboard doesn't let us replace that text.
  Keyboard moves don't use it.
- UX-41: an AI explanation is written once, in the locale it was first asked for; changing
  locale later doesn't rewrite it. Lessons in games saved before lesson text moved to the
  catalogue keep their trigger sentence in English when the game was rewound past it.
- UX-60: some existing copy says "please" in errors; reword it when you touch it.
- UX-106: the board reads moves in words (`spokenMove` in `apps/web/src/lib/moves.ts`), and
  lesson moves go through `moveText()` in `@chess-teacher/lesson-text`, but lesson moves have no
  spoken form yet. The move list, the lines under the futures boards and the lines sent to the
  LLM show SAN from `packages/core` directly, with no spoken form.
