import type { ReactNode } from "react";
import { GridList, GridListItem, type Key } from "react-aria-components";
import { pressable } from "./Button.tsx";

/**
 * A list whose rows each open something (a saved game, say). The whole row is the target;
 * arrow keys move between rows and Enter opens one.
 */
export function ActionList({
  label,
  onAction,
  children,
  className,
}: {
  /** The list's accessible name. */
  label: string;
  onAction: (id: Key) => void;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  return (
    <GridList aria-label={label} onAction={onAction} className={`border-t border-border ${className ?? ""}`}>
      {children}
    </GridList>
  );
}

/** One row of an `ActionList`. `textValue` is what a screen reader reads for it. */
export function ActionListItem({
  id,
  textValue,
  children,
}: {
  id: Key;
  textValue: string;
  children: ReactNode;
}) {
  return (
    <GridListItem
      id={id}
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
