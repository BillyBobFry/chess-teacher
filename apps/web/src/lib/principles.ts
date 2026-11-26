import type { PrincipleKind } from "@chess-teacher/contract";
import { isConceptId, isPrincipleId } from "@chess-teacher/core";
import {
  conceptText,
  conceptTitle,
  principleText,
  principleTitle,
  type Locale,
} from "@chess-teacher/lesson-text";

/**
 * What the progress pages call a principle or concept: its title and its one-line idea, in
 * the player's locale. Null for an id this version of the core doesn't know.
 */
export function principleCopy(
  kind: PrincipleKind,
  id: string,
  locale: Locale,
): { title: string; text: string } | null {
  if (kind === "concept" && isConceptId(id))
    return { title: conceptTitle(id, locale), text: conceptText(id, locale) };
  if (kind === "principle" && isPrincipleId(id))
    return { title: principleTitle(id, locale), text: principleText(id, locale) };
  return null;
}
