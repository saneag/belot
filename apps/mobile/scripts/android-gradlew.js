import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidDir = path.resolve(__dirname, "..", "android");
const appBuildGradlePath = path.join(androidDir, "app", "build.gradle");
const isWindows = process.platform === "win32";
const gradlew = isWindows ? "gradlew.bat" : "./gradlew";

const WINDOWS_ENTRY_FIX_MARKER = 'extraPackagerArgs = ["--entry-file", entryFilePath.replace("\\\\", "/")]';

function ensureWindowsEntryFileOverride() {
  if (!isWindows || !fs.existsSync(appBuildGradlePath)) {
    return;
  }

  const original = fs.readFileSync(appBuildGradlePath, "utf8");
  if (original.includes(WINDOWS_ENTRY_FIX_MARKER)) {
    return;
  }

  const target = "    entryFile = file(entryFilePath)";
  if (!original.includes(target)) {
    console.warn(
      "Could not apply Windows entry-file override: react.entryFile line not found in android/app/build.gradle",
    );
    return;
  }

  const snippet = [
    "    entryFile = file(entryFilePath)",
    "    if (isWindows) {",
    "        // Expo monorepo Metro root on Windows can make generated relative entry paths invalid.",
    "        extraPackagerArgs = [\"--entry-file\", entryFilePath.replace(\"\\\\\", \"/\")]",
    "    }",
  ].join("\n");

  const updated = original.replace(target, snippet);
  fs.writeFileSync(appBuildGradlePath, updated, "utf8");
}

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
  ensureWindowsEntryFileOverride();

  execSync(`${gradlew} ${gradleArgs.join(" ")}`, {
    cwd: androidDir,
    stdio: "inherit",
    env,
    shell: isWindows,
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
