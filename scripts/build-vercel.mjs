#!/usr/bin/env node
/**
 * Builds the whole site in Vercel's Build Output API format (.vercel/output):
 *   static/            landing page at /, the SPA under /app/
 *   functions/api.func the Hono API, bundled into one file
 *   config.json        routing
 * When DATABASE_URL is set (Vercel + Neon), database migrations run first.
 */

import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";

const root = join(import.meta.dirname, "..");
const out = join(root, ".vercel", "output");
const fn = join(out, "functions", "api.func");
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

if (process.env.DATABASE_URL) {
  console.log("Applying database migrations…");
  run("pnpm --filter @chess-teacher/api db:migrate");
}

run("pnpm --filter @chess-teacher/web build");

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "static"), { recursive: true });
mkdirSync(fn, { recursive: true });

cpSync(join(root, "apps/web/dist/app"), join(out, "static/app"), { recursive: true });
cpSync(join(root, "apps/web/landing/index.html"), join(out, "static/index.html"));
cpSync(join(root, "apps/web/landing/landing.css"), join(out, "static/landing.css"));

await build({
  entryPoints: [join(root, "apps/api/src/vercel.ts")],
  outfile: join(fn, "index.mjs"),
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  // Local-only embedded Postgres: imported lazily, never used when DATABASE_URL is set.
  external: ["@electric-sql/pglite", "drizzle-orm/pglite", "drizzle-orm/pglite/migrator"],
  banner: {
    js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);",
  },
  legalComments: "none",
  logLevel: "warning",
});

writeFileSync(
  join(fn, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      maxDuration: 60,
    },
    null,
    2,
  ),
);

const immutable = { "Cache-Control": "public, max-age=31536000, immutable" };
writeFileSync(
  join(out, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "^/app/(assets|stockfish)/(.*)$", headers: immutable, continue: true },
        { src: "^/app$", status: 308, headers: { Location: "/app/" } },
        { handle: "filesystem" },
        // One function serves the whole API; __path carries the original path along.
        { src: "^/api/(.*)$", dest: "/api?__path=$1" },
        // Client-side routing for the SPA.
        { src: "^/app/(.*)$", dest: "/app/index.html" },
      ],
    },
    null,
    2,
  ),
);

console.log(`Build output written to ${out}`);
