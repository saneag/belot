import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { MongoMemoryServer } from "mongodb-memory-server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const apiPort = process.env.E2E_API_PORT ?? "3001";

const mongod = await MongoMemoryServer.create();
const mongoUri = mongod.getUri();

const child = spawn("pnpm", ["--filter", "@belot/api", "exec", "tsx", "index.ts"], {
  cwd: root,
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
