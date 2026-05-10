# How to run the app

1. Clone the repository (on **Windows**, use a short path like `C:\dev\belot` to avoid path length limits)
2. From the repo root run `pnpm install`, then `cd apps/mobile`
3. Run `pnpm run dev` to start the development server
4. Open your emulator or connect your mobile device

**First time after Metro/config changes:** run `npx expo start --clear` once to clear the Metro cache.

# How to build the app (Android)

**Local build:**

1. Keep the same keystore in `android/app/my-release-key.keystore` for every release build
2. Add your keystore file to the `android/app` directory
3. Update the `android/gradle.properties` file with your keystore passwords
4. Run `pnpm run android:apk:release` to build the release APK
5. `android.versionCode` in `app.json` is auto-incremented before each release build
6. The APK file will be in `android/app/build/outputs/apk/release/`
7. Install it on your phone as an update (same package + same signing key + higher versionCode)

If you install through `adb`, use replace mode:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

**EAS Build (expo.dev):** From `apps/mobile` run `eas build --platform android --profile preview` (or use the Expo dashboard). The project uses a minimal Metro config compatible with EAS cloud builds.
