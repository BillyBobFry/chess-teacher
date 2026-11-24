import { useState } from "react";
import type { NewGameOptions } from "../game/useGame.ts";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";
import { Checkbox } from "../ui/Checkbox.tsx";
import { RadioGroup } from "../ui/RadioGroup.tsx";

const STRENGTHS = [
  { skill: 0, label: m.strength_gentle, note: m.strength_gentle_note },
  { skill: 3, label: m.strength_steady, note: m.strength_steady_note },
  { skill: 6, label: m.strength_testing, note: m.strength_testing_note },
];

export function NewGame({ onStart, busy }: { onStart: (o: NewGameOptions) => void; busy: boolean }) {
  const [colour, setColour] = useState<NewGameOptions["colour"]>("w");
  const [skill, setSkill] = useState(3);
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

      <RadioGroup
        className="my-6"
        variant="cards"
        label={m.new_game_opponent()}
        value={String(skill)}
        onChange={(v) => setSkill(Number(v))}
        options={STRENGTHS.map((s) => ({ value: String(s.skill), label: s.label(), description: s.note() }))}
      />

      <Checkbox className="mt-4 mb-7" isSelected={easy} onChange={setEasy}>
        {m.new_game_warn()}
      </Checkbox>

      <Button
        variant="primary"
        size="large"
        isDisabled={busy}
        onPress={() => onStart({ colour, opponentSkill: skill, easy })}
      >
        {busy ? m.busy_engine() : m.new_game_start()}
      </Button>
    </section>
  );
}
