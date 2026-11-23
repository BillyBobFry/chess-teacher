/** Sign-in with Better Auth: email + password, and Google when configured. */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Db } from "./db/client.ts";
import { account, session, user, verification } from "./db/schema.ts";
import type { Env } from "./env.ts";

export function createAuth(db: Db, env: Env) {
  return betterAuth({
    baseURL: env.authUrl,
    basePath: "/api/auth",
    secret: env.authSecret,
    trustedOrigins: env.trustedOrigins,
    // Neon's HTTP driver has no interactive transactions.
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification },
      transaction: false,
    }),
    emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
    socialProviders: env.google ? { google: env.google } : {},
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
    telemetry: { enabled: false },
  });
}

export type Auth = ReturnType<typeof createAuth>;
