import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const appJsonPath = path.join(appRoot, "app.json");

const raw = fs.readFileSync(appJsonPath, "utf8");
const config = JSON.parse(raw);

if (!config.expo) {
  throw new Error("Invalid app.json: missing expo key");
}

if (!config.expo.android) {
  config.expo.android = {};
}

const current = Number(config.expo.android.versionCode ?? 1);
if (!Number.isInteger(current) || current < 1) {
  throw new Error(
    `Invalid android.versionCode value: ${String(config.expo.android.versionCode)}`,
  );
}

const next = current + 1;
config.expo.android.versionCode = next;

fs.writeFileSync(appJsonPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`android.versionCode bumped: ${current} -> ${next}`);
