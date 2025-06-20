// plugins/with-remove-admob-build-phase.js
const { withXcodeProject } = require('@expo/config-plugins');

function removeGoogleMobileAdsBuildPhase(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;

    const target = xcodeProject.getFirstTarget().uuid;
    const phases = xcodeProject.get  
      BuildPhase(target, 'PBXShellScriptBuildPhase');

    if (!phases) {
      console.warn("No shell script build phases found to check for AdMob removal.");
      return config;
    }

    let foundAndRemoved = false;
    for (const uuid in phases) {
      const phase = phases[uuid];
      if (phase.shellScript && phase.shellScript.includes('[RNGoogleMobileAds] Configuration')) {
        console.log(`Removing problematic AdMob build phase: ${phase.shellScript}`);
        xcodeProject.removeBuildPhase(target, 'PBXShellScriptBuildPhase', uuid);
        foundAndRemoved = true;
        break; // Assuming there's only one such phase
      }
    }

    if (!foundAndRemoved) {
      console.warn("Did not find '[CP-User] [RNGoogleMobileAds] Configuration' build phase to remove. It might have changed or already been removed.");
    }

    return config;
  });
}

module.exports = removeGoogleMobileAdsBuildPhase;