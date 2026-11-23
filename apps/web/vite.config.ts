import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The API runs separately (apps/api); both dev and preview servers proxy /api to it, so the
// browser sees one origin, as in production. `pnpm dev` picks a free port and sets API_PORT.
const apiPort = process.env.API_PORT ?? "8787";
const proxy = { "/api": { target: `http://localhost:${apiPort}`, changeOrigin: false } };

// The SPA lives under /app/ so the domain root can hold the landing page (architecture §7.1).
export default defineConfig({
  base: "/app/",
  plugins: [react()],
  build: { outDir: "dist/app", emptyOutDir: true },
  server: { proxy },
  preview: { proxy },
});
