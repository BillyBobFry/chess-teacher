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

  const send = (r: 1 | -1, text?: string) => {
    setRating(r);
    void api.feedback(gameId, lessonId, { rating: r, ...(text ? { comment: text } : {}) }).catch(() => {});
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
