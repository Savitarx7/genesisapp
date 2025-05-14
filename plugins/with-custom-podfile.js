// plugins/with-custom-podfile.js
module.exports = function withCustomPodfile(config) {
  return {
    ...config,
    mods: {
      ios: {
        podfile(podfileConfig) {
          if (
            podfileConfig.contents &&
            !podfileConfig.contents.includes('use_frameworks!')
          ) {
            podfileConfig.contents = podfileConfig.contents.replace(
              /use_expo_modules!\(\)/,
              `use_expo_modules!()\n  use_frameworks! :linkage => :static\n  use_modular_headers!`
            );
          }
          return podfileConfig;
        }
      }
    }
  };
};
