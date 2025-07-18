const { getDefaultConfig } = require('expo/metro-config');

// Get the default configuration
const config = getDefaultConfig(__dirname);

// Add 'cjs' to the source extensions
config.resolver.sourceExts.push('cjs');

// Export the modified configuration
module.exports = config;
