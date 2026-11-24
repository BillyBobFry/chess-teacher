import type { ReactNode } from "react";
import {
  Button,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel,
  type Key,
} from "react-aria-components";
import { pressable } from "./Button.tsx";

export type { Key };

/** A list of `Disclosure`s where opening one closes the others. */
export function DisclosureGroup({
  expanded,
  onExpandedChange,
  children,
  className,
}: {
  /** Controlled, so a panel's heavy content (boards) is only built while it is open. */
  expanded: Key | null;
  onExpandedChange: (expanded: Key | null) => void;
  children: ReactNode;
  /** Placement only. */
  className?: string;
}) {
  return (
    <AriaDisclosureGroup
      expandedKeys={expanded === null ? [] : [expanded]}
      onExpandedChange={(keys) => onExpandedChange([...keys][0] ?? null)}
      className={className}
    >
      {children}
    </AriaDisclosureGroup>
  );
}

/** A row that shows more below it when pressed. `summary` is the row's content. */
export function Disclosure({ id, summary, children }: { id: Key; summary: ReactNode; children: ReactNode }) {
  return (
    <AriaDisclosure id={id} className="border-b border-border">
      <Button
        slot="trigger"
        className={[
          "block w-full border-0 bg-transparent px-1 py-2.5 text-start text-fg",
          ...pressable,
          // UX-8: a neutral step on hover; UX-46: one more when pressed.
          "data-hovered:bg-surface-muted data-pressed:bg-border data-focus-visible:-outline-offset-2",
        ].join(" ")}
      >
        {summary}
      </Button>
      <DisclosurePanel className="px-1 pb-4">{children}</DisclosurePanel>
    </AriaDisclosure>
  );
}
