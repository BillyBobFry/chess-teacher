import type { ReactNode } from "react";
import { I18nProvider } from "react-aria-components";
import { getLocale } from "../paraglide/runtime.js";

/**
 * Wraps the app once, in main.tsx. React Aria's own strings (mostly for screen readers) and its
 * date and number formatting follow the player's locale (docs/design/components.md).
 */
export function UiProvider({ children }: { children: ReactNode }) {
  return <I18nProvider locale={getLocale()}>{children}</I18nProvider>;
}
