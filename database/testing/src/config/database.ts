import "dotenv/config";
import { Pool } from "pg";
import Database from "better-sqlite3";
import type { Database as SQLiteDatabase } from "better-sqlite3";
import { metrics } from "../utils/metrics";

export type DbType = "postgres" | "sqlite";

interface IQueryResult {
  rows: any[];
  rowCount: number | null;
}

export class DatabaseProvider {
  private pgPool?: Pool;
  private sqlite?: SQLiteDatabase;
  private type: DbType;

  constructor() {
    this.type =
      (process.env.DB_TYPE as DbType) ||
      (process.env.NODE_ENV === "test" ? "sqlite" : "postgres");

    if (this.type === "postgres") {
      this.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: parseInt(process.env.DB_POOL_MAX || "10"),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
        connectionTimeoutMillis: parseInt(
          process.env.DB_CONN_TIMEOUT || "2000",
        ),
      });
    } else {
      const sqlitePath = process.env.SQLITE_PATH || ":memory:";
      this.sqlite = new Database(sqlitePath);
      this.sqlite.pragma("foreign_keys = ON");
    }
  }

  async query(text: string, params?: any[]): Promise<IQueryResult> {
    const start = Date.now();
    try {
      if (this.type === "postgres") {
        const result = await this.pgPool!.query(text, params);
        const duration = Date.now() - start;
        metrics.recordQuery(text, duration);
        this.trackSlowQuery(text, duration);
        return { rows: result.rows, rowCount: result.rowCount };
      } else {
        const sqliteSql = text.replace(/\$(\d+)/g, "?");
        const stmt = this.sqlite!.prepare(sqliteSql);

        const lowerSql = text.trim().toLowerCase();
        if (
          lowerSql.startsWith("select") ||
          lowerSql.startsWith("explain") ||
          lowerSql.startsWith("pragma")
        ) {
          const rows = stmt.all(params || []);
          const duration = Date.now() - start;
          metrics.recordQuery(text, duration);
          this.trackSlowQuery(text, duration);
          return { rows, rowCount: rows.length };
        } else {
          const info = stmt.run(params || []);
          const duration = Date.now() - start;
          metrics.recordQuery(text, duration);
          this.trackSlowQuery(text, duration);
          return { rows: [], rowCount: info.changes };
        }
      }
    } catch (err) {
      console.error(`Database query error [${this.type}]:`, err);
      throw err;
    }
  }

  private trackSlowQuery(text: string, duration: number) {
    if (duration > 100) {
      console.warn(`[SLOW QUERY] ${duration}ms | ${text}`);
    }
  }

  async checkHealth() {
    try {
      const start = Date.now();
      await this.query("SELECT 1");
      const duration = Date.now() - start;
      return {
        status: "OK",
        latency: `${duration}ms`,
        pool: this.getPoolStatus(),
        size: await this.getDbSize(),
        metrics: metrics.getStats(),
      };
    } catch (err) {
      return { status: "DOWN", error: (err as Error).message };
    }
  }

  private async getDbSize() {
    try {
      if (this.type === "postgres") {
        const res = await this.query(
          "SELECT pg_size_pretty(pg_database_size(current_database())) as size",
        );
        return res.rows[0].size;
      } else {
        const pageCount = await this.query("PRAGMA page_count");
        const pageSize = await this.query("PRAGMA page_size");
        const bytes = pageCount.rows[0].page_count * pageSize.rows[0].page_size;
        return `${(bytes / 1024).toFixed(2)} KB`;
      }
    } catch (err) {
      return "Unknown";
    }
  }

  private getPoolStatus() {
    if (this.type === "postgres") {
      return {
        total: this.pgPool!.totalCount,
        idle: this.pgPool!.idleCount,
        waiting: this.pgPool!.waitingCount,
      };
    }
    return { status: "SQLite is single process" };
  }

  async close() {
    if (this.pgPool) await this.pgPool.end();
    if (this.sqlite) this.sqlite.close();
  }

  isSQLite(): boolean {
    return this.type === "sqlite";
  }

  getNativeDb() {
    return this.type === "postgres" ? this.pgPool : this.sqlite;
  }
}

export const db = new DatabaseProvider();
