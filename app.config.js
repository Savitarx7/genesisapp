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
      // Temporarily comment out if Firebase plugins are problematic
      // googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads.',
        GADApplicationIdentifier: 'ca-app-pub-5506676208773786~5792481604', // Keep this for iOS AdMob native config
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      // Temporarily comment out if Firebase plugins are problematic
      // googleServicesFile: './google-services.json',
    },
    web: {
      bundler: 'metro',
    },
    // IMPORTANT: The 'plugins' array is COMPLETELY REMOVED here
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      reactNativeGoogleMobileAds: { // Keep this for JS code to access IDs
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604',
        android_app_id: 'ca-app-pub-5506676208773786~4366691423'
      }
    },
    jsEngine: 'hermes',
  },
};