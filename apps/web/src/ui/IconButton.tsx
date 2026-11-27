import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./Button.tsx";
import { Kbd } from "./Kbd.tsx";
import { Tooltip } from "./Tooltip.tsx";

type IconButtonProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size" | "shape" | "children" | "aria-label" | "aria-labelledby"
> & {
  /** A Lucide icon with one plausible reading, like undo or next (UX-24). */
  icon: LucideIcon;
  /** The accessible name, also the tooltip: what it does, specific on a repeated row (UX-24). */
  label: string;
  /** The keyboard shortcut as the player sees it ("⌘Z"), shown in the tooltip after the label. */
  shortcut?: string;
};

/**
 * A secondary button that shows only an icon. The label is its accessible name and appears as a
 * tooltip on hover or keyboard focus, so the icon must make sense without it (UX-24).
 */
export function IconButton({ icon: Icon, label, shortcut, ...props }: IconButtonProps) {
  return (
    <Tooltip
      content={
        <>
          {label}
          {shortcut && <Kbd aria-hidden>{shortcut}</Kbd>}
        </>
      }
    >
      <Button {...props} shape="square" aria-label={label}>
        <Icon aria-hidden className="size-5 shrink-0" />
      </Button>
    </Tooltip>
  );
}
