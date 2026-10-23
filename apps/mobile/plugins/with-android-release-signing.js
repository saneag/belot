const { withAppBuildGradle } = require("expo/config-plugins");

function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    const signingConfigs = `    signingConfigs {
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
    const defaultSigningConfigs = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }`;
    const defaultReleaseSigning = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug`;
    const releaseSigning = `        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig project.hasProperty('MYAPP_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`;

    let contents = config.modResults.contents;

    if (contents.includes(defaultSigningConfigs)) {
      contents = contents.replace(defaultSigningConfigs, signingConfigs);
    }

    if (contents.includes(defaultReleaseSigning)) {
      contents = contents.replace(defaultReleaseSigning, releaseSigning);
    }

    const buildTypesStart = contents.indexOf("    buildTypes {");
    if (buildTypesStart !== -1) {
      const buildTypes = contents.slice(buildTypesStart);
      if (!/^        release \{/m.test(buildTypes)) {
        const orphanedReleaseSigning =
          /^            signingConfig project\.hasProperty\('MYAPP_UPLOAD_STORE_FILE'\).*$/m.exec(
            buildTypes,
          );
        if (orphanedReleaseSigning) {
          const insertionPoint = buildTypesStart + orphanedReleaseSigning.index;
          contents = `${contents.slice(0, insertionPoint)}        release {\n${contents.slice(insertionPoint)}`;
        }
      }
    }

    if (!contents.includes("MYAPP_UPLOAD_STORE_FILE")) {
      throw new Error("Could not configure Android release signing in android/app/build.gradle");
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidReleaseSigning;
