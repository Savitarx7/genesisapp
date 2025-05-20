// app.config.js
export default {
  expo: {
    name: "GenesisApp",
    slug: "GenesisApp",
    version: "0.0.5",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    assetBundlePatterns: ["**/*"],
    jsEngine: "hermes",
    platforms: ["ios"],
    ios: {
      bundleIdentifier: "com.adrianpavlick8.genesisapp",
      supportsTablet: true,
      buildNumber: "5",
      config: {
        googleMobileAdsAppId: "ca-app-pub-5506676208773786~4816873092"
      },
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads."
      }
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      ["expo-build-properties", { ios: { useFrameworks: "static" } }],
      "./plugins/with-custom-podfile.js"
    ],
    extra: {
      eas: {
        projectId: "f0fad71c-a7c9-4c22-9356-33a6ca1b0c32"
      }
    }
  }
};
