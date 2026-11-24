/**
 * Database connection: Neon (serverless HTTP driver) when DATABASE_URL is set, otherwise
 * PGlite, a real Postgres compiled to WebAssembly that runs in-process. That means local
 * development and tests need no database setup at all.
 */

import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema.ts";

/** Here, not in server.ts, so the migrate CLI loads only database code: the Vercel build migrates before generating i18n. */
export const MIGRATIONS = join(import.meta.dirname, "..", "..", "drizzle");

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export interface DbHandle {
  db: Db;
  kind: "neon" | "pglite";
  migrate(migrationsFolder: string): Promise<void>;
  close(): Promise<void>;
}

/**
 * `pgliteDir`: a folder to persist to; omit for an in-memory database (tests).
 * PGlite is imported lazily so production bundles (Neon) never load it.
 */
export async function connect(opts: { databaseUrl?: string; pgliteDir?: string }): Promise<DbHandle> {
  if (opts.databaseUrl) {
    const db = drizzleNeon(neon(opts.databaseUrl), { schema });
    return {
      db: db as unknown as Db,
      kind: "neon",
      migrate: (migrationsFolder) => migrateNeon(db, { migrationsFolder }),
      close: async () => {},
    };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle: drizzlePglite } = await import("drizzle-orm/pglite");
  const { migrate: migratePglite } = await import("drizzle-orm/pglite/migrator");
  if (opts.pgliteDir) {
    const { mkdirSync } = await import("node:fs");
    mkdirSync(opts.pgliteDir, { recursive: true });
  }
  const client = new PGlite(opts.pgliteDir);
  const db = drizzlePglite(client, { schema });
  return {
    db: db as unknown as Db,
    kind: "pglite",
    migrate: (migrationsFolder) => migratePglite(db, { migrationsFolder }),
    close: () => client.close(),
  };
}

export { schema };
