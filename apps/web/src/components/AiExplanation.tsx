import type { ExplanationResponse } from "@chess-teacher/contract";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { splitMoves } from "../lib/moves.ts";

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

  if (result === "loading") return <p className="ai-note muted">Your coach is writing an explanation…</p>;
  if (!result) return null;
  if (result.status === "quota") {
    return (
      <p className="ai-note muted">You've used this month's AI explanations. Here's what we measured:</p>
    );
  }
  if (result.status !== "ready" || (!result.parts && !result.text)) return null;

  const foot = (
    <div className="ai-foot muted">
      Written by AI from the measured facts below · {result.remaining} AI explanations left this month
    </div>
  );
  if (!result.parts) {
    // Explanations stored before they were structured: one paragraph.
    return (
      <div className="ai">
        <div className="ai-label">Your coach</div>
        <p>{withMoves(result.text!)}</p>
        {foot}
      </div>
    );
  }
  const { headline, what_it_allowed, why_better } = result.parts;
  return (
    <div className="ai">
      <div className="ai-label">Your coach</div>
      <p className="ai-headline">{withMoves(headline)}</p>
      <dl className="ai-parts">
        <dt>{missedChance ? "What it missed" : "What it allowed"}</dt>
        <dd>{withMoves(what_it_allowed)}</dd>
        <dt>Why {withMoves(betterMove)} was better</dt>
        <dd>{withMoves(why_better)}</dd>
      </dl>
      {foot}
    </div>
  );
}
