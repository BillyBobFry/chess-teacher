import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { getLocale } from "./paraglide/runtime.js";
import "./styles.css";

// UX-39: the page language follows the player's locale (index.html defaults to en-GB).
document.documentElement.lang = getLocale();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
