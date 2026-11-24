// Run inside the built API container. All writes use a temporary schema.
import assert from "node:assert/strict";
import pg from "pg";

const admin = new pg.Client({ connectionString: process.env.DATABASE_URL });
await admin.connect();
const schema = "validation_" + process.pid;
await admin.query('CREATE SCHEMA "' + schema + '"');
const url = new URL(process.env.DATABASE_URL);
url.searchParams.set("options", "-c search_path=" + schema);
process.env.DATABASE_URL = url.toString();
process.env.VITEST = "1";
let server;
let pool;
try {
  const db = await import("../dist/config/postgres.js");
  pool = db.pool;
  const { default: setupDb } = await import("../dist/config/setup-db.js");
  await setupDb();
  await setupDb();
  const { app } = await import("../dist/index.js");
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  async function request(path, method = "GET", body, status = 200) {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    assert.equal(response.status, status, path);
    return response.json();
  }
  assert.equal((await request("/games")).total, 0);
  const input = {
    players: [
      { id: 0, name: "Alice" },
      { id: 1, name: "Bob" },
    ],
    mode: "classic",
    teams: [],
  };
  const { id } = await request("/games/init", "POST", input, 201);
  assert.match(id, /^[a-f0-9]{24}$/);
  assert.equal((await request("/games/" + id)).players[0].name, "Alice");
  assert.equal((await request("/games/" + id, "PATCH", { isFinished: true })).isFinished, true);
  await request("/games/" + id, "PATCH", { roundsScores: [] });
  assert.equal((await request("/games/" + id)).isFinished, true);
  assert.equal((await request("/games?page=2&limit=1")).games.length, 0);
  await request("/games/bad", "GET", undefined, 400);
  await request("/games/init", "POST", {}, 400);
  const name = "'; DROP TABLE games; --";
  await request("/feature-toggles", "POST", { name }, 201);
  await request("/feature-toggles/toggle", "POST", { name, enabled: true });
  assert.equal(
    (await request("/feature-toggles/isEnabled?name=" + encodeURIComponent(name))).enabled,
    true,
  );
  assert.equal((await request("/games")).total, 1);
  console.log(
    "PASS: PostgreSQL schema idempotence, game create/read/update/pagination, validation, feature toggles, hostile SQL input",
  );
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (pool) await pool.end();
  await admin.query('DROP SCHEMA "' + schema + '" CASCADE');
  await admin.end();
}
