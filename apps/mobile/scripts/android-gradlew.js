import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidDir = path.resolve(__dirname, "..", "android");
const isWindows = process.platform === "win32";
const gradlew = isWindows ? "gradlew.bat" : "./gradlew";

const tasks = process.argv.slice(2);
if (tasks.length === 0) {
  console.error("Usage: node android-gradlew.js <gradle-task> [tasks...]");
  process.exit(1);
}

try {
  execSync(`${gradlew} ${tasks.join(" ")}`, {
    cwd: androidDir,
    stdio: "inherit",
    shell: isWindows,
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
