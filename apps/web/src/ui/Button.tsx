import { useLayoutEffect, useRef } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

/** Shared with the other pressable primitives (ToggleButton, Disclosure), so they behave alike. */
export const pressable = [
  "cursor-pointer [font:inherit]",
  // UX-25: named properties, settled, and none under reduced motion (UX-26).
  "transition-[background-color,border-color,color] duration-150 ease-settle motion-reduce:transition-none",
  // UX-22: a ring for keyboard focus only.
  "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-primary",
  "data-disabled:cursor-default data-disabled:opacity-50",
];

/** A secondary button's look, for primitives that sit beside buttons. */
export const secondaryLook = [
  "min-h-11 min-w-11 rounded-control border border-border bg-surface text-fg",
  "data-hovered:border-fg-muted data-pressed:border-fg-muted data-pressed:bg-surface-muted",
];

const button = tv({
  base: ["inline-flex items-center justify-center gap-2 text-center", ...pressable],
  variants: {
    // UX-46: every hover has a pressed state. React Aria reports no hover from touch (UX-23).
    variant: {
      /** The view's one main action (UX-12). */
      primary: [
        "border-primary bg-primary font-semibold text-on-primary",
        "data-hovered:border-primary-hover data-hovered:bg-primary-hover",
        "data-pressed:border-primary-pressed data-pressed:bg-primary-pressed",
        // UX-45: a menu's trigger holds its hover look while the menu is open.
        "aria-expanded:border-primary-hover aria-expanded:bg-primary-hover",
      ],
      secondary: secondaryLook,
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
      /**
       * Text inside a sentence that opens something (a move's preview): the text's own colour,
       * with a dotted underline so it reads as pressable (UX-61).
       */
      inline: [
        "-mx-0.5 rounded-inline border-0 bg-transparent px-0.5 text-inherit",
        "underline decoration-fg-muted decoration-dotted underline-offset-[0.2em]",
        "data-hovered:bg-fg/10 data-pressed:bg-fg/15 aria-expanded:bg-fg/10",
      ],
    },
    size: { medium: "", large: "" },
    /** `circle` is for a single glyph or initial, like the account menu's. */
    shape: { rectangle: "", circle: "rounded-full" },
  },
  compoundVariants: [
    // UX-23: 44px targets. A link is text; its target is the line it sits on.
    { variant: ["primary", "critical"], class: "min-h-11 min-w-11 rounded-control border" },
    {
      variant: ["primary", "secondary", "critical"],
      shape: "rectangle",
      size: "medium",
      class: "px-3.5 py-2",
    },
    {
      variant: ["primary", "secondary", "critical"],
      shape: "rectangle",
      size: "large",
      class: "px-6 py-3 text-lg",
    },
    { shape: "circle", class: "size-11 rounded-full p-0" },
  ],
  defaultVariants: { variant: "secondary", size: "medium", shape: "rectangle" },
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
  shape,
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

  return <AriaButton {...props} ref={ref} className={button({ variant, size, shape, className })} />;
}
