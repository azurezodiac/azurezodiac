import { Pool } from "pg";

let pool: Pool | null = null;

/** Shared Postgres pool when DATABASE_URL is set (your website database). */
export function getDb(): Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!pool) {
    pool = new Pool({ connectionString: url });
  }
  return pool;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
