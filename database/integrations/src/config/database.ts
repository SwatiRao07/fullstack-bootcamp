import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX!),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT!),
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT!),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const readPool = new Pool({
  connectionString: process.env.READ_REPLICA_URL || process.env.DATABASE_URL,
  max: 10,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

import { metrics } from "../utils/metrics";

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Record health metrics
    metrics.recordQuery(duration);

    if (duration > 100) {
      console.warn(`[SLOW QUERY] ${duration}ms | ${text}`, { params });
    }
    return result;
  } catch (err) {
    metrics.recordError();
    throw err;
  }
};

export const checkHealth = async () => {
  try {
    const start = Date.now();
    await query("SELECT 1");
    const duration = Date.now() - start;
    return { status: "OK", latency: `${duration}ms` };
  } catch (err) {
    console.error("Database health check failed:", err);
    return { status: "DOWN", error: (err as Error).message };
  }
};
