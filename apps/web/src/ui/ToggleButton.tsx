import { ToggleButton as AriaToggleButton, type ToggleButtonProps } from "react-aria-components";
import { pressable, secondaryLook } from "./Button.tsx";

/** A button that stays pressed (`isSelected`), announced as pressed or not. */
export function ToggleButton({
  className,
  ...props
}: Omit<ToggleButtonProps, "className"> & { className?: string }) {
  return (
    <AriaToggleButton
      {...props}
      className={[
        "inline-flex items-center justify-center px-2.5",
        ...pressable,
        ...secondaryLook,
        "data-selected:border-primary data-selected:bg-success-subtle",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
