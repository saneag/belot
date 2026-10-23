import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, "..");
const androidRoot = path.join(mobileRoot, "android");
const gradlePropertiesPath = path.join(androidRoot, "gradle.properties");

const {
  ANDROID_KEYSTORE_BASE64,
  ANDROID_KEYSTORE_PASSWORD,
  ANDROID_KEY_ALIAS,
  ANDROID_KEY_PASSWORD,
} = process.env;

if (!ANDROID_KEYSTORE_BASE64) {
  console.log("No release keystore configured; APK will use debug signing.");
  process.exit(0);
}

for (const [name, value] of [
  ["ANDROID_KEYSTORE_PASSWORD", ANDROID_KEYSTORE_PASSWORD],
  ["ANDROID_KEY_ALIAS", ANDROID_KEY_ALIAS],
  ["ANDROID_KEY_PASSWORD", ANDROID_KEY_PASSWORD],
]) {
  if (!value) {
    throw new Error(`Missing ${name} while ANDROID_KEYSTORE_BASE64 is set`);
  }
}

fs.writeFileSync(
  path.join(androidRoot, "app", "release.keystore"),
  Buffer.from(ANDROID_KEYSTORE_BASE64, "base64"),
);

fs.appendFileSync(
  gradlePropertiesPath,
  [
    "",
    "MYAPP_UPLOAD_STORE_FILE=release.keystore",
    `MYAPP_UPLOAD_STORE_PASSWORD=${ANDROID_KEYSTORE_PASSWORD}`,
    `MYAPP_UPLOAD_KEY_ALIAS=${ANDROID_KEY_ALIAS}`,
    `MYAPP_UPLOAD_KEY_PASSWORD=${ANDROID_KEY_PASSWORD}`,
    "",
  ].join("\n"),
);

console.log("Installed Android release keystore and Gradle properties.");
