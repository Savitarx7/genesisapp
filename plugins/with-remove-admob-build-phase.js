// plugins/with-remove-admob-build-phase.js
const { withXcodeProject } = require('@expo/config-plugins');
// You also need to import the PBXBuildPhase type if you are directly accessing it
// It's more robust to iterate through build phases and check the type explicitly

function removeGoogleMobileAdsBuildPhase(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;

    const target = xcodeProject.getFirstTarget().uuid;
    // Iterate through all build phases for the target
    const buildPhases = xcodeProject.getBuildPhases(target); // Use getBuildPhases

    if (!buildPhases) {
      console.warn("No build phases found to check for AdMob removal.");
      return config;
    }

    let foundAndRemoved = false;
    for (const phaseUuid in buildPhases) {
      const phase = xcodeProject.get_PBXBuildPhase(phaseUuid); // Get the specific phase object

      if (phase.isa === 'PBXShellScriptBuildPhase' && phase.shellScript && phase.shellScript.includes('[RNGoogleMobileAds] Configuration')) {
        console.log(`Removing problematic AdMob build phase: ${phase.shellScript}`);
        xcodeProject.removeBuildPhase(target, phase.isa, phaseUuid); // Use phase.isa and uuid
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