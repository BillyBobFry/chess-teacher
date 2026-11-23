/** Sign-in with Better Auth: email + password, and Google when configured. */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Db } from "./db/client.ts";
import { account, session, user, verification } from "./db/schema.ts";
import { PASSWORD_MIN_LENGTH } from "@chess-teacher/contract";
import { isLocalOrigin, type Env } from "./env.ts";

export function createAuth(db: Db, env: Env) {
  return betterAuth({
    baseURL: env.authUrl,
    basePath: "/api/auth",
    secret: env.authSecret,
    // Locally, the web dev server may be on any port (Vite picks the next free one), so
    // any localhost origin is trusted. Never on Vercel or in production.
    trustedOrigins: env.local
      ? (request) => {
          const origin = request?.headers.get("origin");
          return [...env.trustedOrigins, origin && isLocalOrigin(origin) ? origin : null];
        }
      : env.trustedOrigins,
    // Neon's HTTP driver has no interactive transactions.
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification },
      transaction: false,
    }),
    emailAndPassword: { enabled: true, minPasswordLength: PASSWORD_MIN_LENGTH, autoSignIn: true },
    socialProviders: env.google ? { google: env.google } : {},
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
    telemetry: { enabled: false },
    // Explicit, so these checks also run under test (Better Auth turns them off when
    // NODE_ENV=test by default), and tests see the same behaviour as production.
    advanced: { disableOriginCheck: false, disableCSRFCheck: false },
  });
}

export type Auth = ReturnType<typeof createAuth>;
