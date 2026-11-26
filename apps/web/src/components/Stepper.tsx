import { useLayoutEffect, useRef } from "react";
import { m } from "../paraglide/messages.js";
import { Button } from "../ui/Button.tsx";

type Target = "start" | "back" | "forward" | "end";

/**
 * Start, back, forward and end through a line of moves, with where it is between them. Used
 * for every line the player steps through, so they all look and work alike (UX-58).
 */
export function Stepper({
  label,
  step,
  total,
  position,
  onStep,
  shortcuts,
}: {
  /** The group's accessible name: what is being stepped through. */
  label: string;
  /** Moves played: 0 is before the first. */
  step: number;
  total: number;
  /** Where it is, in words ("12… Nf6"). */
  position: string;
  onStep: (step: number) => void;
  /** The arrow keys, Home and End also step (the caller listens for them). */
  shortcuts: boolean;
}) {
  const group = useRef<HTMLDivElement>(null);
  // A button that reaches the end it points at is disabled, and a disabled button drops focus
  // to the page. Move it to the nearest button that still goes somewhere instead, whether it
  // was pressed or a key stepped while focus was on it.
  const pressed = useRef<Target | null>(null);
  useLayoutEffect(() => {
    const active = document.activeElement;
    const focused =
      active instanceof HTMLElement && group.current?.contains(active) ? active.dataset.target : null;
    const from = pressed.current ?? focused;
    pressed.current = null;
    const backwards = from === "start" || from === "back";
    const stuck = backwards ? step === 0 : (from === "forward" || from === "end") && step === total;
    if (stuck)
      group.current?.querySelector<HTMLElement>(`[data-target="${backwards ? "forward" : "back"}"]`)?.focus();
  }, [step, total]);

  const button = (target: Target, to: number, glyph: string, name: string, keys: string) => (
    <Button
      data-target={target}
      onPress={() => {
        pressed.current = target;
        onStep(to);
      }}
      isDisabled={target === "start" || target === "back" ? step === 0 : step === total}
      aria-label={name}
      aria-keyshortcuts={shortcuts ? keys : undefined}
    >
      {glyph}
    </Button>
  );

  return (
    <div ref={group} className="flex items-center justify-center gap-1" role="group" aria-label={label}>
      {button("start", 0, "⏮", m.stepper_start(), "Home")}
      {button("back", Math.max(0, step - 1), "◀", m.stepper_back(), "ArrowLeft")}
      {/* A fixed width, so the buttons hold still as the label changes (UX-52). */}
      <span className="min-w-28 text-center text-sm text-fg-muted tabular-nums">{position}</span>
      {button("forward", Math.min(total, step + 1), "▶", m.stepper_forward(), "ArrowRight")}
      {button("end", total, "⏭", m.stepper_end(), "End")}
    </div>
  );
}
