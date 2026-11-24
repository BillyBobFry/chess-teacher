import {
  FieldError,
  Input,
  Label,
  TextField as AriaTextField,
  type TextFieldProps,
} from "react-aria-components";

type Props = Omit<TextFieldProps, "className" | "children"> & {
  /** Placement only (margin, width, flex placement). */
  className?: string;
  placeholder?: string;
} & (
    | { /** Shown above the field (UX-57). */ label: string }
    | { /** Only where the field's purpose is plain from what's next to it. */ "aria-label": string }
  );

/**
 * A text input with its label and its error. Errors appear on blur or submit, above the field
 * (UX-20); the browser's own validation messages are shown there, not in a bubble.
 */
export function TextField({ className, placeholder, ...props }: Props) {
  const label = "label" in props ? props.label : undefined;
  return (
    <AriaTextField {...props} className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}>
      {label && <Label className="text-sm font-semibold">{label}</Label>}
      {/* UX-20: the error sits between the label and the field. */}
      <FieldError className="text-sm text-warning" />
      <Input
        placeholder={placeholder}
        className={[
          "min-h-11 w-full rounded-control border border-border bg-surface px-3 py-2 text-fg [font:inherit]",
          "placeholder:text-fg-muted outline-none data-invalid:border-warning",
          "data-focus-visible:outline-2 data-focus-visible:outline-offset-1 data-focus-visible:outline-solid data-focus-visible:outline-primary",
        ].join(" ")}
      />
    </AriaTextField>
  );
}
