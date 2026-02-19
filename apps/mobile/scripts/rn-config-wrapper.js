#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node rn-config-wrapper.js <command> [args...]");
  process.exit(1);
}

const [command, ...commandArgs] = args;

const result = spawnSync(command, commandArgs, {
  env: process.env,
  shell: process.platform === "win32",
  stdio: ["ignore", "pipe", "pipe"],
});

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
