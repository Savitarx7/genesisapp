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
      // IMPORTANT: Firebase `googleServicesFile` paths.
      // These are usually handled by Firebase plugins. If the build fails later due to Firebase,
      // you might need to reconsider activating a Firebase config plugin, or manually patching
      // these files in a prebuild step if the plugins cause app.config.js parsing errors.
      googleServicesFile: './GoogleService-Info.plist', // Keep uncommented if this was original state
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads.',
        GADApplicationIdentifier: 'ca-app-pub-5506676208773786~5792481604', // Keep this for direct Info.plist injection for iOS AdMob
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      // IMPORTANT: Firebase `googleServicesFile` paths.
      // See comment above for iOS.
      googleServicesFile: './google-services.json', // Keep uncommented if this was original state
    },
    web: {
      bundler: 'metro',
    },
    // The Reddit fix: react-native-google-mobile-ads configuration directly under 'expo'
    'react-native-google-mobile-ads': {
      ios_app_id: 'ca-app-pub-5506676208773786~5792481604',
      android_app_id: 'ca-app-pub-5506676208773786~4366691423'
    },
    // Re-activating original plugins.
    // WARNING: This is where the 'Failed to read app config' error likely originated.
    plugins: [
      // The original 'react-native-google-mobile-ads' plugin should NOT be in this array
      // as it caused the parsing error. Its config is now handled at the 'expo' level.
      [
        'expo-build-properties', // Re-activating
        {
          ios: {
            useFrameworks: 'static', // For static frameworks (needed for Firebase/Hermes)
          },
        },
      ],
      './plugins/with-custom-podfile.js', // Re-activating your custom Podfile plugin
    ],
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      // Keep extra.reactNativeGoogleMobileAds for JavaScript runtime access
      reactNativeGoogleMobileAds: {
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604',
        android_app_id: 'ca-app-pub-5506676208773786~4366691423'
      }
    },
    jsEngine: 'hermes',
  },
};