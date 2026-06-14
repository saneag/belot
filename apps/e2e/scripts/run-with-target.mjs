import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const e2eDir = path.resolve(__dirname, "..");
const target = process.argv[2];
const playwrightArgs = process.argv.slice(3);

if (target) {
  process.env.E2E_TARGET = target;
}

const result = spawnSync("playwright", playwrightArgs, {
  cwd: e2eDir,
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
