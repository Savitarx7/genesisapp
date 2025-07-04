const { withPodfile } = require('@expo/config-plugins');

const withCustomPodfile = (config) => {
  return withPodfile(config, (podfileConfig) => {
    // Add use_frameworks! if not present
    if (!podfileConfig.contents.includes('use_frameworks!')) {
      podfileConfig.contents = podfileConfig.contents.replace(
        /use_expo_modules!\(\)/,
        `use_expo_modules!()\n  use_frameworks! :linkage => :static`
      );
    }

    // Add :modular_headers => true to specific Firebase pods
    const lines = podfileConfig.contents.split('\n');
    const patchedLines = lines.map((line) => {
      if (
        line.includes("pod 'FirebaseAuth'") ||
        line.includes("pod 'FirebaseCoreInternal'") ||
        line.includes("pod 'FirebaseFirestore'") ||
        line.includes("pod 'GoogleUtilities'")
      ) {
        if (line.includes(':modular_headers => true')) {
          return line; // Avoids adding it twice
        }
        // Safely add the modular_headers property
        return line.replace(/(pod\s+['"][^'"]+['\"])/, `$1, :modular_headers => true`);
      }
      return line;
    });

    podfileConfig.contents = patchedLines.join('\n');
    
    return podfileConfig;
  });
};

module.exports = withCustomPodfile;