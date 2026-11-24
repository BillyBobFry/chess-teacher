import { paraglideVitePlugin } from "@inlang/paraglide-js";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// The API runs separately (apps/api); both dev and preview servers proxy /api to it, so the
// browser sees one origin, as in production. `pnpm dev` picks a free port and sets API_PORT.
const apiPort = process.env.API_PORT ?? "8787";
const proxy = { "/api": { target: `http://localhost:${apiPort}`, changeOrigin: false } };

// React Aria ships strings for ~30 locales; keep only the languages we ship. By language, not
// region: React Aria's English is en-US, and en-GB uses it.
const { locales } = JSON.parse(
  readFileSync(new URL("./project.inlang/settings.json", import.meta.url), "utf8"),
) as {
  locales: string[];
};
const languages = [...new Set(locales.map((locale) => new Intl.Locale(locale).language))];

// The SPA lives under /app/ so the domain root can hold the landing page (architecture §7.1).
export default defineConfig({
  base: "/app/",
  plugins: [
    react(),
    tailwindcss(),
    optimizeLocales.vite({ locales: languages }),
    // Compiles messages/<locale>.json to src/paraglide (generated, git-ignored).
    // Options: project.inlang/paraglide.config.ts.
    paraglideVitePlugin({ project: "./project.inlang" }),
  ],
  build: { outDir: "dist/app", emptyOutDir: true },
  server: { proxy },
  preview: { proxy },
});
