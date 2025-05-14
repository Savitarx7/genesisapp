/** @type {import('metro-config').MetroConfig} */
module.exports = (async () => {
  const { getDefaultConfig } = await import('@expo/metro-config');
  const config = getDefaultConfig(__dirname);

  // Ensure support for .gif and .mp3 files
  config.resolver.assetExts.push('gif', 'mp3');

  // Optional: some Firebase modules use .cjs extensions
  if (!config.resolver.sourceExts.includes('cjs')) {
    config.resolver.sourceExts.push('cjs');
  }

  return config;
})();
