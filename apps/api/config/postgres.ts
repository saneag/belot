import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const schemaSql = `
CREATE TABLE IF NOT EXISTS games (
 id text PRIMARY KEY CHECK (id ~ '^[a-f0-9]{24}$'),
 data jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS games_updated_at ON games (updated_at DESC);
CREATE TABLE IF NOT EXISTS feature_toggles (name text PRIMARY KEY, enabled boolean NOT NULL DEFAULT false);
`;
