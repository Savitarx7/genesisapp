export default {
  // ADD THE react-native-google-mobile-ads CONFIG AT THE ROOT LEVEL HERE
  // This is how it's done in the official example from GitHub
  'react-native-google-mobile-ads': {
    ios_app_id: 'ca-app-pub-5506676208773786~5792481604', // Your actual iOS AdMob App ID
    android_app_id: 'ca-app-pub-5506676208773786~4366691423' // Your actual Android AdMob App ID
  },
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
      // googleServicesFile commented out as its plugin is not active
      // We will address Firebase setup after confirming AdMob
      // googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSUserTrackingUsageDescription:
          'This identifier will be used to deliver personalized ads.',
        // GADApplicationIdentifier is removed here as per Vu Tran's advice (it might be ignored if the root config works)
        // GADApplicationIdentifier: 'ca-app-pub-5506676208773786~5792481604',
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      // googleServicesFile commented out as its plugin is not active
      // googleServicesFile: './google-services.json',
    },
    web: {
      bundler: 'metro',
    },
    // IMPORTANT: The 'plugins' array is NOT PRESENT, as it caused parsing issues
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      // Keep extra.reactNativeGoogleMobileAds for JS runtime access and as fallback
      reactNativeGoogleMobileAds: {
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604',
        android_app_id: 'ca-app-pub-5506676208773786~4366691423'
      }
    },
    jsEngine: 'hermes',
  },
};