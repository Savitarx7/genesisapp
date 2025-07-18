const { getDefaultConfig } = require('@expo/metro-config');

// Use the default Metro configuration for Expo SDK 53
const config = getDefaultConfig(__dirname);

module.exports = config;
