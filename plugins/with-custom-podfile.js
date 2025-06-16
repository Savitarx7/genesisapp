module.exports = function withCustomPodfile(config) {
  return {
    ...config,
    mods: {
      ios: {
        podfile(podfileConfig) {
          if (!podfileConfig.contents.includes('use_frameworks!')) {
            podfileConfig.contents = podfileConfig.contents.replace(
              /use_expo_modules!\(\)/,
              `use_expo_modules!()\n  use_frameworks! :linkage => :static\n  use_modular_headers!`
            );
          }

          const lines = podfileConfig.contents.split('\n');
          const patchedLines = lines.map((line) => {
            if (
              line.includes("pod 'FirebaseAuth'") ||
              line.includes("pod 'FirebaseCoreInternal'") ||
              line.includes("pod 'FirebaseFirestore'") ||
              line.includes("pod 'GoogleUtilities'")
            ) {
              return line.replace(/(pod\\s+['\"][^'\"]+['\"])/, `$1, :modular_headers => true`);
            }
            return line;
          });

          podfileConfig.contents = patchedLines.join('\n');
          return podfileConfig;
        },
      },
    },
  };
};
