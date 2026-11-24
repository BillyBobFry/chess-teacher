/** Apply migrations: `pnpm --filter @chess-teacher/api db:migrate` (uses DATABASE_URL if set). */

import "dotenv/config";
import { connect, MIGRATIONS } from "./client.ts";

const handle = await connect({ databaseUrl: process.env.DATABASE_URL, pgliteDir: process.env.PGLITE_DIR });
await handle.migrate(MIGRATIONS);
await handle.close();
console.log(`Migrations applied (${handle.kind}).`);
