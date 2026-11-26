import type { ReactNode } from "react";
import { I18nProvider, RouterProvider } from "react-aria-components";
import { navigateTo } from "../lib/router.ts";
import { getLocale } from "../paraglide/runtime.js";

/**
 * Wraps the app once, in main.tsx. React Aria's own strings (mostly for screen readers) and its
 * date and number formatting follow the player's locale (docs/design/components.md). Its links
 * (`Link`, menu items and list rows with an `href`) go through the app's router, so a click
 * changes page without a reload; a modified click still opens a new tab.
 */
export function UiProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider locale={getLocale()}>
      <RouterProvider navigate={(href) => navigateTo(href)}>{children}</RouterProvider>
    </I18nProvider>
  );
}
