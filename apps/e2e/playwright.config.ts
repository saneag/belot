import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const WEB_PORT = 5173;
const MOBILE_WEB_PORT = 8081;
const API_PORT = 3001;

const target = process.env.E2E_TARGET ?? "all";

function shouldStart(server: "web" | "mobile" | "api") {
  return target === "all" || target === server;
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  outputDir: "./test-results",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "web",
      testDir: "./tests/web",
      use: {
        baseURL: `http://127.0.0.1:${WEB_PORT}`,
      },
    },
    {
      name: "mobile",
      testDir: "./tests/mobile",
      use: {
        ...devices["Pixel 7"],
        baseURL: `http://127.0.0.1:${MOBILE_WEB_PORT}`,
      },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL: `http://127.0.0.1:${API_PORT}`,
      },
    },
  ],
  webServer: [
    ...(shouldStart("api")
      ? [
          {
            command: "node scripts/start-api.mjs",
            cwd: __dirname,
            url: `http://127.0.0.1:${API_PORT}/games`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            env: {
              E2E_API_PORT: String(API_PORT),
            },
          },
        ]
      : []),
    ...(shouldStart("web")
      ? [
          {
            command: `pnpm --filter @belot/web dev -- --host 127.0.0.1 --port ${WEB_PORT}`,
            cwd: root,
            url: `http://127.0.0.1:${WEB_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    ...(shouldStart("mobile")
      ? [
          {
            command: `CI=1 pnpm --filter @belot/mobile web -- --port ${MOBILE_WEB_PORT}`,
            cwd: root,
            url: `http://127.0.0.1:${MOBILE_WEB_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 180_000,
          },
        ]
      : []),
  ],
});
