import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, "..");
const androidRoot = path.join(mobileRoot, "android");
const buildGradlePath = path.join(androidRoot, "app", "build.gradle");
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

const signingBlock = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }`;

const oldSigning = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;

const releaseBlock = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;

const patchedRelease = `        release {
            signingConfig signingConfigs.release`;

let text = fs.readFileSync(buildGradlePath, "utf8");

if (!text.includes(oldSigning)) {
  throw new Error("Could not patch signingConfigs in android/app/build.gradle");
}

text = text.replace(oldSigning, signingBlock);

if (!text.includes(releaseBlock)) {
  throw new Error("Could not find release buildType in android/app/build.gradle");
}

text = text.replace(releaseBlock, patchedRelease);

fs.writeFileSync(buildGradlePath, text);
console.log("Configured Android release signing.");
