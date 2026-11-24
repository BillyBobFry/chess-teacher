import type { ReactNode } from "react";
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover,
  type MenuItemProps,
  type MenuTriggerProps,
} from "react-aria-components";
import { floatingPanel } from "./Popover.tsx";

/** Pairs a trigger (a `Button`) with its `Menu`: `<MenuTrigger><Button>…</Button><Menu>…</Menu></MenuTrigger>`. */
export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

/** A list of actions. Arrow keys move between items; choosing one closes the menu. */
export function Menu({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Popover placement="bottom end" offset={6} className={`${floatingPanel} w-60 p-1.5`}>
      <AriaMenu aria-label={label} className="outline-none">
        {children}
      </AriaMenu>
    </Popover>
  );
}

/** A group of items under a heading that screen readers read as the group's name. */
export function MenuSection({ header, children }: { header: ReactNode; children: ReactNode }) {
  return (
    <AriaMenuSection>
      <Header className="mb-1 border-b border-border px-2.5 pt-1.5 pb-2.5">{header}</Header>
      {children}
    </AriaMenuSection>
  );
}

export function MenuItem(props: Omit<MenuItemProps, "className">) {
  return (
    <AriaMenuItem
      {...props}
      className={[
        "flex min-h-11 cursor-pointer items-center rounded-control px-2.5 text-fg outline-none",
        // UX-8 and UX-46: a neutral step on hover or arrow-key focus, one more when pressed.
        "data-focused:bg-surface-muted data-hovered:bg-surface-muted data-pressed:bg-border",
      ].join(" ")}
    />
  );
}
