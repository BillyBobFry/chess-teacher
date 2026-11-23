import { useState } from "react";
import type { NewGameOptions } from "../game/useGame.ts";
import { m } from "../paraglide/messages.js";

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

      <fieldset>
        <legend>{m.new_game_play_as()}</legend>
        <div className="segmented">
          {(
            [
              ["w", m.colour_white],
              ["b", m.colour_black],
              ["random", m.colour_random],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={colour === v ? "on" : ""}>
              <input
                type="radio"
                name="colour"
                value={v}
                checked={colour === v}
                onChange={() => setColour(v)}
              />
              {label()}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{m.new_game_opponent()}</legend>
        <div className="options">
          {STRENGTHS.map((s) => (
            <label key={s.skill} className={skill === s.skill ? "option on" : "option"}>
              <input
                type="radio"
                name="skill"
                checked={skill === s.skill}
                onChange={() => setSkill(s.skill)}
              />
              <strong>{s.label()}</strong> <span className="muted">{s.note()}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="toggle">
        <input type="checkbox" checked={easy} onChange={(e) => setEasy(e.target.checked)} />
        {m.new_game_warn()}
      </label>

      <button
        className="primary big"
        disabled={busy}
        onClick={() => onStart({ colour, opponentSkill: skill, easy })}
      >
        {busy ? m.busy_engine() : m.new_game_start()}
      </button>
    </section>
  );
}
