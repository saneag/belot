# How to run the app

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open your emulator or connect your mobile device

# How to build the app (android)

1. Run `npm run prebuild:android` to prepare the android build
2. Add your keystore file to the `android/app` directory
3. Update the `android/app/build.gradle` file with your keystore information
4. Update the `android/gradle.properties` file with your keystore passwords
5. Run `npm run android:apk:release` to build the release APK
6. The APK file will be located in `android/app/build/outputs/apk/release
7. You can now distribute the APK file
