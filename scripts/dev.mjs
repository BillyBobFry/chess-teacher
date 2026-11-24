#!/usr/bin/env node
/**
 * `pnpm dev`: the API and the web dev server together. The API gets the first free port
 * from 8787 (or API_PORT if set) and the web server's /api proxy is pointed at it; Vite
 * picks its own free port from 5173. So it works alongside whatever else you're running.
 */

import { execSync, spawn } from "node:child_process";
import { createServer } from "node:net";

const free = (port) =>
  new Promise((resolve) => {
    const s = createServer()
      .once("error", () => resolve(false))
      .once("listening", () => s.close(() => resolve(true)))
      .listen(port);
  });

let apiPort = Number(process.env.API_PORT ?? 8787);
if (!process.env.API_PORT) while (!(await free(apiPort))) apiPort += 1;

// The API imports the compiled lesson text, so it must exist before the API starts.
execSync("pnpm --filter @chess-teacher/lesson-text i18n", { stdio: "inherit" });

const env = { ...process.env, API_PORT: String(apiPort) };
const child = spawn(
  "pnpm",
  [
    "exec",
    "concurrently",
    "-n",
    "api,web,i18n",
    "-c",
    "blue,green,gray",
    "pnpm --filter @chess-teacher/api dev",
    "pnpm --filter @chess-teacher/web dev",
    // Lesson text for the API and the web app, recompiled when apps/web/messages changes.
    "pnpm --filter @chess-teacher/lesson-text i18n:watch",
  ],
  { env, stdio: "inherit" },
);
child.on("exit", (code) => process.exit(code ?? 0));
