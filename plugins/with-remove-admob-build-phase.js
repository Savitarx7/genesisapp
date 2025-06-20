// plugins/with-remove-admob-build-phase.js
const { withXcodeProject } = require('@expo/config-plugins');

function removeGoogleMobileAdsBuildPhase(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const targetUuid = xcodeProject.getFirstTarget().uuid; // Get the main target UUID

    let foundAndRemoved = false;
    const buildPhaseSection = xcodeProject.pbxBuildPhaseSection(); // Get all build phases

    for (const uuid in buildPhaseSection) {
      // Skip comments or non-phase properties
      if (uuid.endsWith('_comment')) continue;

      const phase = buildPhaseSection[uuid];

      // Check if it's a shell script build phase and contains the problematic script
      if (phase.isa === 'PBXShellScriptBuildPhase' && phase.shellScript && phase.shellScript.includes('[RNGoogleMobileAds] Configuration')) {
        console.log(`Removing problematic AdMob build phase: ${phase.shellScript}`);
        
        // Remove the phase reference from the target's build phases list
        const buildPhases = xcodeProject.getBuildPhase(targetUuid); // This gets the array of build phase UUIDs for the target
        if (buildPhases) {
          const phaseIndex = buildPhases.indexOf(uuid);
          if (phaseIndex > -1) {
            buildPhases.splice(phaseIndex, 1);
          }
        }
        
        // Also remove the actual build phase object from the section
        delete buildPhaseSection[uuid];
        delete buildPhaseSection[uuid + '_comment']; // Remove its comment too if present

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