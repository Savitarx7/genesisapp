const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withCustomPodfile = (config) => {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (!contents.includes('use_frameworks!')) {
        contents = contents.replace(
          /use_expo_modules!\(\)/,
          `use_expo_modules!()\n  use_frameworks! :linkage => :static`
        );
      }

      const lines = contents.split('\n');
      const patchedLines = lines.map((line) => {
        if (
          line.includes("pod 'FirebaseAuth'") ||
          line.includes("pod 'FirebaseCoreInternal'") ||
          line.includes("pod 'FirebaseFirestore'") ||
          line.includes("pod 'GoogleUtilities'")
        ) {
          if (line.includes(':modular_headers => true')) {
            return line;
          }
          return line.replace(/(pod\s+['"][^'"]+['\"])/, `$1, :modular_headers => true`);
        }
        return line;
      });

      fs.writeFileSync(podfilePath, patchedLines.join('\n'));

      return cfg;
    },
  ]);
};

module.exports = withCustomPodfile;
