import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolvePackageBin } from "./resolve-package-bin.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const webDir = path.join(root, "apps", "web");
const webPort = process.env.E2E_WEB_PORT ?? "5173";
const viteCli = resolvePackageBin("vite", "vite", [webDir, root]);

const child = spawn(process.execPath, [viteCli, "--host", "127.0.0.1", "--port", webPort], {
  cwd: webDir,
  env: process.env,
  stdio: "inherit",
});

function cleanup(signal) {
  if (signal) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => {
  cleanup("SIGINT");
});

process.on("SIGTERM", () => {
  cleanup("SIGTERM");
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
