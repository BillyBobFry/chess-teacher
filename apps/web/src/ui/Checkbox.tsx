import type { ReactNode } from "react";
import { Checkbox as AriaCheckbox } from "react-aria-components";

/** An on or off choice that takes effect when the form it's in is used. */
export function Checkbox({
  isSelected,
  onChange,
  children,
  className,
}: {
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  return (
    <AriaCheckbox
      isSelected={isSelected}
      onChange={onChange}
      className={["group flex min-h-11 cursor-pointer items-center gap-2.5 outline-none", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden
        className={[
          "flex size-5 shrink-0 items-center justify-center rounded-inline border-2 border-fg-muted bg-surface",
          "transition-[background-color,border-color] duration-150 ease-settle motion-reduce:transition-none",
          "group-data-hovered:border-fg group-data-pressed:bg-surface-muted",
          "group-data-selected:border-primary group-data-selected:bg-primary",
          "group-data-selected:group-data-pressed:bg-primary-pressed",
          "group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-solid group-data-focus-visible:outline-primary",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 16 16"
          className="hidden size-3.5 fill-none stroke-on-primary stroke-[2.5] group-data-selected:block"
        >
          <path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </AriaCheckbox>
  );
}
