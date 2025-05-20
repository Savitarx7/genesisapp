// plugins/with-custom-podfile.js
module.exports = function withCustomPodfile(config) {
  return {
    ...config,
    mods: {
      ios: {
        podfile(podfileConfig) {
          if (!podfileConfig.contents) {
            return podfileConfig; // avoid crash if contents is undefined
          }

          const lines = podfileConfig.contents.split('\n');
          const modifiedLines = lines.map(line => {
            if (line.includes('use_expo_modules!()')) {
              return `${line}\n  use_frameworks! :linkage => :static\n  use_modular_headers!`;
            }
            return line;
          });

          if (!modifiedLines.some(line => line.includes('use_modular_headers!'))) {
            modifiedLines.unshift('use_modular_headers!');
          }

          podfileConfig.contents = modifiedLines.join('\n');
          return podfileConfig;
        },
      },
    },
  };
};
