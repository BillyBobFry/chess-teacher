import {
  diagnosisFacts,
  facts,
  lessonBestSan,
  lessonMoveNumber,
  lessonUserSan,
  type ConceptId,
  type DiagnosedLesson,
  type FeatureLesson,
  type Lesson,
} from "@chess-teacher/core";
import {
  claimText,
  conceptText,
  conceptTitle,
  detailText,
  factorText,
  listText,
  principleText,
  principleTitle,
  undefendedText,
} from "@chess-teacher/lesson-text";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { lessonMoves } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { orientationOf } from "./Board.tsx";
import { moveMarkup } from "./MoveButton.tsx";
import { MoveText, knownMoves } from "./MoveText.tsx";

/**
 * The lesson's explanation, built from the same verified facts the coach receives.
 * `coachConcept` is the concept the AI coach chose for a diagnosed lesson, which the
 * concept card shows instead of the recipes' choice (null: none, or not written yet).
 */
export function Explanation({ lesson, coachConcept }: { lesson: Lesson; coachConcept: ConceptId | null }) {
  return lesson.source === "features" ? (
    <FeatureExplanation lesson={lesson} />
  ) : (
    <DiagnosisExplanation lesson={lesson} concept={coachConcept ?? lesson.concept} />
  );
}

/** The lead sentence: the move played and the better move, each previewing its board. */
function Lead({ lesson }: { lesson: Lesson }) {
  const orientation = orientationOf(lesson.userColour);
  const { yours, better } = lessonMoves(lesson);
  return (
    <p className="lead">
      <ParaglideMessage
        message={m.explanation_lead}
        inputs={{
          moveNumber: lessonMoveNumber(lesson),
          played: lessonUserSan(lesson),
          better: lessonBestSan(lesson),
        }}
        markup={{
          played: (props) => <strong>{moveMarkup(yours, orientation)(props)}</strong>,
          better: (props) => <strong>{moveMarkup(better, orientation)(props)}</strong>,
        }}
      />
    </p>
  );
}

function DiagnosisExplanation({ lesson, concept }: { lesson: DiagnosedLesson; concept: ConceptId | null }) {
  const f = diagnosisFacts(lesson);
  const locale = getLocale();
  const orientation = orientationOf(lesson.userColour);
  const known = knownMoves(lesson, []);
  return (
    <div className="explanation">
      <Lead lesson={lesson} />
      {f.claims.length > 0 && (
        <>
          <h3 className="mt-4 mb-1 text-sm font-semibold text-fg-muted">{m.explanation_facts()}</h3>
          <ul className="m-0 grid gap-1.5 ps-5">
            {f.claims.map((c, i) => (
              <li key={i}>
                <MoveText text={claimText(c, locale)} known={known} orientation={orientation} />
              </li>
            ))}
          </ul>
        </>
      )}
      {concept && (
        <div className="principle">
          <div className="principle-title">{conceptTitle(concept, locale)}</div>
          <p>{conceptText(concept, locale)}</p>
        </div>
      )}
    </div>
  );
}

function FeatureExplanation({ lesson }: { lesson: FeatureLesson }) {
  const f = facts(lesson);
  const locale = getLocale();
  const mate = lesson.feature === "mate";
  const orientation = orientationOf(lesson.userColour);
  const { better } = lessonMoves(lesson);
  return (
    <div className="explanation">
      <Lead lesson={lesson} />
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
            {lesson.feature === "their_pawns" ? (
              <ParaglideMessage
                message={m.explanation_missed_pawns}
                inputs={{ better: f.better_was }}
                markup={{ better: moveMarkup(better, orientation) }}
              />
            ) : lesson.feature === "material" ? (
              <ParaglideMessage
                message={m.explanation_missed_material}
                inputs={{ better: f.better_was }}
                markup={{ better: moveMarkup(better, orientation) }}
              />
            ) : (
              <ParaglideMessage
                message={m.explanation_missed_improved}
                inputs={{ better: f.better_was, factor: factorText(f.key_factor, locale) }}
                markup={{ better: moveMarkup(better, orientation) }}
              />
            )}
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
