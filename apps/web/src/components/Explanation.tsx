import { facts, type Lesson } from "@chess-teacher/core";
import {
  detailText,
  factorText,
  listText,
  principleText,
  principleTitle,
  undefendedText,
} from "@chess-teacher/lesson-text";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";

/** The lesson's explanation, built from the same measured facts an LLM would receive. */
export function Explanation({ lesson }: { lesson: Lesson }) {
  const f = facts(lesson);
  const locale = getLocale();
  const mate = lesson.feature === "mate";
  return (
    <div className="explanation">
      <p className="lead">
        <ParaglideMessage
          message={m.explanation_lead}
          inputs={{ moveNumber: f.move_number, played: f.you_played, better: f.better_was }}
          markup={{ strong: ({ children }) => <strong>{children}</strong> }}
        />
      </p>
      {mate ? (
        <p>{m.explanation_mate()}</p>
      ) : lesson.kind === "consequence" ? (
        <dl className="facts">
          <dt>{m.facts_before()}</dt>
          <dd>{detailText(f.before_your_move, locale)}</dd>
          <dt>{m.facts_your_line()}</dt>
          <dd>{detailText(f.end_of_your_line, locale)}</dd>
          <dt>{m.facts_better_line()}</dt>
          <dd>{detailText(f.end_of_better_line, locale)}</dd>
        </dl>
      ) : (
        <>
          <p>
            {lesson.feature === "their_pawns"
              ? m.explanation_missed_pawns({ better: f.better_was })
              : m.explanation_missed_improved({
                  better: f.better_was,
                  factor: factorText(f.key_factor, locale),
                })}
          </p>
          <dl className="facts">
            <dt>{m.facts_better_line()}</dt>
            <dd>{detailText(f.end_of_better_line, locale)}</dd>
            <dt>{m.facts_your_line()}</dt>
            <dd>{detailText(f.end_of_your_line, locale)}</dd>
          </dl>
        </>
      )}
      {lesson.principle === "hanging" && f.pieces_left_undefended_by_your_move.length > 0 && (
        <p>
          {m.explanation_undefended({
            pieces: listText(
              f.pieces_left_undefended_by_your_move.map((u) => undefendedText(u, locale)),
              locale,
            ),
          })}
        </p>
      )}
      <div className="principle">
        <div className="principle-title">{principleTitle(f.principle, locale)}</div>
        <p>{principleText(f.principle, locale)}</p>
      </div>
    </div>
  );
}
