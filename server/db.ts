import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "WARNING: DATABASE_URL is not set. The application will start but database operations will fail.",
  );
}

// Fallback to a dummy connection string to allow the app to start
// The pool will likely fail to connect on actual queries, but we avoid startup crash.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db"
});
export const db = drizzle(pool, { schema });
