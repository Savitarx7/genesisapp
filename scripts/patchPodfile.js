const fs = require('fs');
const path = 'ios/Podfile';
if (fs.existsSync(path)) {
  let podfile = fs.readFileSync(path, 'utf8');
  // Ensure use_native_modules! has no arguments
  podfile = podfile.replace(/use_native_modules!\s*\([^)]*\)/g, 'use_native_modules!');

  // Remove privacy_file_aggregation_enabled lines
  podfile = podfile.replace(/^.*:privacy_file_aggregation_enabled\s*=>\s*.*\n?/gm, '');

  // Ensure native_modules require is present after react_native_pods require
  const rnPodsRequire = "require_relative '../node_modules/react-native/scripts/react_native_pods'";
  const nativeModulesRequire = "require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'";
  if (podfile.includes(rnPodsRequire) && !podfile.includes(nativeModulesRequire)) {
    podfile = podfile.replace(rnPodsRequire, `${rnPodsRequire}\n${nativeModulesRequire}`);
  }

  fs.writeFileSync(path, podfile);
  console.log('✅ Patched Podfile.');
}
