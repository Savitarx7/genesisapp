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
        GADApplicationIdentifier: 'ca-app-pub-5506676208773786~5792481604', // Keep this line for iOS AdMob
      },
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
      googleServicesFile: './google-services.json',
    },
    web: {
      bundler: 'metro',
    },
    // Add your new custom plugin here, and ensure others are uncommented as needed
    plugins: [
      // 'react-native-google-mobile-ads', // Keep this COMMENTED OUT!
      [
        'expo-build-properties', // UNCOMMENTED
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      './plugins/with-custom-podfile.js', // UNCOMMENTED
      './plugins/with-remove-admob-build-phase.js', // NEWLY ADDED AND UNCOMMENTED - This should be last
    ],
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      reactNativeGoogleMobileAds: {
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604', // Your actual iOS AdMob App ID
        android_app_id: 'ca-app-pub-5506676208773786~4366691423' // Your actual Android AdMob App ID
      }
    },
    jsEngine: 'hermes',
  },
};