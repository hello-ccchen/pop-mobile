This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Start

To start React Native, you need to start the **Metro**

```bash
# using npm
npm run start
```

After the metro started, follow the metro instruction by enter i for ios, a for android.

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# Build APK Locally

To build the Android APK file locally, run the following commands in your project root:

```bash
cd android
./gradlew assembleRelease
```

> **Note:** Make sure you have a `.env` file in your project root with the required environment variables before building the APK.
> **Recommendation:** For official releases, it is preferred to use the GitHub workflow to generate the APK file. Local builds are mainly for personal testing and development purposes.

The generated APK will be located at:

```
android/app/build/outputs/apk/release/app-release.apk
```
