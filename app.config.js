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
      // googleServicesFile: './GoogleService-Info.plist', // Commented out temporarily
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads.',
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      // googleServicesFile: './google-services.json', // Commented out temporarily
    },
    web: {
      bundler: 'metro',
    },
    // IMPORTANT: No plugins array here
    extra: { // ADD THIS 'extra' OBJECT BACK
      eas: {
        projectId: "f0fad71c-a7c9-4c22-9356-33a6ca1b0c32" // ADD THIS PROJECT ID
      }
    },
    jsEngine: 'hermes',
  },
};