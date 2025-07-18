// plugins/with-admob-app-id.js
const { withInfoPlist, withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

// Function to modify Info.plist for iOS
const withAdMobIos = (config) => {
  return withInfoPlist(config, (cfg) => {
    const adMobAppId = config.extra?.reactNativeGoogleMobileAds?.ios_app_id;
    if (adMobAppId) {
      cfg.modResults.GADApplicationIdentifier = adMobAppId;
    } else {
      console.warn("AdMob iOS App ID not found in config.extra.reactNativeGoogleMobileAds.ios_app_id");
    }
    return cfg;
  });
};

// Function to modify AndroidManifest.xml for Android
const withAdMobAndroid = (config) => {
  return withAndroidManifest(config, (cfg) => {
    const adMobAppId = config.extra?.reactNativeGoogleMobileAds?.android_app_id;
    if (adMobAppId) {
      try {
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
        AndroidConfig.Manifest.addMetaDataItemToMainApplication(mainApplication,
          'com.google.android.gms.ads.APPLICATION_ID',
          adMobAppId,
        );
      } catch (error) {
        console.warn('Failed to add AdMob App ID to AndroidManifest:', error.message);
      }
    } else {
      console.warn('AdMob Android App ID not found in config.extra.reactNativeGoogleMobileAds.android_app_id');
    }
    return cfg;
  });
};

// Combine both platform-specific plugins
const withAdMobAppId = (config) => {
  config = withAdMobIos(config);
  config = withAdMobAndroid(config);
  return config;
};

module.exports = withAdMobAppId;