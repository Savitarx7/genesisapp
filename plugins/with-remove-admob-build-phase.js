// plugins/with-remove-admob-build-phase.js
const { withXcodeProject } = require('@expo/config-plugins');

function removeGoogleMobileAdsBuildPhase(config) {
  return withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;
    const targetUuid = xcodeProject.getFirstTarget().uuid; // Get the main target UUID
    const target = xcodeProject.getFirstTarget().target; // Get the target object

    let foundAndRemoved = false;
    
    // Iterate directly through the PBXBuildPhase section to find the script phase
    for (const uuid in xcodeProject.hash.project.objects.PBXShellScriptBuildPhase) {
      // Skip comments or internal properties
      if (uuid.endsWith('_comment')) continue;

      const phase = xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[uuid];

      if (phase.shellScript && phase.shellScript.includes('[RNGoogleMobileAds] Configuration')) {
        console.log(`Removing problematic AdMob build phase: ${phase.shellScript}`);
        
        // Remove the phase from the target's buildPhases list
        const buildPhasesArray = xcodeProject.get    
        BuildPhase(targetUuid); // This should return the array of build phase UUIDs for the target
        if (buildPhasesArray) {
          const phaseIndex = buildPhasesArray.indexOf(uuid);
          if (phaseIndex > -1) {
            buildPhasesArray.splice(phaseIndex, 1);
          }
        }
        
        // Remove the phase object itself from the project's objects section
        delete xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[uuid];
        delete xcodeProject.hash.project.objects.PBXShellScriptBuildPhase[uuid + '_comment'];

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