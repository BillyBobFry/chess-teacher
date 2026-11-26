import type { ReactNode } from "react";

/**
 * Content on its way (UX-11): bars in the shape of what will come (UX-27), and `label` read out
 * once in its place. The bars themselves are hidden from screen readers.
 */
export function Skeleton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden className="grid gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * One line of text to come. `className` sets its width and height (placement only). Under
 * reduced motion the pulse slows rather than stops, so it still reads as loading (UX-26). The
 * transparent border draws the bar in forced colours, where backgrounds are dropped.
 */
export function SkeletonLine({ className }: { className: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-inline border border-transparent bg-fg/10 motion-reduce:animate-[pulse_4s_ease-in-out_infinite]",
        className,
      ].join(" ")}
    />
  );
}
