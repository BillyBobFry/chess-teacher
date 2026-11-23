import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The SPA lives under /app/ so the domain root can hold static marketing pages later
// (architecture §7.1).
export default defineConfig({
  base: "/app/",
  plugins: [react()],
  build: { outDir: "dist/app", emptyOutDir: true },
});
