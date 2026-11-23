/**
 * Vercel Function entry point (bundled by scripts/build-vercel.mjs into the Build Output).
 * Migrations run at build time, not here.
 */

import { getRequestListener } from "@hono/node-server";
import { createServer } from "./server.ts";

const server = createServer();

/**
 * Vercel routes /api/* to this one function. The original path is normally preserved; if it
 * arrives as /api?__path=games/..., rebuild it (the route passes it along for that case).
 */
export function restorePath(request: Request): Request {
  const url = new URL(request.url);
  const passed = url.searchParams.get("__path");
  if (passed === null) return request;
  url.searchParams.delete("__path");
  if (url.pathname === "/api" || url.pathname === "/api/") url.pathname = `/api/${passed}`;
  return new Request(url, request);
}

export default getRequestListener(async (request) => (await server).app.fetch(restorePath(request)));
