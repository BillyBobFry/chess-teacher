import type { ReactNode } from "react";
import { Keyboard } from "react-aria-components";

/** A key to press, like ⌘Z or Enter. */
export function Kbd({
  children,
  "aria-hidden": ariaHidden,
}: {
  children?: ReactNode;
  "aria-hidden"?: boolean;
}) {
  return (
    <Keyboard
      aria-hidden={ariaHidden}
      className="rounded-inline border border-b-2 border-border bg-surface-muted px-[0.3em] font-sans text-[0.85em] whitespace-nowrap text-fg"
    >
      {children}
    </Keyboard>
  );
}
