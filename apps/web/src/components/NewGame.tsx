import { OPPONENT_RATING } from "@chess-teacher/contract";
import { useState } from "react";
import type { NewGameOptions } from "../game/useGame.ts";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";
import { Checkbox } from "../ui/Checkbox.tsx";
import { RadioGroup } from "../ui/RadioGroup.tsx";
import { Slider } from "../ui/Slider.tsx";

/** What an opponent at this rating plays like, in words a new player can judge. */
function playsLike(rating: number): string {
  if (rating < 800) return m.new_game_rating_new();
  if (rating < 1100) return m.new_game_rating_basics();
  if (rating < 1400) return m.new_game_rating_regular();
  if (rating < 1700) return m.new_game_rating_strong();
  return m.new_game_rating_club();
}

export function NewGame({
  onStart,
  busy,
  initialRating,
}: {
  onStart: (o: NewGameOptions) => void;
  busy: boolean;
  /** The rating the player chose last time (UX-18). */
  initialRating: number;
}) {
  const [colour, setColour] = useState<NewGameOptions["colour"]>("w");
  const [rating, setRating] = useState(initialRating);
  const [easy, setEasy] = useState(true);

  return (
    <section className="new-game">
      <h1>{m.new_game_title()}</h1>
      <p className="muted">{m.new_game_intro()}</p>

      <RadioGroup
        className="my-6"
        variant="segmented"
        label={m.new_game_play_as()}
        value={colour}
        onChange={setColour}
        options={[
          { value: "w", label: m.colour_white() },
          { value: "b", label: m.colour_black() },
          { value: "random", label: m.colour_random() },
        ]}
      />

      <Slider
        className="my-6"
        label={m.new_game_rating()}
        value={rating}
        onChange={setRating}
        minValue={OPPONENT_RATING.min}
        maxValue={OPPONENT_RATING.max}
        step={OPPONENT_RATING.step}
        // Ratings are written 1100, never 1,100.
        formatOptions={{ useGrouping: false }}
        description={playsLike(rating)}
      />

      <Checkbox className="mt-4 mb-7" isSelected={easy} onChange={setEasy}>
        {m.new_game_warn()}
      </Checkbox>

      <Button
        variant="primary"
        size="large"
        isDisabled={busy}
        onPress={() => onStart({ colour, opponentRating: rating, easy })}
      >
        {busy ? m.busy_engine() : m.new_game_start()}
      </Button>
    </section>
  );
}
