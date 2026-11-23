/**
 * Local API server on http://localhost:8787 (the web app's dev server proxies /api to it).
 * With no DATABASE_URL it uses an embedded Postgres stored in apps/api/.data, migrated on start.
 */

import "dotenv/config";
import { serve } from "@hono/node-server";
import { join } from "node:path";
import { createServer } from "./server.ts";

process.env.PGLITE_DIR ??= join(import.meta.dirname, "..", ".data", "pglite");
const { app, env } = await createServer({ migrate: true });
const port = Number(process.env.API_PORT ?? process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => {
  console.log(`API on http://localhost:${port}/api`);
  console.log(
    `  database: ${env.databaseUrl ? "Neon (DATABASE_URL)" : `embedded Postgres in ${env.pgliteDir}`}`,
  );
  console.log(`  sign-in: email + password${env.google ? " + Google" : ""}`);
  console.log(
    `  AI explanations: ${
      env.anthropicApiKey
        ? env.llmModel
        : process.env.FAKE_LLM === "1"
          ? "fake (FAKE_LLM=1)"
          : "off (no ANTHROPIC_API_KEY), using templates"
    }`,
  );
});
