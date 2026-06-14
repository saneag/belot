import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MongoMemoryServer } from "mongodb-memory-server";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const apiDir = path.join(root, "apps", "api");
const apiPort = process.env.E2E_API_PORT ?? "3001";

function resolveTsxCli() {
  for (const lookupDir of [apiDir, root]) {
    try {
      return require.resolve("tsx/cli", { paths: [lookupDir] });
    } catch {
      // try next lookup root
    }
  }

  throw new Error("Could not resolve tsx CLI. Run `pnpm install` from the repo root.");
}

const mongod = await MongoMemoryServer.create();
const mongoUri = mongod.getUri();
const tsxCli = resolveTsxCli();

const child = spawn(process.execPath, [tsxCli, "index.ts"], {
  cwd: apiDir,
  env: {
    ...process.env,
    MONGODB_URI: mongoUri,
    PORT: apiPort,
  },
  stdio: "inherit",
});

let shuttingDown = false;

async function cleanup(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (signal) {
    child.kill(signal);
  }

  await mongod.stop();
}

process.on("SIGINT", () => {
  void cleanup("SIGINT");
});

process.on("SIGTERM", () => {
  void cleanup("SIGTERM");
});

child.on("exit", (code) => {
  void mongod.stop().finally(() => {
    process.exit(code ?? 0);
  });
});
