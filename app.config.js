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
        NSCameraUsageDescription: 'Allow camera access for capturing photos and videos.',
        NSMicrophoneUsageDescription: 'Allow microphone access for recording audio.',
        NSPhotoLibraryUsageDescription: 'Allow access to your photo library.',
        NSPhotoLibraryAddUsageDescription: 'Allow saving images to your photo library.',
        NSBluetoothAlwaysUsageDescription: 'Allow Bluetooth to connect to nearby devices.',
        NSBluetoothPeripheralUsageDescription: 'Allow communication with Bluetooth peripherals.',
        NSLocalNetworkUsageDescription: 'Allow discovery of devices on your local network.',
        NSBonjourServices: ['_http._tcp', '_tcp'],
        NSMotionUsageDescription: 'Allow access to motion sensors.',
        NSFaceIDUsageDescription: 'Allow Face ID for authentication.',
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
    ],
  },
};
