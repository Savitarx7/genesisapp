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
    // ALL THREE PLUGINS ARE UNCOMMENTED HERE
    plugins: [
      [
        'react-native-google-mobile-ads',
        {
          ios_app_id: 'ca-app-pub-5506676208773786~5792481604', // Make sure this is your actual iOS App ID
          android_app_id: 'ca-app-pub-5506676208773786~4366691423', // Make sure this is your actual Android App ID
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      './plugins/with-custom-podfile.js',
    ],
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
    },
    jsEngine: 'hermes',
  },
};