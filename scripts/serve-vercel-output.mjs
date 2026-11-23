#!/usr/bin/env node
/**
 * Serves .vercel/output locally, following its config.json routes and running the API
 * function, so the production build can be tested end to end before deploying.
 * Uses an embedded Postgres (PGLITE_DIR) unless DATABASE_URL is set.
 *
 * Usage: node scripts/serve-vercel-output.mjs [port]
 */

import { existsSync, readFileSync, statSync, symlinkSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const root = join(import.meta.dirname, "..");
const out = join(root, ".vercel", "output");
const port = Number(process.argv[2] ?? 3000);
const config = JSON.parse(readFileSync(join(out, "config.json"), "utf8"));
process.env.BETTER_AUTH_URL ??= `http://localhost:${port}`;

// Let the bundled function find the local-only PGlite package.
const fnDir = join(out, "functions", "api.func");
const link = join(fnDir, "node_modules");
rmSync(link, { force: true, recursive: true });
symlinkSync(join(root, "apps", "api", "node_modules"), link);
const handler = (await import(join(fnDir, "index.mjs"))).default;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

function staticFile(path) {
  let file = join(out, "static", decodeURIComponent(path));
  if (!file.startsWith(join(out, "static"))) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

function sendFile(res, file, headers) {
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", ...headers });
  res.end(readFileSync(file));
}

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const headers = {};
  for (const route of config.routes) {
    if (route.handle === "filesystem") {
      const file = staticFile(url.pathname);
      if (file) return sendFile(res, file, headers);
      continue;
    }
    const m = url.pathname.match(new RegExp(route.src));
    if (!m) continue;
    if (route.headers && route.continue) {
      Object.assign(headers, route.headers);
      continue;
    }
    if (route.status) {
      res.writeHead(route.status, route.headers);
      return res.end();
    }
    const dest = route.dest.replace(/\$(\d)/g, (_, i) => m[Number(i)] ?? "");
    if (dest.startsWith("/api")) {
      const target = new URL(dest, url);
      for (const [k, v] of url.searchParams) target.searchParams.append(k, v);
      req.url = target.pathname + target.search;
      return handler(req, res);
    }
    const file = staticFile(dest);
    if (file) return sendFile(res, file, headers);
  }
  res.writeHead(404).end("Not found");
}).listen(port, () => console.log(`Serving .vercel/output on http://localhost:${port}`));
