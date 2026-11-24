import { useEffect, useId, useRef } from "react";
import { Button } from "../ui/Button.tsx";

interface Props {
  open: boolean;
  title: string;
  body: string;
  /** Names the destructive action ("Abandon game"); styled as a danger button. */
  confirmLabel: string;
  /** The safe way out ("Keep playing"); focused when the dialog opens. */
  cancelLabel: string;
  onClose: (confirmed: boolean) => void;
}

/**
 * Asks before something that can't be undone (UX-15). A native modal <dialog>: the browser
 * makes the page inert, traps focus, closes on Esc and returns focus to the button that
 * opened it.
 */
export function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="confirm"
      aria-labelledby={titleId}
      onClose={(e) => {
        // Esc sets no value, and browsers differ on clearing the last one: reset it.
        const confirmed = e.currentTarget.returnValue === "confirm";
        e.currentTarget.returnValue = "";
        onClose(confirmed);
      }}
    >
      <h1 id={titleId}>{title}</h1>
      <p>{body}</p>
      {/* Cancel comes first so showModal() focuses it: the safe choice is the default. Both
          submit, so the dialog closes with the button's value. */}
      <form method="dialog" className="confirm-actions">
        <Button type="submit" value="cancel">
          {cancelLabel}
        </Button>
        <Button type="submit" value="confirm" variant="critical">
          {confirmLabel}
        </Button>
      </form>
    </dialog>
  );
}
