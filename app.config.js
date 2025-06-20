export default {
  expo: {
    name: 'GenesisApp',
    slug: 'GenesisApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.adrianpavlick8.genesisapp',
      buildNumber: '1',
      supportsTablet: true,
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads.',
        // ADD THIS LINE FOR IOS ADMOB APP ID
        GADApplicationIdentifier: 'ca-app-pub-5506676208773786~5792481604',
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      googleServicesFile: './google-services.json',
      // For Android, direct manifest modification for meta-data is complex in app.config.js.
      // You'll still need the react-native-google-mobile-ads package installed (npm install)
      // for its native code, but its plugin will remain commented out.
      // The `AndroidConfig.Manifest.addMetaDataItemToApplication` from config-plugins
      // is usually how this is done programmatically, but we're trying to avoid plugin issues.
      // We'll rely on the package itself trying to find a default if this fails.
    },
    web: {
      bundler: 'metro',
    },
    // Only your custom Podfile plugin is UNCOMMENTED here
    // expo-build-properties is also problematic, so we'll comment it out for now.
    plugins: [
      // 'react-native-google-mobile-ads', // Still COMMENTED OUT
      // [ // expo-build-properties is now COMMENTED OUT (it caused issues earlier too)
      //   'expo-build-properties',
      //   {
      //     ios: {
      //       useFrameworks: 'static',
      //     },
      //   },
      // ],
      './plugins/with-custom-podfile.js', // UNCOMMENTED
    ],
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      // Keep AdMob App IDs here, useful for JS runtime and as a fallback
      reactNativeGoogleMobileAds: {
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604', // Your actual iOS AdMob App ID
        android_app_id: 'ca-app-pub-5506676208773786~4366691423' // Your actual Android AdMob App ID
      }
    },
    jsEngine: 'hermes',
  },
};