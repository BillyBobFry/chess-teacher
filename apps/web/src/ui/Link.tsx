import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import { button } from "./Button.tsx";

// The browser underlines every <a>; only the text-link look keeps it (UX-61).
const link = tv({ extend: button, base: "no-underline" });

type LinkProps = Omit<AriaLinkProps, "className"> & {
  /** A text link, or a secondary button's look where it sits among buttons (UX-58). */
  variant: "link" | "secondary";
  /** Placement only (margin, width, grid or flex placement); looks come from `variant`. */
  className?: string;
};

/**
 * Goes to a page. Within the app, `href` comes from `hrefOf` and the router in `UiProvider`
 * handles the click, so the page changes without a reload and gets its own history entry.
 */
export function Link({ variant, className, ...props }: LinkProps) {
  return <AriaLink {...props} className={link({ variant, className })} />;
}
