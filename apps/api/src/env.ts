/** Server configuration, read once from environment variables. */

export interface Env {
  /** Neon connection string. Unset → embedded PGlite (local development and tests). */
  databaseUrl?: string;
  /** Where PGlite stores data locally. Unset → in memory. */
  pgliteDir?: string;
  /**
   * Public base URL of the site, e.g. https://chess.example.com. Unset locally: it's then
   * taken from each request, so the web dev server can run on any port.
   */
  authUrl?: string;
  /** Running on a developer's machine (not on Vercel, not production). */
  local: boolean;
  authSecret: string;
  trustedOrigins: string[];
  google?: { clientId: string; clientSecret: string };
  /** Anthropic API key. Unset → AI explanations are off and the app uses templates. */
  anthropicApiKey?: string;
  llmModel: string;
  /** Coached games (games with an AI explanation, D13) per user per calendar month. */
  coachedGamesPerMonth: number;
}

const DEV_SECRET = "dev-only-secret-change-me-in-production-0123456789";

/** http://localhost or http://127.0.0.1 on any port: trusted only when running locally. */
export const isLocalOrigin = (origin: string): boolean =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

export function readEnv(e: Record<string, string | undefined> = process.env): Env {
  const vercelUrl = e.VERCEL_URL ? `https://${e.VERCEL_URL}` : undefined;
  const authUrl = e.BETTER_AUTH_URL ?? vercelUrl;
  const production = e.VERCEL_ENV === "production" || e.NODE_ENV === "production";
  const local = !e.VERCEL && !production;
  const authSecret = e.BETTER_AUTH_SECRET ?? (production ? undefined : DEV_SECRET);
  if (!authSecret) throw new Error("BETTER_AUTH_SECRET must be set in production.");
  return {
    databaseUrl: e.DATABASE_URL || undefined,
    pgliteDir: e.PGLITE_DIR || undefined,
    authUrl,
    local,
    authSecret,
    trustedOrigins: [authUrl, vercelUrl, e.VERCEL_BRANCH_URL && `https://${e.VERCEL_BRANCH_URL}`].filter(
      (x): x is string => !!x,
    ),
    google:
      e.GOOGLE_CLIENT_ID && e.GOOGLE_CLIENT_SECRET
        ? { clientId: e.GOOGLE_CLIENT_ID, clientSecret: e.GOOGLE_CLIENT_SECRET }
        : undefined,
    anthropicApiKey: e.ANTHROPIC_API_KEY || undefined,
    llmModel: e.LLM_MODEL || "claude-opus-5-5",
    coachedGamesPerMonth: Number(e.FREE_COACHED_GAMES_PER_MONTH ?? 30),
  };
}
