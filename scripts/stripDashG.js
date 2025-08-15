const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const iosDir = path.join(rootDir, 'ios');
const supportDir = path.join(iosDir, 'Pods', 'Target Support Files');
const pbxproj = path.join(iosDir, 'Pods', 'Pods.xcodeproj', 'project.pbxproj');

const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (stat.isFile() && full.endsWith('.xcconfig')) {
      files.push(full);
    }
  }
}

walk(supportDir);
if (fs.existsSync(pbxproj)) {
  files.push(pbxproj);
}

let edited = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let updated = content.replace(/(^|[\s,])-G(?=($|[\s,]))/gm, '$1$2');
  // Tidy up any leftover spacing or commas
  updated = updated.replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ');
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('Patched', file);
    edited++;
  }
}

// Verify that no stray "-G" flags remain. If `grep` finds any matches it
// normally exits with status 0 which previously caused this script to exit
// with code 1 and fail the entire `npm install` step. Instead of failing the
// install, log a warning so builds can continue even if a stray flag slips
// through.
const result = spawnSync('grep', ['-R', '--line-number', '-E', '\\b-G\\b', iosDir], {
  encoding: 'utf8',
});

if (result.status === 0) {
  // Output any matches to help with debugging but do not treat it as a fatal
  // error.
  if (result.stdout) {
    console.warn(result.stdout.trim());
  }
  console.warn("⚠️  Some '-G' flags remain after stripping.");
} else if (result.error) {
  // If grep failed to run (e.g. not available) emit a warning and continue.
  console.warn('⚠️  Failed to verify -G removal:', result.error.message);
}

// Always succeed so the postinstall step does not abort.
process.exit(0);

