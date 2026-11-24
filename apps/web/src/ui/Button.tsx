import { useLayoutEffect, useRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 text-center [font:inherit]",
    // UX-25: named properties, settled, and none under reduced motion (UX-26).
    "transition-[background-color,border-color,color] duration-150 ease-settle motion-reduce:transition-none",
    // UX-22: a ring for keyboard focus only.
    "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-primary",
    "data-disabled:cursor-default data-disabled:opacity-50",
  ],
  variants: {
    // UX-46: every hover has a pressed state. React Aria reports no hover from touch (UX-23).
    variant: {
      /** The view's one main action (UX-12). */
      primary: [
        "border-primary bg-primary font-semibold text-on-primary",
        "data-hovered:border-primary-hover data-hovered:bg-primary-hover",
        "data-pressed:border-primary-pressed data-pressed:bg-primary-pressed",
      ],
      secondary: [
        "border-border bg-surface text-fg",
        "data-hovered:border-fg-muted data-pressed:border-fg-muted data-pressed:bg-surface-muted",
      ],
      /** An action that can't be undone, confirmed first (UX-15). */
      critical: [
        "border-critical bg-critical font-semibold text-on-critical",
        "data-hovered:border-critical-hover data-hovered:bg-critical-hover",
        "data-pressed:border-critical-pressed data-pressed:bg-critical-pressed",
      ],
      /** Looks like a link, underlined so it's never colour alone (UX-61). */
      link: [
        "border-0 bg-transparent p-0 text-primary underline underline-offset-2",
        "data-hovered:decoration-2 data-pressed:text-primary-pressed",
      ],
    },
    size: { medium: "", large: "" },
  },
  compoundVariants: [
    // UX-23: 44px targets. A link is text; its target is the line it sits on.
    { variant: ["primary", "secondary", "critical"], class: "min-h-11 min-w-11 rounded-control border" },
    { variant: ["primary", "secondary", "critical"], size: "medium", class: "px-3.5 py-2" },
    { variant: ["primary", "secondary", "critical"], size: "large", class: "px-6 py-3 text-lg" },
  ],
  defaultVariants: { variant: "secondary", size: "medium" },
});

type ButtonProps = Omit<AriaButtonProps, "className"> &
  VariantProps<typeof button> & {
    /** Placement only (margin, width, grid or flex placement); looks come from `variant`. */
    className?: string;
    /** The keyboard shortcuts that also do this, for screen readers ("Control+Z Meta+Z"). */
    "aria-keyshortcuts"?: string;
  };

/** Every button in the app (UX-37). Props are React Aria's: `onPress`, `isDisabled`, `type`. */
export function Button({
  variant,
  size,
  className,
  "aria-keyshortcuts": keyShortcuts,
  ...props
}: ButtonProps) {
  // React Aria doesn't pass aria-keyshortcuts through to the element, so set it here.
  const ref = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (keyShortcuts) ref.current?.setAttribute("aria-keyshortcuts", keyShortcuts);
    else ref.current?.removeAttribute("aria-keyshortcuts");
  }, [keyShortcuts]);

  return <AriaButton {...props} ref={ref} className={button({ variant, size, className })} />;
}
