export default {
  expo: {
    name: 'GenesisApp',
    slug: 'GenesisApp',
    version: '1.0.1',
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
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        // GADApplicationIdentifier:
        //   process.env.EXPO_PUBLIC_IOS_ADMOB_APP_ID ||
        //   'ca-app-pub-3940256099942544~1458002511',
        // NSUserTrackingUsageDescription:
        //   'This identifier will be used to deliver personalized ads to you.',
      },
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
    },
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            useModularHeaders: true,
          },
        },
      ],
      // [
      //   'react-native-google-mobile-ads',
      //   {
      //     iosAppId:
      //       process.env.EXPO_PUBLIC_IOS_ADMOB_APP_ID ||
      //       'ca-app-pub-3940256099942544~1458002511',
      //     androidAppId:
      //       process.env.EXPO_PUBLIC_ANDROID_ADMOB_APP_ID ||
      //       'ca-app-pub-3940256099942544~3347511713',
      //   },
      // ],
    ],
  },
};
