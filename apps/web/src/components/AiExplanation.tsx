import type { ExplanationResponse } from "@chess-teacher/contract";
import { lessonBestSan, type Lesson } from "@chess-teacher/core";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import type { Move } from "chess.js";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { findMove, lessonMoves, lineMoves, splitMoves } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { orientationOf, type Orientation } from "./Board.tsx";
import { MoveButton, moveMarkup } from "./MoveButton.tsx";

interface Known {
  /** Every move in the lines the coach could mention. */
  lines: Move[];
  /** The mistake and the better move. */
  named: Move[];
}

/**
 * Text with chess moves picked out so they're easy to spot. A move that is surely one of
 * `known` previews its board; one we can't place stays text, rather than show a wrong board.
 */
function withMoves(text: string, known: Known, orientation: Orientation): ReactNode[] {
  return splitMoves(text).map((seg, i) => {
    if (!seg.move) return <Fragment key={i}>{seg.text}</Fragment>;
    const move = findMove(seg.text, known.lines, known.named);
    return move ? (
      <MoveButton key={i} move={move} orientation={orientation}>
        {seg.text}
      </MoveButton>
    ) : (
      <span key={i} className="move">
        {seg.text}
      </span>
    );
  });
}

/**
 * The AI coach's explanation, shown above the measured facts when available: a headline
 * and two short paragraphs. If there isn't one (no API key, allowance used up, still being
 * written, or rejected by the guardrail), the facts-based explanation below stands alone.
 */
export function AiExplanation({
  load,
  lesson,
  played,
}: {
  load: (signal: AbortSignal) => Promise<ExplanationResponse | null>;
  lesson: Lesson;
  /** The real moves from the mistake on. */
  played: string[];
}) {
  const [result, setResult] = useState<ExplanationResponse | null | "loading">("loading");
  const orientation = orientationOf(lesson.userColour);
  const { yours, better } = lessonMoves(lesson);
  // The coach writes about the two lines it was given; the real moves may come up too.
  const known: Known = {
    lines: [lesson.userLine, lesson.bestLine, played].flatMap((line) => lineMoves(lesson.fenBefore, line)),
    named: [yours, better].filter((mv) => mv !== undefined),
  };
  const missedChance = lesson.kind === "missed_chance";

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then((r) => {
      if (!controller.signal.aborted) setResult(r);
    });
    return () => controller.abort();
  }, [load]);

  if (result === "loading") return <p className="ai-note muted">{m.ai_writing()}</p>;
  if (!result) return null;
  if (result.status === "quota") {
    return <p className="ai-note muted">{m.ai_quota()}</p>;
  }
  if (result.status !== "ready" || (!result.parts && !result.text)) return null;

  const foot = <div className="ai-foot muted">{m.ai_foot({ remaining: result.remaining })}</div>;
  if (!result.parts) {
    // Explanations stored before they were structured: one paragraph.
    return (
      <div className="ai">
        <div className="ai-label">{m.ai_label()}</div>
        <p>{withMoves(result.text!, known, orientation)}</p>
        {foot}
      </div>
    );
  }
  const { headline, what_it_allowed, why_better } = result.parts;
  return (
    <div className="ai">
      <div className="ai-label">{m.ai_label()}</div>
      <p className="ai-headline">{withMoves(headline, known, orientation)}</p>
      <dl className="ai-parts">
        <dt>{missedChance ? m.ai_what_missed() : m.ai_what_allowed()}</dt>
        <dd>{withMoves(what_it_allowed, known, orientation)}</dd>
        <dt>
          <ParaglideMessage
            message={m.ai_why_better}
            inputs={{ move: lessonBestSan(lesson) }}
            markup={{ move: moveMarkup(better, orientation) }}
          />
        </dt>
        <dd>{withMoves(why_better, known, orientation)}</dd>
      </dl>
      {foot}
    </div>
  );
}
