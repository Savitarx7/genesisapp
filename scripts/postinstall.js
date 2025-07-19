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
