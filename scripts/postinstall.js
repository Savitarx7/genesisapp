const fs = require('fs');
const path = require('path');

// Destination within metro package
const destPath = path.join(__dirname, '..', 'node_modules', 'metro', 'src', 'ModuleGraph', 'worker', 'importLocationsPlugin.js');
const srcPath = path.join(__dirname, '..', 'patches', 'importLocationsPlugin.js');

if (!fs.existsSync(destPath)) {
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log('Patched importLocationsPlugin into metro.');
  } catch (err) {
    console.warn('Failed to patch importLocationsPlugin:', err);
  }
}

function patchPodspec(podspecPath, searchValue, replacement) {
  try {
    if (!fs.existsSync(podspecPath)) {
      return;
    }
    const contents = fs.readFileSync(podspecPath, 'utf8');
    if (contents.includes(replacement)) {
      return;
    }
    const updated = contents.replace(searchValue, replacement);
    fs.writeFileSync(podspecPath, updated);
    console.log(`Patched ${path.basename(podspecPath)}`);
  } catch (err) {
    console.warn(`Failed to patch ${podspecPath}:`, err);
  }
}

const expoPodspec = path.join(__dirname, '..', 'node_modules', 'expo', 'Expo.podspec');
patchPodspec(
  expoPodspec,
  'compiler_flags = get_folly_config()[:compiler_flags]',
  "compiler_flags = (defined?(get_folly_config) ? get_folly_config()[:compiler_flags] : folly_flags())"
);

const corePodspec = path.join(__dirname, '..', 'node_modules', 'expo-modules-core', 'ExpoModulesCore.podspec');
patchPodspec(
  corePodspec,
  "compiler_flags = get_folly_config()[:compiler_flags] + ' ",
  "compiler_flags = (defined?(get_folly_config) ? get_folly_config()[:compiler_flags] : folly_flags()) + ' "
);
