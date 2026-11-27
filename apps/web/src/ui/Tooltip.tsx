import type { ReactNode } from "react";
import { Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { floatingPanel } from "./Popover.tsx";

/**
 * A short line about a control, shown on hover or keyboard focus and closed with Esc. Touch
 * never shows it (UX-23), so it may only repeat or add to what the control already says: an
 * icon button's name, its shortcut. `children` is the control, a `Button` or `IconButton`.
 */
export function Tooltip({ content, children }: { content: ReactNode; children: ReactNode }) {
  return (
    <AriaTooltipTrigger delay={600} closeDelay={200}>
      {children}
      {/* Utility chrome: no entrance (UX-25). */}
      <AriaTooltip
        placement="top"
        offset={6}
        className={`${floatingPanel} flex items-center gap-2 px-2 py-1 text-sm whitespace-nowrap`}
      >
        {content}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}
