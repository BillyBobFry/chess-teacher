import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Slider as AriaSlider, SliderThumb, SliderTrack } from "react-aria-components";

/**
 * A place along a sequence (a move in a game), picked by pressing or dragging along a picture of
 * it (`children`, drawn to fill the strip), or with the arrow keys, Page Up and Down, Home and
 * End. The thumb is a line across the picture. `valueText` reads the place out in words, where a
 * bare number would mean nothing.
 */
export function Scrubber({
  label,
  value,
  maxValue,
  onChange,
  valueText,
  children,
  className,
}: {
  label: string;
  /** From 0 to `maxValue`, in steps of 1. */
  value: number;
  maxValue: number;
  onChange: (value: number) => void;
  valueText: string;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  // React Aria words the value with a number format; ours is a sentence. It sets its own on
  // every render, so set ours after every render too.
  const input = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    input.current?.setAttribute("aria-valuetext", valueText);
  });
  return (
    <AriaSlider
      aria-label={label}
      value={value}
      onChange={onChange}
      minValue={0}
      maxValue={maxValue}
      step={1}
      className={className}
    >
      {/* The whole strip takes presses and drags, and is at least 44px high (UX-23). */}
      <SliderTrack className="relative h-11 w-full cursor-pointer touch-none">
        {children}
        <SliderThumb
          inputRef={input}
          className={[
            // React Aria places the thumb with `left`, and centres it both ways with a transform.
            "top-1/2 h-full w-0.5 bg-primary",
            "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-primary",
          ].join(" ")}
        />
      </SliderTrack>
    </AriaSlider>
  );
}
