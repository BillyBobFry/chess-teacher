import type { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  Popover as AriaPopover,
  type DialogTriggerProps,
} from "react-aria-components";

/** The raised panel that popovers and menus share. */
export const floatingPanel =
  "rounded-panel border border-border bg-surface text-fg shadow-panel outline-none max-w-[calc(100vw-2rem)]";

/**
 * Pairs a trigger (a `Button`) with the `Popover` it opens:
 * `<PopoverTrigger><Button>…</Button><Popover label="…">…</Popover></PopoverTrigger>`.
 */
export function PopoverTrigger(props: DialogTriggerProps) {
  return <DialogTrigger {...props} />;
}

/**
 * Extra detail next to what opened it: Esc or a click outside closes it, and focus returns to
 * the trigger. Its content only exists while it is open.
 */
export function Popover({
  label,
  size = "small",
  children,
}: {
  label: string;
  /** `large` fits a board with a full stepper under it. */
  size?: "small" | "large";
  children: ReactNode;
}) {
  const width = size === "large" ? "w-84" : "w-64";
  return (
    <AriaPopover placement="bottom start" offset={4} className={`${floatingPanel} ${width} p-3`}>
      <Dialog aria-label={label} className="outline-none">
        {children}
      </Dialog>
    </AriaPopover>
  );
}
