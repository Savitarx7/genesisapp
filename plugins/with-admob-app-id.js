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
      // Ensure the <application> tag exists
      const application = AndroidConfig.Manifest.getApplication(cfg.modResults);
      if (application) {
        AndroidConfig.Manifest.addMetaDataItem(
          application,
          'com.google.android.gms.ads.APPLICATION_ID',
          adMobAppId,
        );
      } else {
        console.warn("Android <application> tag not found in manifest.");
      }
    } else {
      console.warn("AdMob Android App ID not found in config.extra.reactNativeGoogleMobileAds.android_app_id");
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
