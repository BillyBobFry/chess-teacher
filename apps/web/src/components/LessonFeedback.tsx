import type { FeedbackBody } from "@chess-teacher/contract";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/client.ts";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";
import { TextField } from "../ui/TextField.tsx";
import { ToggleButton } from "../ui/ToggleButton.tsx";

/** "Did this make sense?" A thumbs up or down, with an optional comment on a thumbs down. */
export function LessonFeedback({ gameId, lessonId }: { gameId: string; lessonId: number }) {
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const feedback = useMutation({ mutationFn: (body: FeedbackBody) => api.feedback(gameId, lessonId, body) });

  const send = (r: 1 | -1, text?: string) => {
    setRating(r);
    // Feedback is best effort: a lost rating isn't worth interrupting the lesson for.
    feedback.mutate({ rating: r, ...(text ? { comment: text } : {}) });
    if (r === 1 || text !== undefined) setSent(true);
  };

  if (sent) return <p className="feedback-thanks muted small">{m.feedback_thanks()}</p>;
  return (
    <div className="feedback">
      <span className="small">{m.feedback_question()}</span>
      <ToggleButton isSelected={rating === 1} aria-label={m.feedback_yes()} onChange={() => send(1)}>
        👍
      </ToggleButton>
      <ToggleButton isSelected={rating === -1} aria-label={m.feedback_no()} onChange={() => send(-1)}>
        👎
      </ToggleButton>
      {rating === -1 && (
        <form
          className="feedback-comment"
          onSubmit={(e) => {
            e.preventDefault();
            send(-1, comment.trim());
          }}
        >
          <TextField
            className="min-w-0 flex-1"
            value={comment}
            onChange={setComment}
            placeholder={m.feedback_comment_placeholder()}
            maxLength={1000}
            aria-label={m.feedback_comment_label()}
          />
          <Button type="submit">{m.feedback_send()}</Button>
        </form>
      )}
    </div>
  );
}
