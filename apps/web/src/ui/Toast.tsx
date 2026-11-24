import { tv } from "tailwind-variants";

const toast = tv({
  base: "max-w-120 rounded-control border px-4 py-3 shadow-panel",
  variants: {
    tone: { info: "border-border bg-surface text-fg", success: "border-success bg-success-subtle text-fg" },
  },
});

export interface ToastMessage {
  id: number;
  text: string;
  tone: "info" | "success";
}

/**
 * Short news that needs no action, read out politely and gone after a few seconds. React Aria's
 * toast is still unstable, so this is ours; switch when it is stable.
 */
export function Toasts({ toasts }: { toasts: readonly ToastMessage[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex flex-col items-center gap-2"
    >
      {toasts.map((t) => (
        <div key={t.id} className={toast({ tone: t.tone })}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
