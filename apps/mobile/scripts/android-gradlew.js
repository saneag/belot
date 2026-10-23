import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const androidDir = path.resolve(__dirname, "..", "android");
const appBuildGradlePath = path.join(androidDir, "app", "build.gradle");
const isWindows = process.platform === "win32";
const gradlew = isWindows ? "gradlew.bat" : "./gradlew";

const WINDOWS_ENTRY_FIX_MARKER =
  'extraPackagerArgs = ["--entry-file", entryFile.get().asFile.absolutePath.replace("\\\\", "/")]';

function ensureWindowsEntryFileOverride() {
  if (!isWindows || !fs.existsSync(appBuildGradlePath)) {
    return;
  }

  const original = fs.readFileSync(appBuildGradlePath, "utf8");
  const wrappedOverride = [
    "    if (isWindows) {",
    "        // Expo monorepo Metro root on Windows can make generated relative entry paths invalid.",
    `        ${WINDOWS_ENTRY_FIX_MARKER}`,
    "    }",
  ].join("\n");
  if (original.includes(wrappedOverride)) {
    const replacement = [
      "    // Expo monorepo Metro root on Windows can make generated relative entry paths invalid.",
      `    ${WINDOWS_ENTRY_FIX_MARKER}`,
    ].join("\n");
    fs.writeFileSync(appBuildGradlePath, original.replace(wrappedOverride, replacement), "utf8");
    return;
  }

  if (original.includes(WINDOWS_ENTRY_FIX_MARKER)) {
    return;
  }

  const target = /^\s*entryFile = file\(.*resolveAppEntry.*$/m;
  const match = original.match(target);
  if (!match) {
    console.warn(
      "Could not apply Windows entry-file override: react.entryFile line not found in android/app/build.gradle",
    );
    return;
  }

  const snippet = `${match[0]}\n    // Expo monorepo Metro root on Windows can make generated relative entry paths invalid.\n    ${WINDOWS_ENTRY_FIX_MARKER}`;

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

const hasArchitectureOverride = tasks.some((task) => task.includes("reactNativeArchitectures"));
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
