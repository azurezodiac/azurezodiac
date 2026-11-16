import mysql, { type Pool as MysqlPool, type RowDataPacket } from "mysql2/promise";
import { Pool as PgPool } from "pg";

export type DbDialect = "mysql" | "postgres";

export type DbRow = Record<string, unknown>;

export type DbQueryResult = {
  rows: DbRow[];
  rowCount: number;
};

type DbHandle = {
  dialect: DbDialect;
  query: (sql: string, params?: unknown[]) => Promise<DbQueryResult>;
};

let handle: DbHandle | null | undefined;

function mysqlConfigFromEnv(): mysql.PoolOptions | null {
  const url = process.env.DATABASE_URL?.trim() || process.env.MYSQL_URL?.trim();
  if (url && (url.startsWith("mysql://") || url.startsWith("mysql2://"))) {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
      waitForConnections: true,
      connectionLimit: 5,
    };
  }

  const host = process.env.MYSQL_HOST?.trim();
  const database = process.env.MYSQL_DATABASE?.trim();
  const user = process.env.MYSQL_USER?.trim();
  if (host && database && user) {
    return {
      host,
      port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
      user,
      password: process.env.MYSQL_PASSWORD ?? "",
      database,
      waitForConnections: true,
      connectionLimit: 5,
    };
  }

  return null;
}

function postgresUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (url.startsWith("mysql://") || url.startsWith("mysql2://")) return null;
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return url;
  // Bare postgres-style URLs without scheme are uncommon; require scheme.
  return null;
}

/** Convert `?` placeholders to Postgres `$1..$n`. */
function toPgPlaceholders(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function createMysqlHandle(options: mysql.PoolOptions): DbHandle {
  const pool: MysqlPool = mysql.createPool(options);
  return {
    dialect: "mysql",
    async query(sql, params = []) {
      const [result] = await pool.query(sql, params);
      if (Array.isArray(result)) {
        const rows = result as RowDataPacket[];
        return {
          rows: rows.map((row) => ({ ...row }) as DbRow),
          rowCount: rows.length,
        };
      }
      const header = result as { affectedRows?: number };
      return { rows: [], rowCount: header.affectedRows ?? 0 };
    },
  };
}

function createPostgresHandle(connectionString: string): DbHandle {
  const pool = new PgPool({ connectionString });
  return {
    dialect: "postgres",
    async query(sql, params = []) {
      const result = await pool.query(toPgPlaceholders(sql), params);
      return {
        rows: result.rows as DbRow[],
        rowCount: result.rowCount ?? result.rows.length,
      };
    },
  };
}

/**
 * Shared DB handle. Prefers MySQL (cPanel) via MYSQL_* or mysql:// DATABASE_URL.
 * Falls back to Postgres when DATABASE_URL is postgres://.
 */
export function getDb(): DbHandle | null {
  if (handle !== undefined) return handle;

  const mysqlOpts = mysqlConfigFromEnv();
  if (mysqlOpts) {
    handle = createMysqlHandle(mysqlOpts);
    return handle;
  }

  const pg = postgresUrl();
  if (pg) {
    handle = createPostgresHandle(pg);
    return handle;
  }

  handle = null;
  return null;
}

export function getDbDialect(): DbDialect | null {
  return getDb()?.dialect ?? null;
}

export function hasDatabase(): boolean {
  return Boolean(getDb());
}

/** Run a parameterized query (`?` placeholders for both dialects). */
export async function dbQuery(
  sql: string,
  params: unknown[] = [],
): Promise<DbQueryResult> {
  const database = getDb();
  if (!database) throw new Error("No database configured");
  return database.query(sql, params);
}
