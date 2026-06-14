import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { resolvePackageBin } from "./resolve-package-bin.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const mobileDir = path.join(root, "apps", "mobile");
const mobilePort = process.env.E2E_MOBILE_WEB_PORT ?? "8081";
const expoCli = resolvePackageBin("expo", "expo", [mobileDir, root]);

const child = spawn(process.execPath, [expoCli, "start", "--web", "--port", mobilePort], {
  cwd: mobileDir,
  env: {
    ...process.env,
    CI: "1",
  },
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
