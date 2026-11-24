import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { getLocale } from "./paraglide/runtime.js";
import "./theme.css";
import { UiProvider } from "./ui/UiProvider.tsx";

// UX-39: the page language follows the player's locale (index.html defaults to en-GB).
document.documentElement.lang = getLocale();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </StrictMode>,
);
