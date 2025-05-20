// plugins/with-custom-podfile.js
module.exports = function withCustomPodfile(config) {
  return {
    ...config,
    mods: {
      ios: {
        podfile(podfileConfig) {
          if (!podfileConfig.contents) {
            return podfileConfig; // Avoid crash
          }

          const lines = podfileConfig.contents.split('\n');
          const modifiedLines = [];

          for (let line of lines) {
            if (line.includes('use_expo_modules!()')) {
              modifiedLines.push('use_modular_headers!');
              modifiedLines.push('use_frameworks! :linkage => :static');
            }
            modifiedLines.push(line);
          }

          podfileConfig.contents = modifiedLines.join('\n');
          return podfileConfig;
        },
      },
    },
  };
};
