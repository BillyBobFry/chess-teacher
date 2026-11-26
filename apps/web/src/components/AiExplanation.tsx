import type { ExplanationResponse } from "@chess-teacher/contract";
import { isConceptId, lessonBestSan, type ConceptId, type Lesson } from "@chess-teacher/core";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { errorText } from "../api/errors.ts";
import { ExplanationFailed, type ExplanationQuery } from "../api/queries.ts";
import { lessonMoves } from "../lib/moves.ts";
import { m } from "../paraglide/messages.js";
import { Alert } from "../ui/Alert.tsx";
import { Button } from "../ui/Button.tsx";
import { Skeleton, SkeletonLine } from "../ui/Skeleton.tsx";
import { orientationOf } from "./Board.tsx";
import { Explanation } from "./Explanation.tsx";
import { moveMarkup } from "./MoveButton.tsx";
import { MoveText, knownMoves } from "./MoveText.tsx";

interface Props {
  /** The coach's explanation to load; null when the server has no coach. */
  explanation: ExplanationQuery | null;
  lesson: Lesson;
  /** The real moves from the mistake on. */
  played: string[];
}

/**
 * A lesson's explanation: the coach's, above the measured facts. While the coach writes, a
 * skeleton holds its place and the facts wait, so the player reads the coach first. If it
 * fails after the retries, the player can try again or read the facts without it. The facts
 * stand alone only as a last resort: no coach on the server, the allowance used up, or a
 * lesson the coach has failed on too often.
 */
export function LessonExplanation({ explanation, lesson, played }: Props) {
  if (!explanation) return <Explanation lesson={lesson} coachConcept={null} />;
  return <CoachedExplanation explanation={explanation} lesson={lesson} played={played} />;
}

function CoachedExplanation({ explanation, lesson, played }: Props & { explanation: ExplanationQuery }) {
  const query = useQuery(explanation);
  const [withoutCoach, setWithoutCoach] = useState(false);

  if (query.data !== undefined) {
    return (
      <>
        <AiExplanation result={query.data} lesson={lesson} played={played} />
        <Explanation lesson={lesson} coachConcept={coachConcept(query.data)} />
      </>
    );
  }
  // Retries, automatic or asked for, show the skeleton again rather than the failure.
  const failed = query.isError && !query.isFetching;
  return (
    <>
      {failed ? (
        <Alert className="mb-3">
          {query.error instanceof ExplanationFailed ? m.ai_error() : errorText(query.error)}
          <span className="mt-2 flex flex-wrap items-center gap-3">
            <Button onPress={() => void query.refetch()}>{m.ai_retry()}</Button>
            {!withoutCoach && (
              <Button variant="link" onPress={() => setWithoutCoach(true)}>
                {m.ai_show_facts()}
              </Button>
            )}
          </span>
        </Alert>
      ) : (
        <CoachSkeleton />
      )}
      {withoutCoach && <Explanation lesson={lesson} coachConcept={null} />}
    </>
  );
}

/** The coach's box, the shape of the explanation it's writing (UX-27). */
function CoachSkeleton() {
  return (
    <CoachBox>
      <Skeleton label={m.ai_writing()}>
        <SkeletonLine className="mt-1 h-5 w-4/5" />
        <SkeletonLine className="mt-2 h-3 w-1/4" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-2/3" />
        <SkeletonLine className="mt-2 h-3 w-1/3" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-3/5" />
        <SkeletonLine className="mt-2 h-3 w-1/2" />
      </Skeleton>
    </CoachBox>
  );
}

function CoachBox({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 rounded-control border border-primary bg-success-subtle px-3.5 py-3">
      <div className="text-sm font-bold text-success">{m.ai_label()}</div>
      {children}
    </div>
  );
}

/** The concept the coach chose, once its explanation is ready (null otherwise). */
function coachConcept(result: ExplanationResponse | null): ConceptId | null {
  if (result?.status !== "ready") return null;
  const concept = result.parts?.concept;
  return isConceptId(concept) ? concept : null;
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-0 mb-3 text-xs text-fg-muted">{children}</p>
);

/**
 * The coach's explanation: a headline and two short paragraphs. If there isn't one, a note says
 * why (allowance used up, or the coach failed too often) above the facts; with no coach on the
 * server, or for a lesson that was never revealed, nothing.
 */
function AiExplanation({
  result,
  lesson,
  played,
}: { result: ExplanationResponse | null } & Omit<Props, "explanation">) {
  const orientation = orientationOf(lesson.userColour);
  const { better } = lessonMoves(lesson);
  // The coach writes about the two lines it was given; the real moves may come up too.
  const known = knownMoves(lesson, [played]);
  const missedChance = lesson.kind === "missed_chance";

  if (!result) return null;
  if (result.status === "quota") return <Note>{m.ai_quota()}</Note>;
  // A coach that tried and didn't manage says so, so the facts aren't mistaken for a lesson the
  // coach never saw. A server without an LLM ("unavailable") says nothing.
  if (result.status === "rejected") return <Note>{m.ai_rejected()}</Note>;
  if (result.status === "error" || (result.status === "ready" && !result.parts && !result.text))
    return <Note>{m.ai_failed()}</Note>;
  if (result.status !== "ready") return null;

  const text = (t: string) => <MoveText text={t} known={known} orientation={orientation} />;
  const foot = (
    <div className="text-xs text-fg-muted">{m.ai_foot({ remaining: result.coachedGamesRemaining })}</div>
  );
  if (!result.parts) {
    // Explanations stored before they were structured: one paragraph.
    return (
      <CoachBox>
        <p className="mt-1 mb-2">{text(result.text ?? "")}</p>
        {foot}
      </CoachBox>
    );
  }
  const { headline, what_it_allowed, why_better } = result.parts;
  return (
    <CoachBox>
      <p className="mt-1 mb-2 text-[1.05rem] font-bold">{text(headline)}</p>
      <dl className="mt-0 mb-2">
        <dt className="mt-2 text-xs font-bold text-fg-muted">
          {missedChance ? m.ai_what_missed() : m.ai_what_allowed()}
        </dt>
        <dd className="m-0 mt-0.5">{text(what_it_allowed)}</dd>
        <dt className="mt-2 text-xs font-bold text-fg-muted">
          <ParaglideMessage
            message={m.ai_why_better}
            inputs={{ move: lessonBestSan(lesson) }}
            markup={{ move: moveMarkup(better, orientation) }}
          />
        </dt>
        <dd className="m-0 mt-0.5">{text(why_better)}</dd>
      </dl>
      {foot}
    </CoachBox>
  );
}
