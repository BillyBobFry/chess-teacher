import { useState } from "react";
import { api } from "../api/client.ts";

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

  if (sent) return <p className="feedback-thanks muted small">Thanks: that helps us improve the lessons.</p>;
  return (
    <div className="feedback">
      <span className="small">Did this lesson make sense?</span>
      <button
        className={rating === 1 ? "on" : ""}
        aria-pressed={rating === 1}
        aria-label="Yes, it made sense"
        onClick={() => send(1)}
      >
        👍
      </button>
      <button
        className={rating === -1 ? "on" : ""}
        aria-pressed={rating === -1}
        aria-label="No, it didn't make sense"
        onClick={() => send(-1)}
      >
        👎
      </button>
      {rating === -1 && (
        <form
          className="feedback-comment"
          onSubmit={(e) => {
            e.preventDefault();
            send(-1, comment.trim());
          }}
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What didn't make sense? (optional)"
            maxLength={1000}
            aria-label="What didn't make sense?"
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
}
