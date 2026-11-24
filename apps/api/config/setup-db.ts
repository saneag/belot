import { pool, schemaSql } from "./postgres.js";

export default async function setupDb(): Promise<void> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await pool.query(schemaSql);
  console.log("Connected to PostgreSQL; schema ready");
}
