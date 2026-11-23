import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The API runs separately (apps/api, port 8787); both dev and preview servers proxy /api to
// it, so the browser sees one origin, as in production.
const proxy = { "/api": { target: "http://localhost:8787", changeOrigin: false } };

// The SPA lives under /app/ so the domain root can hold the landing page (architecture §7.1).
export default defineConfig({
  base: "/app/",
  plugins: [react()],
  build: { outDir: "dist/app", emptyOutDir: true },
  server: { proxy },
  preview: { proxy },
});
