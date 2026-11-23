// Paraglide compiler options, shared by the Vite plugin (vite.config.ts) and the CLI (`pnpm typecheck`).
import { defineConfig } from "@inlang/paraglide-js";

export default defineConfig({
  outdir: "./src/paraglide",
  // A client-only SPA with no locale in the URL (UX-39): the player's saved choice, then the
  // browser's languages, then en-GB.
  strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  emitTsDeclarations: true,
});
