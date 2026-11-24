import type { ExplanationResponse } from "@chess-teacher/contract";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { splitMoves } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";

/** Text with chess moves picked out so they're easy to spot. */
function withMoves(text: string): ReactNode[] {
  return splitMoves(text).map((seg, i) =>
    seg.move ? (
      <span key={i} className="move">
        {seg.text}
      </span>
    ) : (
      <Fragment key={i}>{seg.text}</Fragment>
    ),
  );
}

/**
 * The AI coach's explanation, shown above the measured facts when available: a headline
 * and two short paragraphs. If there isn't one (no API key, allowance used up, still being
 * written, or rejected by the guardrail), the facts-based explanation below stands alone.
 */
export function AiExplanation({
  load,
  betterMove,
  missedChance,
}: {
  load: (signal: AbortSignal) => Promise<ExplanationResponse | null>;
  betterMove: string;
  missedChance: boolean;
}) {
  const [result, setResult] = useState<ExplanationResponse | null | "loading">("loading");

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
        <p>{withMoves(result.text!)}</p>
        {foot}
      </div>
    );
  }
  const { headline, what_it_allowed, why_better } = result.parts;
  return (
    <div className="ai">
      <div className="ai-label">{m.ai_label()}</div>
      <p className="ai-headline">{withMoves(headline)}</p>
      <dl className="ai-parts">
        <dt>{missedChance ? m.ai_what_missed() : m.ai_what_allowed()}</dt>
        <dd>{withMoves(what_it_allowed)}</dd>
        <dt>
          <ParaglideMessage
            message={m.ai_why_better}
            inputs={{ move: betterMove }}
            markup={{ move: ({ children }) => <span className="move">{children}</span> }}
          />
        </dt>
        <dd>{withMoves(why_better)}</dd>
      </dl>
      {foot}
    </div>
  );
}
