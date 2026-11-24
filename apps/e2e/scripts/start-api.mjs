import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import pg from "pg";

const require = createRequire(import.meta.url);
if (!process.env.TEST_DATABASE_URL)
  throw new Error("Set TEST_DATABASE_URL to a dedicated PostgreSQL test database");
const schema = "e2e_" + process.pid;
const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
await admin.query('CREATE SCHEMA "' + schema + '"');
const url = new URL(process.env.TEST_DATABASE_URL);
url.searchParams.set("options", "-c search_path=" + schema);
const child = spawn(process.execPath, [require.resolve("tsx/cli"), "index.ts"], {
  cwd: new URL("../../api/", import.meta.url),
  env: { ...process.env, DATABASE_URL: url.toString(), PORT: process.env.E2E_API_PORT ?? "3001" },
  stdio: "inherit",
});
let stopping = false;
async function cleanup(code = 0) {
  if (stopping) return;
  stopping = true;
  await admin.query('DROP SCHEMA "' + schema + '" CASCADE');
  await admin.end();
  process.exit(code);
}
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
child.on("exit", (code) => void cleanup(code ?? 0));
