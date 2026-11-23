import { useState } from "react";
import type { NewGameOptions } from "../game/useGame.ts";

const STRENGTHS = [
  { skill: 0, label: "Gentle", note: "for new players" },
  { skill: 3, label: "Steady", note: "a fair fight for improving players" },
  { skill: 6, label: "Testing", note: "for players who know the basics well" },
];

export function NewGame({ onStart, busy }: { onStart: (o: NewGameOptions) => void; busy: boolean }) {
  const [colour, setColour] = useState<NewGameOptions["colour"]>("w");
  const [skill, setSkill] = useState(3);
  const [easy, setEasy] = useState(true);

  return (
    <section className="new-game">
      <h1>Learn from your own mistakes</h1>
      <p className="muted">
        Play a game. When a mistake comes back to bite you, the game pauses and you work out which move caused
        it, then see what would have happened with the better move.
      </p>

      <fieldset>
        <legend>Play as</legend>
        <div className="segmented">
          {(
            [
              ["w", "White"],
              ["b", "Black"],
              ["random", "Random"],
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
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Opponent</legend>
        <div className="options">
          {STRENGTHS.map((s) => (
            <label key={s.skill} className={skill === s.skill ? "option on" : "option"}>
              <input
                type="radio"
                name="skill"
                checked={skill === s.skill}
                onChange={() => setSkill(s.skill)}
              />
              <strong>{s.label}</strong> <span className="muted">{s.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="toggle">
        <input type="checkbox" checked={easy} onChange={(e) => setEasy(e.target.checked)} />
        Warn me when my opponent spots a weakness
      </label>

      <button
        className="primary big"
        disabled={busy}
        onClick={() => onStart({ colour, opponentSkill: skill, easy })}
      >
        {busy ? "Starting the engine…" : "Start game"}
      </button>
    </section>
  );
}
