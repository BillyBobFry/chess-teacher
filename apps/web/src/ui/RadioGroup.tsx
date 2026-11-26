import { Label, Radio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { tv } from "tailwind-variants";

const focusRing =
  "outline-none data-focus-visible:relative data-focus-visible:z-10 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-solid data-focus-visible:outline-primary";

const styles = tv({
  slots: {
    options: "",
    option: [
      "group cursor-pointer bg-surface text-fg",
      // UX-36: a ruled-out option is struck through as well as muted.
      "data-disabled:cursor-default data-disabled:text-fg-muted data-disabled:line-through",
      focusRing,
    ],
  },
  variants: {
    variant: {
      // UX-56: 2 to 4 short options.
      segmented: {
        options: "inline-flex flex-wrap",
        option: [
          "flex min-h-11 items-center border border-border px-4 py-2",
          "-ms-px first:ms-0 first:rounded-s-control last:rounded-e-control",
          "data-hovered:bg-surface-muted data-pressed:bg-border",
          "data-selected:z-[1] data-selected:border-primary data-selected:bg-primary data-selected:text-on-primary",
          "data-selected:data-hovered:bg-primary-hover data-selected:data-pressed:bg-primary-pressed",
        ],
      },
      // Options that each need a line of explanation.
      cards: {
        options: "grid gap-2",
        option: [
          "block rounded-control border border-border px-3.5 py-3",
          "data-hovered:bg-surface-muted data-pressed:bg-border",
          "data-selected:border-primary data-selected:bg-primary data-selected:text-on-primary",
          "data-selected:data-hovered:bg-primary-hover data-selected:data-pressed:bg-primary-pressed",
        ],
      },
    },
  },
});

/** One choice from a few. Arrow keys move between the options, as for native radios. */
export function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  variant,
  className,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  /** `isDisabled` rules an option out, e.g. a wrong guess. */
  options: readonly { value: T; label: string; description?: string; isDisabled?: boolean }[];
  variant: "segmented" | "cards";
  /** Placement only. */
  className?: string;
}) {
  const s = styles({ variant });
  return (
    <AriaRadioGroup
      value={value}
      onChange={(v) => {
        const picked = options.find((o) => o.value === v);
        if (picked) onChange(picked.value);
      }}
      className={className}
    >
      <Label className="mb-2 block font-semibold">{label}</Label>
      <div className={s.options()}>
        {options.map((o) => (
          <Radio key={o.value} value={o.value} isDisabled={o.isDisabled} className={s.option()}>
            <span className={variant === "cards" ? "font-semibold" : undefined}>{o.label}</span>
            {o.description && (
              // UX-47: on the selected fill, the fill's own text colour.
              <span className="text-fg-muted group-data-selected:text-on-primary"> {o.description}</span>
            )}
          </Radio>
        ))}
      </div>
    </AriaRadioGroup>
  );
}
