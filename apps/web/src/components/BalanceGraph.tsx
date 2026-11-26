import { MISSED_CHANCE, STANDARD_START, plyOf, type SessionState } from "@chess-teacher/core";
import { useMemo } from "react";
import type { Replay } from "../game/useReplay.ts";
import { balanceHeight, balanceText } from "../lib/balance.ts";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";
import { Popover, PopoverTrigger } from "../ui/Popover.tsx";
import { Scrubber } from "../ui/Scrubber.tsx";
import { moveTitle } from "./MoveButton.tsx";

/**
 * The engine's evaluation after every move of the line on the board, as a graph the replay can be
 * moved along: the player's share is filled, from the line down, so past the middle they're ahead. Each lesson is marked where its mistake was played (a dot), and, where it cost
 * the player, shaded from there to the move it cost them (a ring): the evaluation usually drops
 * at the mistake, not when the cost shows on the board.
 */
export function BalanceGraph({ state, replay }: { state: SessionState; replay: Replay }) {
  const total = replay.moves.length;

  // The balance at each step: before any move (even, from the standard start), then after each.
  const values = useMemo(
    () =>
      Array.from({ length: total + 1 }, (_, k) =>
        k === 0 ? (state.startFen === STANDARD_START ? 0 : null) : (replay.scores[k - 1] ?? null),
      ),
    [total, state.startFen, replay.scores],
  );
  // Heights in the SVG's own units: 0 at the top, 2 at the bottom, 1 the even line.
  const heights = useMemo(() => values.map((v) => (v === null ? null : 1 - balanceHeight(v))), [values]);
  const y = (k: number) => heights[k] ?? null;

  const paths = useMemo(() => {
    let line = "";
    let area = "";
    let run: [number, number][] = [];
    const close = () => {
      const [first] = run;
      const last = run.at(-1);
      if (first && last) {
        // Down to the bottom: the player's share of the strip, which grows as they get ahead.
        area += `M${first[0]} 2 ${run.map(([x, h]) => `L${x} ${h}`).join(" ")} L${last[0]} 2 Z `;
        line += `M${run.map(([x, h]) => `${x} ${h}`).join(" L")} `;
      }
      run = [];
    };
    heights.forEach((h, k) => {
      if (h === null) close();
      else run.push([k, h]);
    });
    close();
    return { line, area };
  }, [heights]);

  const start = plyOf(state.startFen);
  // `at` is the step before the mistake, `mistake` the step after it, `cost` the step after the
  // move it cost the player (none if it never did).
  const lessons = replay.lessons.map(({ lesson, at }) => ({
    id: lesson.id,
    chance: lesson.kind === MISSED_CHANCE,
    at,
    mistake: at + 1,
    cost: lesson.status === "triggered" && lesson.resolvedPly !== null ? lesson.resolvedPly - start : null,
  }));
  const pct = (k: number) => `${(k / Math.max(total, 1)) * 100}%`;
  const top = (k: number) => `${((y(k) ?? 1) / 2) * 100}%`;

  const step = replay.step;
  const last = replay.moves[step - 1];
  const here = balanceText(values[step] ?? null);

  return (
    <div className="grid gap-1">
      {/* The value says what the graph is (UX-48); what it means is a press away, so the board
          keeps its room. */}
      <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-semibold">{here}</span>
        <PopoverTrigger>
          <Button variant="link">{m.balance_about()}</Button>
          <Popover label={m.balance_label()}>
            <p className="m-0 mb-1 font-semibold">{m.balance_label()}</p>
            <p className="m-0 text-sm">{m.balance_note()}</p>
          </Popover>
        </PopoverTrigger>
      </p>
      <Scrubber
        label={m.balance_scrubber()}
        value={step}
        maxValue={total}
        onChange={replay.go}
        valueText={m.balance_position({ move: last ? moveTitle(last) : m.replay_start(), balance: here })}
      >
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-inline border border-border">
          <svg className="block size-full" viewBox={`0 0 ${Math.max(total, 1)} 2`} preserveAspectRatio="none">
            {lessons.map((l) =>
              l.cost === null ? null : (
                <rect
                  key={l.id}
                  x={l.at}
                  y={0}
                  width={Math.max(l.cost - l.at, 0)}
                  height={2}
                  className={l.chance ? "fill-chance-subtle" : "fill-warning-subtle"}
                />
              ),
            )}
            <path d={paths.area} className="fill-fg/15" />
            {/* Even: over the fill, so it shows on both sides of it. */}
            <line
              x1={0}
              x2={Math.max(total, 1)}
              y1={1}
              y2={1}
              className="stroke-fg-muted/50"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={paths.line}
              className="fill-none stroke-fg-muted"
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Dots in HTML, so they stay round however the graph is stretched. A shape for each,
              not just a colour (UX-36): a dot for the mistake, a ring for what it cost. */}
          {lessons.map((l) => (
            <span key={l.id}>
              <span
                className={`absolute size-2 -translate-1/2 rounded-full ${l.chance ? "bg-chance" : "bg-warning"}`}
                style={{ left: pct(l.mistake), top: top(l.mistake) }}
              />
              {l.cost !== null && (
                <span
                  className={`absolute size-2.5 -translate-1/2 rounded-full border-2 ${l.chance ? "border-chance" : "border-warning"}`}
                  style={{ left: pct(l.cost), top: top(l.cost) }}
                />
              )}
            </span>
          ))}
        </div>
      </Scrubber>
    </div>
  );
}
