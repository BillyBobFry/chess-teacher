import type { ExplanationResponse } from "@chess-teacher/contract";
import { isConceptId, lessonBestSan, type ConceptId, type Lesson } from "@chess-teacher/core";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useEffect, useState } from "react";
import { lessonMoves } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { orientationOf } from "./Board.tsx";
import { moveMarkup } from "./MoveButton.tsx";
import { MoveText, knownMoves } from "./MoveText.tsx";

/** The AI explanation as it loads: "loading", then the response (null if there is none). */
export type AiResult = ExplanationResponse | null | "loading";

export function useAiExplanation(
  load: (signal: AbortSignal) => Promise<ExplanationResponse | null>,
): AiResult {
  const [result, setResult] = useState<AiResult>("loading");
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then((r) => {
      if (!controller.signal.aborted) setResult(r);
    });
    return () => controller.abort();
  }, [load]);
  return result;
}

/** The concept the coach chose, once its explanation is ready (null otherwise). */
export function coachConcept(result: AiResult): ConceptId | null {
  if (result === "loading" || result?.status !== "ready") return null;
  const concept = result.parts?.concept;
  return isConceptId(concept) ? concept : null;
}

/**
 * The AI coach's explanation, shown above the measured facts when available: a headline
 * and two short paragraphs. If there isn't one, the facts-based explanation below stands
 * alone, with a note saying why (allowance used up, rejected by the guardrail, failed or
 * too slow); with no LLM on the server, without one.
 */
export function AiExplanation({
  result,
  lesson,
  played,
}: {
  result: AiResult;
  lesson: Lesson;
  /** The real moves from the mistake on. */
  played: string[];
}) {
  const orientation = orientationOf(lesson.userColour);
  const { better } = lessonMoves(lesson);
  // The coach writes about the two lines it was given; the real moves may come up too.
  const known = knownMoves(lesson, [played]);
  const missedChance = lesson.kind === "missed_chance";

  if (result === "loading") return <p className="ai-note muted">{m.ai_writing()}</p>;
  if (!result) return null;
  if (result.status === "quota") {
    return <p className="ai-note muted">{m.ai_quota()}</p>;
  }
  // A coach that tried and didn't manage says so, so the template below isn't mistaken for
  // a lesson the coach never saw. A server without an LLM ("unavailable") says nothing.
  if (result.status === "rejected") return <p className="ai-note muted">{m.ai_rejected()}</p>;
  if (result.status === "pending") return <p className="ai-note muted">{m.ai_slow()}</p>;
  if (result.status === "error" || (result.status === "ready" && !result.parts && !result.text))
    return <p className="ai-note muted">{m.ai_failed()}</p>;
  if (result.status !== "ready") return null;

  const text = (t: string) => <MoveText text={t} known={known} orientation={orientation} />;
  const foot = <div className="ai-foot muted">{m.ai_foot({ remaining: result.coachedGamesRemaining })}</div>;
  if (!result.parts) {
    // Explanations stored before they were structured: one paragraph.
    return (
      <div className="ai">
        <div className="ai-label">{m.ai_label()}</div>
        <p>{text(result.text ?? "")}</p>
        {foot}
      </div>
    );
  }
  const { headline, what_it_allowed, why_better } = result.parts;
  return (
    <div className="ai">
      <div className="ai-label">{m.ai_label()}</div>
      <p className="ai-headline">{text(headline)}</p>
      <dl className="ai-parts">
        <dt>{missedChance ? m.ai_what_missed() : m.ai_what_allowed()}</dt>
        <dd>{text(what_it_allowed)}</dd>
        <dt>
          <ParaglideMessage
            message={m.ai_why_better}
            inputs={{ move: lessonBestSan(lesson) }}
            markup={{ move: moveMarkup(better, orientation) }}
          />
        </dt>
        <dd>{text(why_better)}</dd>
      </dl>
      {foot}
    </div>
  );
}
