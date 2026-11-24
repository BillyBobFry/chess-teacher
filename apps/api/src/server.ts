/** Wires the API together from the environment: database, auth, LLM client. */

import { createApp } from "./app.ts";
import { createAuth } from "./auth.ts";
import { connect, MIGRATIONS } from "./db/client.ts";
import { readEnv, type Env } from "./env.ts";
import { createFakeLlmClient, createLlmClient, type LlmClient } from "./explain.ts";

export async function createServer(opts: { env?: Env; llm?: LlmClient | null; migrate?: boolean } = {}) {
  const env = opts.env ?? readEnv();
  const handle = await connect({ databaseUrl: env.databaseUrl, pgliteDir: env.pgliteDir });
  if (opts.migrate) await handle.migrate(MIGRATIONS);
  const auth = createAuth(handle.db, env);
  const llm =
    opts.llm !== undefined
      ? opts.llm
      : env.anthropicApiKey
        ? createLlmClient(env.anthropicApiKey)
        : process.env.FAKE_LLM === "1" && !process.env.VERCEL
          ? createFakeLlmClient()
          : null;
  const app = createApp({ db: handle.db, auth, env, llm });
  return { app, env, db: handle.db, close: () => handle.close() };
}
