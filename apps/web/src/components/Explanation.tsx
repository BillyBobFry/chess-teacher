import { facts, type Lesson } from "@chess-teacher/core";

/** The lesson's explanation, built from the same measured facts an LLM would receive. */
export function Explanation({ lesson }: { lesson: Lesson }) {
  const f = facts(lesson);
  const mate = lesson.feature === "mate";
  return (
    <div className="explanation">
      <p className="lead">
        On move {f.move_number} you played <strong>{f.you_played}</strong>. <strong>{f.better_was}</strong>{" "}
        was better.
      </p>
      {mate ? (
        <p>After your move, your opponent had a forced checkmate.</p>
      ) : lesson.kind === "consequence" ? (
        <dl className="facts">
          <dt>Before your move</dt>
          <dd>{f.before_your_move}</dd>
          <dt>Where your move leads</dt>
          <dd>{f.end_of_your_line}</dd>
          <dt>Where the better move leads</dt>
          <dd>{f.end_of_better_line}</dd>
        </dl>
      ) : (
        <>
          <p>
            Your move wasn't a disaster, but {f.better_was} would have{" "}
            {lesson.feature === "their_pawns"
              ? "left your opponent with pawn weaknesses"
              : `improved ${f.key_factor}`}
            .
          </p>
          <dl className="facts">
            <dt>Where the better move leads</dt>
            <dd>{f.end_of_better_line}</dd>
            <dt>Where your move leads</dt>
            <dd>{f.end_of_your_line}</dd>
          </dl>
        </>
      )}
      {lesson.principle === "hanging" && f.pieces_left_undefended_by_your_move.length > 0 && (
        <p>Your move left this undefended: {f.pieces_left_undefended_by_your_move.join(", ")}.</p>
      )}
      <div className="principle">
        <div className="principle-title">{f.principle.title}</div>
        <p>{f.principle.explanation}</p>
      </div>
    </div>
  );
}
