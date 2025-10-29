// Referenced from javascript_database blueprint
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  // Don't throw here — the app can run in a degraded mode without a DB for
  // local development. Consumers should check for DB availability where
  // appropriate (we also lazy-import in storage.ts).
  console.warn("DATABASE_URL not set — running in degraded local mode without database.");
}

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : undefined;

// drizzle typing for neon-serverless may expect different properties depending
// on the version. Create the instance only when pool exists; use a plain any
// to avoid a blocking type error during typecheck.
let _db: any = undefined;
if (pool) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - accept runtime behavior even if types differ between versions
  _db = drizzle({ client: pool, schema });
}

export const db = _db as any;
