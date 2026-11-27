import type { PrincipleSource } from "@chess-teacher/contract";
import { isConceptId, isPrincipleId } from "@chess-teacher/core";
import {
  conceptText,
  conceptTitle,
  principleText,
  principleTitle,
  type Locale,
} from "@chess-teacher/lesson-text";

/**
 * A principle as the progress pages show it: its title and its one-line text, in the player's
 * locale. Null for an id this version of the core doesn't know.
 */
export function principleCopy(
  source: PrincipleSource,
  id: string,
  locale: Locale,
): { title: string; text: string } | null {
  if (source === "diagnosis" && isConceptId(id))
    return { title: conceptTitle(id, locale), text: conceptText(id, locale) };
  if (source === "features" && isPrincipleId(id))
    return { title: principleTitle(id, locale), text: principleText(id, locale) };
  return null;
}
