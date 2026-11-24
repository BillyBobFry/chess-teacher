import type { ReactNode } from "react";
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { Button } from "./Button.tsx";

/**
 * A modal dialog. React Aria makes the page behind it inert, keeps focus inside, closes on Esc
 * and returns focus to whatever opened it. Utility chrome: it appears without an entrance (UX-25).
 */
export function Dialog({
  isOpen,
  onOpenChange,
  title,
  role = "dialog",
  children,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  /** `alertdialog` for a question that interrupts, like a confirmation (UX-15). */
  role?: "dialog" | "alertdialog";
  children: ReactNode;
}) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      // A click outside doesn't close it: the answer should be a choice, not an accident.
      isDismissable={false}
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-y-auto bg-backdrop p-4"
    >
      <Modal className="w-full max-w-md">
        <AriaDialog
          role={role}
          className="rounded-panel border border-border bg-surface p-5 text-fg shadow-panel outline-none"
        >
          <Heading slot="title" className="m-0 mb-2 text-xl leading-snug font-bold">
            {title}
          </Heading>
          {children}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

/** Asks before something that can't be undone (UX-15). */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  /** Names the destructive action ("Resign game"); styled as a critical button. */
  confirmLabel: string;
  /** The safe way out ("Keep playing"); focused when the dialog opens. */
  cancelLabel: string;
  /** Esc counts as cancelling. */
  onClose: (confirmed: boolean) => void;
}) {
  return (
    <Dialog
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose(false)}
      title={title}
      role="alertdialog"
    >
      <p className="m-0 mb-5 max-w-prose">{body}</p>
      <div className="flex flex-wrap justify-end gap-2">
        {/* The safe choice is the default. */}
        <Button autoFocus onPress={() => onClose(false)}>
          {cancelLabel}
        </Button>
        <Button variant="critical" onPress={() => onClose(true)}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
