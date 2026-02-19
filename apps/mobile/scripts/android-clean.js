import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const androidRoot = path.resolve(appRoot, "android");
const isWindows = process.platform === "win32";
const targets = ["build", "app/.cxx", "app/build"].map((p) =>
  path.join(androidRoot, p),
);

function stopGradleDaemons() {
  const gradlew = isWindows ? "gradlew.bat" : "./gradlew";
  const result = spawnSync(gradlew, ["--stop"], {
    cwd: androidRoot,
    shell: isWindows,
    stdio: "ignore",
  });

  if (result.error) {
    console.warn(`Could not stop Gradle daemon: ${result.error.message}`);
  }
}

function removePath(target) {
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      fs.rmSync(target, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 200,
      });
      return true;
    } catch (error) {
      const isLockError =
        error?.code === "EBUSY" ||
        error?.code === "EPERM" ||
        error?.code === "ENOTEMPTY";
      const isLastAttempt = attempt === maxAttempts;

      if (!isLockError || isLastAttempt) {
        console.error(`Failed to remove ${target}: ${error.message}`);
        return false;
      }
    }
  }

  return false;
}

stopGradleDaemons();

let hasFailure = false;
for (const target of targets) {
  if (!fs.existsSync(target)) {
    continue;
  }

  if (removePath(target)) {
    console.log(`Removed: ${path.relative(appRoot, target)}`);
  } else {
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}
