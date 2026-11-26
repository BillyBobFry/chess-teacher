import type { ReactNode } from "react";
import { GridList, GridListItem, type Key } from "react-aria-components";
import { pressable } from "./Button.tsx";

/**
 * A list whose rows each open a page (a saved game, say). The whole row is the link; arrow
 * keys move between rows and Enter opens one.
 */
export function ActionList({
  label,
  children,
  className,
}: {
  /** The list's accessible name. */
  label: string;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  return (
    <GridList aria-label={label} className={`border-t border-border ${className ?? ""}`}>
      {children}
    </GridList>
  );
}

/** One row of an `ActionList`, opening `href`. `textValue` is what a screen reader reads for it. */
export function ActionListItem({
  id,
  href,
  textValue,
  children,
}: {
  id: Key;
  href: string;
  textValue: string;
  children: ReactNode;
}) {
  return (
    <GridListItem
      id={id}
      href={href}
      textValue={textValue}
      className={[
        "block min-h-11 border-b border-border px-1 py-2.5 text-fg",
        ...pressable,
        // UX-8: a neutral step on hover; UX-46: one more when pressed.
        "data-hovered:bg-surface-muted data-pressed:bg-border data-focus-visible:-outline-offset-2",
      ].join(" ")}
    >
      {children}
    </GridListItem>
  );
}
