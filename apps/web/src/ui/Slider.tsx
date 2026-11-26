import { useId } from "react";
import { Label, Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";

/**
 * A number picked from a range by dragging, clicking the track, or the arrow keys (Page Up and
 * Down for bigger steps, Home and End for the ends). The value shows beside the label,
 * formatted for the locale (UX-33). `description` sits under the track and is read out with
 * the value, so it can say what the value means as it changes.
 */
export function Slider({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  step,
  formatOptions,
  description,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue: number;
  maxValue: number;
  step: number;
  /** How the value is written, for the player's locale (UX-33). */
  formatOptions: Intl.NumberFormatOptions;
  description: string;
  /** Placement only. */
  className?: string;
}) {
  const descriptionId = useId();
  return (
    <AriaSlider
      value={value}
      onChange={onChange}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      formatOptions={formatOptions}
      className={["grid max-w-md gap-1", className].filter(Boolean).join(" ")}
    >
      <div className="flex items-baseline justify-between gap-4">
        <Label className="font-semibold text-fg">{label}</Label>
        <SliderOutput className="text-lg font-semibold text-fg tabular-nums" />
      </div>
      {/* The whole 44px-high strip takes presses (UX-23); the visible track is a 4px line in it. */}
      <SliderTrack className="group relative h-11 w-full cursor-pointer touch-none">
        {({ state }) => (
          <>
            {/* fg-muted keeps the track at 3:1 or more against the surface, in light and dark. */}
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-fg-muted" />
            <div
              className="absolute start-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <SliderThumb
              aria-describedby={descriptionId}
              className={[
                // React Aria places the thumb with an inline transform, so centre it with a margin.
                "top-1/2 -mt-3 size-6 rounded-full border-2 border-surface bg-primary shadow-panel",
                "transition-[background-color] duration-150 ease-settle motion-reduce:transition-none",
                "data-hovered:bg-primary-hover data-dragging:bg-primary-pressed",
                "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-primary",
              ].join(" ")}
            />
          </>
        )}
      </SliderTrack>
      <p id={descriptionId} className="m-0 text-fg-muted">
        {description}
      </p>
    </AriaSlider>
  );
}
