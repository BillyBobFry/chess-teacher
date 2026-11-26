/**
 * Lesson text in a given locale: renders what the core returns as data (principles, details,
 * triggers, hints, moves) with the app's message catalogue (apps/web/messages).
 *
 * The web app renders in the player's locale; the API renders en-GB facts for the LLM. Every
 * function takes the locale explicitly, so this package's own Paraglide runtime never has to
 * detect one.
 */

import type {
  ClaimFact,
  ConceptId,
  Detail,
  Hint,
  Lesson,
  LessonFeature,
  MistakeKind,
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
    case "free_material":
      return m.principle_free_material_title({}, o);
    case "forcing_moves":
      return m.principle_forcing_moves_title({}, o);
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
    case "free_material":
      return m.principle_free_material_text({}, o);
    case "forcing_moves":
      return m.principle_forcing_moves_text({}, o);
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
    case "threat_played":
      return m.trigger_threat_played({ move: moveText(t.move, locale) }, o);
    case "piece_chased":
      return m.trigger_piece_chased(
        { move: moveText(t.move, locale), target: pieceOnText(t.target, locale) },
        o,
      );
    case "king_checked":
      return m.trigger_king_checked({ move: moveText(t.move, locale) }, o);
    case "pawn_advanced":
      return m.trigger_pawn_advanced({ move: moveText(t.move, locale) }, o);
    case "rook_invaded":
      return m.trigger_rook_invaded({ square: t.square }, o);
    case "replied":
      return m.trigger_replied({ move: moveText(t.move, locale) }, o);
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

// --------------------------------------------------------------------------- diagnosed lessons

/** A concept's name, as a lesson's title ("Watch for forks"). */
export function conceptTitle(id: ConceptId, locale: Locale): string {
  const o = { locale };
  switch (id) {
    case "hanging_piece":
      return m.concept_hanging_piece_title({}, o);
    case "count_attackers":
      return m.concept_count_attackers_title({}, o);
    case "free_material":
      return m.concept_free_material_title({}, o);
    case "removed_own_defender":
      return m.concept_removed_own_defender_title({}, o);
    case "false_defender":
      return m.concept_false_defender_title({}, o);
    case "greedy_grab":
      return m.concept_greedy_grab_title({}, o);
    case "fork":
      return m.concept_fork_title({}, o);
    case "pin":
      return m.concept_pin_title({}, o);
    case "skewer":
      return m.concept_skewer_title({}, o);
    case "discovered_attack":
      return m.concept_discovered_attack_title({}, o);
    case "opened_line":
      return m.concept_opened_line_title({}, o);
    case "trapped_piece":
      return m.concept_trapped_piece_title({}, o);
    case "in_between_move":
      return m.concept_in_between_move_title({}, o);
    case "remove_the_guard":
      return m.concept_remove_the_guard_title({}, o);
    case "missed_threat":
      return m.concept_missed_threat_title({}, o);
    case "mate_threat":
      return m.concept_mate_threat_title({}, o);
    case "back_rank":
      return m.concept_back_rank_title({}, o);
    case "king_in_centre":
      return m.concept_king_in_centre_title({}, o);
    case "king_shelter":
      return m.concept_king_shelter_title({}, o);
    case "escape_square":
      return m.concept_escape_square_title({}, o);
    case "perpetual_check":
      return m.concept_perpetual_check_title({}, o);
    case "stalemate":
      return m.concept_stalemate_title({}, o);
    case "attack_the_king":
      return m.concept_attack_the_king_title({}, o);
    case "tempo_attack":
      return m.concept_tempo_attack_title({}, o);
    case "lost_time":
      return m.concept_lost_time_title({}, o);
    case "development":
      return m.concept_development_title({}, o);
    case "pawn_break":
      return m.concept_pawn_break_title({}, o);
    case "passed_pawn":
      return m.concept_passed_pawn_title({}, o);
    case "pawn_weakness":
      return m.concept_pawn_weakness_title({}, o);
    case "centre_control":
      return m.concept_centre_control_title({}, o);
    case "rook_activity":
      return m.concept_rook_activity_title({}, o);
    case "bad_placement":
      return m.concept_bad_placement_title({}, o);
    case "key_square":
      return m.concept_key_square_title({}, o);
    case "trade_decisions":
      return m.concept_trade_decisions_title({}, o);
    case "endgame_knowledge":
      return m.concept_endgame_knowledge_title({}, o);
  }
}

/** What a concept means and when it applies, in a sentence or two. */
export function conceptText(id: ConceptId, locale: Locale): string {
  const o = { locale };
  switch (id) {
    case "hanging_piece":
      return m.concept_hanging_piece_text({}, o);
    case "count_attackers":
      return m.concept_count_attackers_text({}, o);
    case "free_material":
      return m.concept_free_material_text({}, o);
    case "removed_own_defender":
      return m.concept_removed_own_defender_text({}, o);
    case "false_defender":
      return m.concept_false_defender_text({}, o);
    case "greedy_grab":
      return m.concept_greedy_grab_text({}, o);
    case "fork":
      return m.concept_fork_text({}, o);
    case "pin":
      return m.concept_pin_text({}, o);
    case "skewer":
      return m.concept_skewer_text({}, o);
    case "discovered_attack":
      return m.concept_discovered_attack_text({}, o);
    case "opened_line":
      return m.concept_opened_line_text({}, o);
    case "trapped_piece":
      return m.concept_trapped_piece_text({}, o);
    case "in_between_move":
      return m.concept_in_between_move_text({}, o);
    case "remove_the_guard":
      return m.concept_remove_the_guard_text({}, o);
    case "missed_threat":
      return m.concept_missed_threat_text({}, o);
    case "mate_threat":
      return m.concept_mate_threat_text({}, o);
    case "back_rank":
      return m.concept_back_rank_text({}, o);
    case "king_in_centre":
      return m.concept_king_in_centre_text({}, o);
    case "king_shelter":
      return m.concept_king_shelter_text({}, o);
    case "escape_square":
      return m.concept_escape_square_text({}, o);
    case "perpetual_check":
      return m.concept_perpetual_check_text({}, o);
    case "stalemate":
      return m.concept_stalemate_text({}, o);
    case "attack_the_king":
      return m.concept_attack_the_king_text({}, o);
    case "tempo_attack":
      return m.concept_tempo_attack_text({}, o);
    case "lost_time":
      return m.concept_lost_time_text({}, o);
    case "development":
      return m.concept_development_text({}, o);
    case "pawn_break":
      return m.concept_pawn_break_text({}, o);
    case "passed_pawn":
      return m.concept_passed_pawn_text({}, o);
    case "pawn_weakness":
      return m.concept_pawn_weakness_text({}, o);
    case "centre_control":
      return m.concept_centre_control_text({}, o);
    case "rook_activity":
      return m.concept_rook_activity_text({}, o);
    case "bad_placement":
      return m.concept_bad_placement_text({}, o);
    case "key_square":
      return m.concept_key_square_text({}, o);
    case "trade_decisions":
      return m.concept_trade_decisions_text({}, o);
    case "endgame_knowledge":
      return m.concept_endgame_knowledge_text({}, o);
  }
}

/** A diagnosed lesson with no concept is titled by what kind of mistake it was. */
export function mistakeTitle(kind: MistakeKind, locale: Locale): string {
  const o = { locale };
  switch (kind) {
    case "mated":
      return m.mistake_mated_title({}, o);
    case "loses_material":
      return m.mistake_loses_material_title({}, o);
    case "misses_mate":
      return m.mistake_misses_mate_title({}, o);
    case "misses_material":
      return m.mistake_misses_material_title({}, o);
    case "positional":
      return m.mistake_positional_title({}, o);
  }
}

/** A lesson's title: its principle, its concept, or what kind of mistake it was. */
export function lessonTitle(lesson: Lesson, locale: Locale): string {
  if (lesson.source === "features") return principleTitle(lesson.principle, locale);
  return lesson.concept ? conceptTitle(lesson.concept, locale) : mistakeTitle(lesson.mistake, locale);
}

/** One verified claim about a diagnosed lesson, as a sentence. */
export function claimText(c: ClaimFact, locale: Locale): string {
  const o = { locale };
  const piece = (p: PieceOn) => pieceOnText(p, locale);
  switch (c.kind) {
    case "punishment":
      if (c.mates) return m.claim_punishment_mate({ line: c.line }, o);
      return c.wins
        ? m.claim_punishment_wins({ line: c.line, piece: piece(c.wins) }, o)
        : m.claim_punishment_other({ line: c.line }, o);
    case "missed_win":
      if (c.mates) return m.claim_missed_win_mate({ line: c.line }, o);
      return c.wins
        ? m.claim_missed_win_wins({ line: c.line, piece: piece(c.wins) }, o)
        : m.claim_missed_win_other({ line: c.line }, o);
    case "threat":
      if (c.ignored) {
        if (c.mates) return m.claim_threat_ignored_mate({ line: c.line }, o);
        return c.wins
          ? m.claim_threat_ignored_wins({ line: c.line, piece: piece(c.wins) }, o)
          : m.claim_threat_ignored_other({ line: c.line }, o);
      }
      if (c.mates) return m.claim_threat_mate({ line: c.line }, o);
      return c.wins
        ? m.claim_threat_wins({ line: c.line, piece: piece(c.wins) }, o)
        : m.claim_threat_other({ line: c.line }, o);
    case "removed_defender":
      return m.claim_removed_defender({ defender: piece(c.defender), square: c.square }, o);
    case "opened_line":
      return m.claim_opened_line({ from: c.from, attacker: piece(c.attacker), square: c.square }, o);
    case "pinned_defender":
      return m.claim_pinned_defender({ defender: piece(c.defender), square: c.square }, o);
    case "pinned_target":
      return m.claim_pinned_target({ target: piece(c.target), behind: piece(c.behind) }, o);
    case "outnumbered": {
      const counts = { attackers: c.attackers, defenders: c.defenders };
      if (c.defenders === 0) {
        if (!c.target) return m.claim_undefended_square({ square: c.square }, o);
        return c.side === "yours"
          ? m.claim_undefended_yours({ piece: piece(c.target) }, o)
          : m.claim_undefended_theirs({ piece: piece(c.target) }, o);
      }
      if (!c.target) return m.claim_outnumbered_square({ square: c.square, ...counts }, o);
      return c.side === "yours"
        ? m.claim_outnumbered_yours({ piece: piece(c.target), ...counts }, o)
        : m.claim_outnumbered_theirs({ piece: piece(c.target), ...counts }, o);
    }
    case "chased":
      return m.claim_chased({ move: c.move, target: piece(c.target) }, o);
    case "gains_time":
      return m.claim_gains_time({ move: c.move, target: piece(c.target) }, o);
    case "one_move_threat":
      return m.claim_one_move_threat({ target: piece(c.target), reply: c.reply }, o);
    case "king_in_centre":
      return m.claim_king_in_centre({ king: c.king }, o);
    case "shelter_weakened":
      return m.claim_shelter_weakened({ pawn: c.pawn }, o);
    case "perpetual":
      return m.claim_perpetual({}, o);
    case "back_rank":
      return m.claim_back_rank({ king: c.king, square: c.square }, o);
    case "passed_pawn":
      return c.side === "theirs"
        ? m.claim_passed_pawn_theirs({ from: c.from, to: c.to }, o)
        : m.claim_passed_pawn_yours({ from: c.from, to: c.to }, o);
    case "rook_seventh":
      return c.side === "theirs"
        ? m.claim_rook_seventh_theirs({ square: c.square }, o)
        : m.claim_rook_seventh_yours({ square: c.square }, o);
    case "pawn_break":
      return m.claim_pawn_break({ move: c.move, target: c.target }, o);
    case "free_capture":
      return m.claim_free_capture({ move: c.move, took: piece(c.took) }, o);
    case "gave_up_king_defender":
      return m.claim_gave_up_king_defender({ piece: piece(c.piece) }, o);
    case "double_attack":
      return m.claim_double_attack({ move: c.move, targets: list(c.targets.map(piece), locale) }, o);
    case "pawn_grab":
      return m.claim_pawn_grab({ square: c.square }, o);
    case "neglected_development":
      return m.claim_neglected_development({ pawn: c.pawn, count: c.undeveloped }, o);
  }
}
