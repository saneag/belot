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

const env = { ...process.env };
if (!env.NODE_ENV && tasks.some((task) => task.toLowerCase().includes("release"))) {
  env.NODE_ENV = "production";
}

const hasArchitectureOverride = tasks.some((task) =>
  task.includes("reactNativeArchitectures"),
);
const gradleArgs = hasArchitectureOverride
  ? tasks
  : [...tasks, "-PreactNativeArchitectures=arm64-v8a,x86_64"];

try {
  execSync(`${gradlew} ${gradleArgs.join(" ")}`, {
    cwd: androidDir,
    stdio: "inherit",
    env,
    shell: isWindows,
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
