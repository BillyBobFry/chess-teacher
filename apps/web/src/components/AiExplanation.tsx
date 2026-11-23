import type { ExplanationResponse } from "@chess-teacher/contract";
import { useEffect, useState } from "react";

/**
 * The AI coach's explanation, shown above the measured facts when available. If it isn't
 * (no API key, allowance used up, still writing, or rejected by the guardrail), the
 * facts-based explanation below it stands on its own.
 */
export function AiExplanation({
  load,
}: {
  load: (signal: AbortSignal) => Promise<ExplanationResponse | null>;
}) {
  const [result, setResult] = useState<ExplanationResponse | null | "loading">("loading");

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then((r) => {
      if (!controller.signal.aborted) setResult(r);
    });
    return () => controller.abort();
  }, [load]);

  if (result === "loading") {
    return <p className="ai-note muted">Your coach is writing an explanation…</p>;
  }
  if (!result) return null;
  if (result.status === "ready" && result.text) {
    return (
      <div className="ai">
        <div className="ai-label">Your coach</div>
        <p>{result.text}</p>
        <div className="ai-foot muted">
          Written by AI from the measured facts below · {result.remaining} AI explanations left this month
        </div>
      </div>
    );
  }
  if (result.status === "quota") {
    return (
      <p className="ai-note muted">You've used this month's AI explanations. Here's what we measured:</p>
    );
  }
  return null;
}
