// plugins/with-admob-app-id.js
const { withInfoPlist } = require('@expo/config-plugins');

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

// Combine platform-specific plugins
const withAdMobAppId = (config) => {
  config = withAdMobIos(config);
  return config;
};

module.exports = withAdMobAppId;
