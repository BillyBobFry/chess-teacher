import type { ReactNode } from "react";

/** Something went wrong: what, why and what next (UX-14), read out as it appears. */
export function Alert({
  children,
  className,
}: {
  children: ReactNode;
  /** Placement only. */ className?: string;
}) {
  return (
    <div
      role="alert"
      className={["rounded-control bg-warning-subtle px-3 py-2 text-warning", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
