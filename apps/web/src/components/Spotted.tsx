import { lessonBestSan, lessonLabel, type Lesson } from "@chess-teacher/core";
import type { ExplanationResponse } from "@chess-teacher/contract";
import { AiExplanation } from "./AiExplanation.tsx";
import { Explanation } from "./Explanation.tsx";
import { Futures } from "./Futures.tsx";

interface Props {
  lesson: Lesson;
  /** False while the opponent is thinking: peeking then would race the game loop. */
  canPeek: boolean;
  loadExplanation: (signal: AbortSignal) => Promise<ExplanationResponse | null>;
  onPeek: () => void;
}

/**
 * Easy mode: "Your opponent has spotted something…", and on request, what it is: the
 * coach's explanation of the lesson (written when the lesson was created, so asking costs
 * nothing extra) and the engine's prediction of how the opponent could punish it.
 */
export function Spotted({ lesson, canPeek, loadExplanation, onPeek }: Props) {
  if (!lesson.peeked) {
    return (
      <section className="spotted">
        <p className="spotted-title">
          <span aria-hidden>👀</span> Your opponent has spotted something…
        </p>
        <p className="muted small">Can you find it and deal with it before it costs you?</p>
        <button onClick={onPeek} disabled={!canPeek}>
          What have they spotted?
        </button>
      </section>
    );
  }
  return (
    <details className="spotted" open>
      <summary className="spotted-title">
        <span aria-hidden>👀</span> What your opponent spotted
      </summary>
      <p className="muted small">
        It goes back to {lessonLabel(lesson)}. There may still be time to deal with it.
      </p>
      <AiExplanation load={loadExplanation} betterMove={lessonBestSan(lesson)} missedChance={false} />
      <Explanation lesson={lesson} />
      <Futures lesson={lesson} />
    </details>
  );
}
