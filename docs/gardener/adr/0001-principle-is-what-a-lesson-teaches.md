# ADR 0001: "Principle" is what a lesson teaches, whichever path made it

- **Date:** 2026-11-27
- **Decided by:** William, in session
- **Backlog:** ARCH-001

## Context

Progress counts lessons by what they teach. A feature lesson teaches a principle (`PrincipleId`,
`packages/core/src/principles.ts:23`); a diagnosed lesson names a concept (`ConceptId`,
`packages/core/src/concepts.ts:55`). The contract calls the umbrella a principle
(`PrincipleProgress`, `ProgressResponse.principles`, `packages/contract/src/index.ts:185`), but
its discriminator `PrincipleKind = "principle" | "concept"` (`:183`) uses "principle" for one of
the two members too, and the API calls the umbrella an "idea" (`ideaOf`, `isIdea`,
`apps/api/src/progress.ts:39`, `:47`).

The player already sees "principle": the UX glossary defines it as "one idea from the
curriculum" and lists "rule, tip, theme" as words to avoid (`docs/design/ux-principles.md`,
line 214), the progress page says "Your lessons by principle", and `docs/concept.md` §6 and §7
track progress per principle.

## Decision

"Principle" is the umbrella in every layer: what a lesson teaches, whichever path made it, and
what progress counts. "Idea" is not used for it. Where code must tell the two kinds of id apart,
it says where the id comes from, with the values `Lesson.source` already has:
`"features"` (a `PrincipleId`) or `"diagnosis"` (a `ConceptId`). The core keeps `PrincipleId` and
`ConceptId` as the names of the two id sets.

## Consequences

- ARCH-001 renames the API's `ideaOf`, `isIdea` and `byIdea`, and replaces `PrincipleKind` and
  `PrincipleProgress.kind` with `PrincipleSource` and `source`. The web page's URLs
  (`/app/progress/principle/:id`, `/app/progress/concept/:id`) stay; the router maps each segment
  to its source.
- No catalogue key, saved JSON or database column changes. `lesson_feedback.principle`, which
  holds concept ids for diagnosed lessons, is correctly named under this decision.
- Open, not decided here: `free_material` is both a principle id and a concept id, with different
  titles ("Take free material", "Take what's left undefended"), so a player with older games can
  see two progress rows for one idea.
