# How to run the app

1. Clone the repository (on **Windows**, use a short path like `C:\dev\belot` to avoid path length limits)
2. From the repo root run `pnpm install`, then `cd apps/mobile`
3. Run `pnpm run dev` to start the development server
4. Open your emulator or connect your mobile device

**First time after Metro/config changes:** run `npx expo start --clear` once to clear the Metro cache.

# How to build the app (Android)

**Local build:**

1. Go to `apps/mobile` and run `pnpm run prebuild:android`. It will generate the `android` directory with native code and configuration.
2. Add your keystore file to the `android/app` directory.
3. Update the `android/gradle.properties` file with your keystore passwords (just put at the end of the file).

   Replace the `*` values with your actual keystore information:

```
MYAPP_UPLOAD_STORE_FILE=*
MYAPP_UPLOAD_KEY_ALIAS=*
MYAPP_UPLOAD_STORE_PASSWORD=*
MYAPP_UPLOAD_KEY_PASSWORD=*
```

`MYAPP_UPLOAD_STORE_FILE` - name of your keystore file (e.g., `my-release-key.keystore`)

`MYAPP_UPLOAD_KEY_ALIAS` - alias for your signing key. This is the name you specified when you created the key in the keystore.

`MYAPP_UPLOAD_STORE_PASSWORD` - password for your keystore. You set this password when you created the keystore file.

`MYAPP_UPLOAD_KEY_PASSWORD` - password for your signing key. This is often the same as the keystore password, but it can be different if you specified a separate password for the key when you created it.

4. Run `pnpm run android:apk:release` to build the release APK
5. The APK file will be in `android/app/build/outputs/apk/release/`
6. Install it on your phone as an update

If you install through `adb`, use replace mode:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

**EAS Build (expo.dev):** From `apps/mobile` run `eas build --platform android --profile preview` (or use the Expo dashboard). The project uses a minimal Metro config compatible with EAS cloud builds.

## Dev tools password

The dev tools screen reads its password from `EXPO_PUBLIC_DEV_TOOLS_PASSWORD` at build time.

For GitHub Actions APK builds, create a repository secret named
`EXPO_PUBLIC_DEV_TOOLS_PASSWORD`. The Android workflows fail early if this secret is missing.

For EAS cloud builds, also configure `EXPO_PUBLIC_DEV_TOOLS_PASSWORD` in the Expo/EAS project
environment for the build profile you use, because public Expo variables are bundled into the app
during the remote build.
