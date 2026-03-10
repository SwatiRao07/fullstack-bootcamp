import { pool } from "../config/database";
import { PoolClient } from "pg";

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("Transaction started...");

    const result = await callback(client);

    await client.query("COMMIT");
    console.log("Transaction committed.");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    console.warn(
      "Transaction rolled back due to error:",
      (err as Error).message,
    );
    throw err;
  } finally {
    client.release();
  }
}
