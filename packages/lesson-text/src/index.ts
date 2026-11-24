/**
 * Lesson text in a given locale: renders what the core returns as data (principles, details,
 * triggers, hints, moves) with the app's message catalogue (apps/web/messages).
 *
 * The web app renders in the player's locale; the API renders en-GB facts for the LLM. Every
 * function takes the locale explicitly, so this package's own Paraglide runtime never has to
 * detect one.
 */

import type {
  Detail,
  Hint,
  LessonFeature,
  MoveRef,
  PieceCount,
  PieceOn,
  PrincipleId,
  Trigger,
  Undefended,
} from "@chess-teacher/core";
import { m } from "./paraglide/messages.js";
import { baseLocale, isLocale, locales, type Locale } from "./paraglide/runtime.js";

export { baseLocale, isLocale, locales, type Locale };

const list = (items: string[], locale: Locale): string =>
  new Intl.ListFormat(locale, { type: "conjunction" }).format(items);

const listOrNone = (items: string[], locale: Locale): string =>
  items.length ? list(items, locale) : m.list_none({}, { locale });

export function principleTitle(id: PrincipleId, locale: Locale): string {
  const o = { locale };
  switch (id) {
    case "hanging":
      return m.principle_hanging_title({}, o);
    case "safety":
      return m.principle_safety_title({}, o);
    case "develop":
      return m.principle_develop_title({}, o);
    case "king_safety":
      return m.principle_king_safety_title({}, o);
    case "centre":
      return m.principle_centre_title({}, o);
    case "activity":
      return m.principle_activity_title({}, o);
    case "pawn_weaknesses":
      return m.principle_pawn_weaknesses_title({}, o);
    case "target_weaknesses":
      return m.principle_target_weaknesses_title({}, o);
    case "passed_pawns":
      return m.principle_passed_pawns_title({}, o);
    case "outposts":
      return m.principle_outposts_title({}, o);
    case "open_files":
      return m.principle_open_files_title({}, o);
    case "king_activity":
      return m.principle_king_activity_title({}, o);
  }
}

export function principleText(id: PrincipleId, locale: Locale): string {
  const o = { locale };
  switch (id) {
    case "hanging":
      return m.principle_hanging_text({}, o);
    case "safety":
      return m.principle_safety_text({}, o);
    case "develop":
      return m.principle_develop_text({}, o);
    case "king_safety":
      return m.principle_king_safety_text({}, o);
    case "centre":
      return m.principle_centre_text({}, o);
    case "activity":
      return m.principle_activity_text({}, o);
    case "pawn_weaknesses":
      return m.principle_pawn_weaknesses_text({}, o);
    case "target_weaknesses":
      return m.principle_target_weaknesses_text({}, o);
    case "passed_pawns":
      return m.principle_passed_pawns_text({}, o);
    case "outposts":
      return m.principle_outposts_text({}, o);
    case "open_files":
      return m.principle_open_files_text({}, o);
    case "king_activity":
      return m.principle_king_activity_text({}, o);
  }
}

/** UX-106: every move shown with its number goes through here ("12. Nf3", "12… Nf6"). */
export function moveText(move: MoveRef, locale: Locale): string {
  const inputs = { moveNumber: move.moveNumber, san: move.san };
  return move.colour === "w" ? m.move_white(inputs, { locale }) : m.move_black(inputs, { locale });
}

/** "knight on b1" */
export function pieceOnText({ piece, square }: PieceOn, locale: Locale): string {
  const o = { locale };
  switch (piece) {
    case "p":
      return m.piece_on_p({ square }, o);
    case "n":
      return m.piece_on_n({ square }, o);
    case "b":
      return m.piece_on_b({ square }, o);
    case "r":
      return m.piece_on_r({ square }, o);
    case "q":
      return m.piece_on_q({ square }, o);
    case "k":
      return m.piece_on_k({ square }, o);
  }
}

/** "a knight", "2 pawns" (a king is never captured). */
function pieceCountText({ piece, count }: PieceCount, locale: Locale): string {
  const o = { locale };
  switch (piece) {
    case "p":
      return m.piece_count_p({ count }, o);
    case "n":
      return m.piece_count_n({ count }, o);
    case "b":
      return m.piece_count_b({ count }, o);
    case "r":
      return m.piece_count_r({ count }, o);
    case "q":
    case "k":
      return m.piece_count_q({ count }, o);
  }
}

/** What a lesson is about, as it fills "would have improved {factor}". */
export function factorText(feature: LessonFeature, locale: Locale): string {
  const o = { locale };
  switch (feature) {
    case "material":
      return m.factor_material({}, o);
    case "development":
      return m.factor_development({}, o);
    case "king_safety":
    case "mate":
      return m.factor_king_safety({}, o);
    case "centre":
      return m.factor_centre({}, o);
    case "mobility":
      return m.factor_mobility({}, o);
    case "own_pawns":
      return m.factor_own_pawns({}, o);
    case "their_pawns":
      return m.factor_their_pawns({}, o);
    case "passed_pawns":
      return m.factor_passed_pawns({}, o);
    case "outposts":
      return m.factor_outposts({}, o);
    case "open_files":
      return m.factor_open_files({}, o);
    case "king_activity":
      return m.factor_king_activity({}, o);
  }
}

/** What a feature measured, as a phrase that also works inside a sentence. */
export function detailText(d: Detail, locale: Locale): string {
  const o = { locale };
  switch (d.kind) {
    case "material":
      if (d.balance > 0) return m.detail_material_up({ count: d.balance }, o);
      if (d.balance < 0) return m.detail_material_down({ count: -d.balance }, o);
      return m.detail_material_level({}, o);
    case "opening_over":
      return m.detail_opening_over({}, o);
    case "undeveloped":
      return d.pieces.length
        ? m.detail_undeveloped(
            {
              pieces: list(
                d.pieces.map((p) => pieceOnText(p, locale)),
                locale,
              ),
            },
            o,
          )
        : m.detail_all_developed({}, o);
    case "queen_gone":
      return m.detail_queen_gone({}, o);
    case "king_shelter":
      return m.detail_king_shelter({ shield: d.shield, attacks: d.attacks }, o);
    case "centre":
      return m.detail_centre({ mine: d.mine, theirs: d.theirs }, o);
    case "mobility":
      return m.detail_mobility({ mine: d.mine, theirs: d.theirs }, o);
    case "pawns": {
      const weaknesses = [
        ...(d.isolated.length
          ? [m.pawns_isolated({ count: d.isolated.length, squares: list(d.isolated, locale) }, o)]
          : []),
        ...(d.doubledFiles.length
          ? [m.pawns_doubled({ count: d.doubledFiles.length, files: list(d.doubledFiles, locale) }, o)]
          : []),
        ...(d.backward.length
          ? [m.pawns_backward({ count: d.backward.length, squares: list(d.backward, locale) }, o)]
          : []),
      ];
      if (d.side === "own") {
        return weaknesses.length
          ? m.detail_pawns_own({ weaknesses: list(weaknesses, locale) }, o)
          : m.detail_pawns_own_none({}, o);
      }
      return weaknesses.length
        ? m.detail_pawns_theirs({ weaknesses: list(weaknesses, locale) }, o)
        : m.detail_pawns_theirs_none({}, o);
    }
    case "passed_pawns":
      return m.detail_passed_pawns(
        { mine: listOrNone(d.mine, locale), theirs: listOrNone(d.theirs, locale) },
        o,
      );
    case "outposts":
      return m.detail_outposts({ mine: listOrNone(d.mine, locale), theirs: listOrNone(d.theirs, locale) }, o);
    case "open_files":
      return m.detail_open_files(
        { mine: listOrNone(d.mine, locale), theirs: listOrNone(d.theirs, locale) },
        o,
      );
    case "not_endgame":
      return m.detail_not_endgame({}, o);
    case "king_activity":
      return m.detail_king_activity(
        { mine: d.mine, mineSteps: d.mineSteps, theirs: d.theirs, theirsSteps: d.theirsSteps },
        o,
      );
    case "checkmated":
      return m.detail_checkmated({}, o);
    case "no_mate":
      return m.detail_no_mate({}, o);
    case "none":
      return "";
  }
}

/** What happened in the game when a lesson was triggered, as a sentence. */
export function triggerText(t: Trigger, locale: Locale): string {
  const o = { locale };
  switch (t.kind) {
    case "checkmated":
      return m.trigger_checkmated({}, o);
    case "losing_material":
      return m.trigger_losing_material({}, o);
    case "lost_material": {
      const lost = list(
        t.lost.map((c) => pieceCountText(c, locale)),
        locale,
      );
      if (t.taken.length) {
        const taken = list(
          t.taken.map((c) => pieceCountText(c, locale)),
          locale,
        );
        return t.more
          ? m.trigger_lost_traded_more({ lost, taken, net: t.net }, o)
          : m.trigger_lost_traded({ lost, taken, net: t.net }, o);
      }
      return t.more ? m.trigger_lost_more({ lost, net: t.net }, o) : m.trigger_lost({ lost, net: t.net }, o);
    }
    case "feature": {
      const detail = detailText(t.detail, locale);
      switch (t.feature) {
        // The core reports material as lost_material; this is only for completeness.
        case "material":
          return m.trigger_losing_material({}, o);
        case "development":
          return m.trigger_development({ detail }, o);
        case "king_safety":
          return m.trigger_king_safety({ detail }, o);
        case "centre":
          return m.trigger_centre({ detail }, o);
        case "mobility":
          return m.trigger_mobility({ detail }, o);
        case "own_pawns":
          return m.trigger_own_pawns({ detail }, o);
        case "their_pawns":
          return m.trigger_their_pawns({ detail }, o);
        case "passed_pawns":
          return m.trigger_passed_pawns({ detail }, o);
        case "outposts":
          return m.trigger_outposts({ detail }, o);
        case "open_files":
          return m.trigger_open_files({ detail }, o);
        case "king_activity":
          return m.trigger_king_activity({ detail }, o);
      }
      break;
    }
    case "chance_gone":
      return m.reveal_chance_gone({}, o);
    case "legacy":
      return t.text;
  }
}

export function hintText(h: Hint, locale: Locale): string {
  const o = { locale };
  switch (h.kind) {
    case "castled":
      return m.hint_castled({}, o);
    case "move":
      return m.hint_move({ moveNumber: h.move.moveNumber, san: h.move.san }, o);
    case "piece":
      switch (h.piece) {
        case "p":
          return m.hint_piece_p({}, o);
        case "n":
          return m.hint_piece_n({}, o);
        case "b":
          return m.hint_piece_b({}, o);
        case "r":
          return m.hint_piece_r({}, o);
        case "q":
          return m.hint_piece_q({}, o);
        case "k":
          return m.hint_piece_k({}, o);
      }
  }
}

/** One undefended piece: "knight on g5", or "the piece you moved, now on f4". */
export function undefendedText(u: Undefended, locale: Locale): string {
  return u.moved ? m.piece_moved_now_on({ square: u.square }, { locale }) : pieceOnText(u, locale);
}

/** Join phrases into a list for the locale ("a, b and c"). */
export const listText = list;
