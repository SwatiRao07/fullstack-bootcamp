import 'dotenv/config'
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function testConnection() {
  const result = await pool.query('SELECT NOW()')
  console.log(result.rows[0])
}