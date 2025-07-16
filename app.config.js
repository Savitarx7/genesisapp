export default {
  expo: {
    name: 'GenesisApp',
    slug: 'GenesisApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    jsEngine: 'hermes',
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
    },
    android: {
      package: 'com.adrianpavlick8.genesisapp',
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000',
      },
    },
    web: {
      bundler: 'metro',
    },
    extra: {
      eas: {
        projectId: 'f0fad71c-a7c9-4c22-9356-33a6ca1b0c32',
      },
      // 👇 Your custom plugin reads the App IDs from here
      reactNativeGoogleMobileAds: {
        ios_app_id: 'ca-app-pub-5506676208773786~5792481604',
        android_app_id: 'ca-app-pub-5506676208773786~4366691423',
      },
    },
    plugins: [
      // ✅ Use your custom plugins
      './plugins/with-remove-admob-build-phase.js',
      './plugins/with-admob-app-id.js',

      // Your existing plugins
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
  },
};
