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
  const updated = content.replace(/\s-G(\s|$)/g, ' $1');
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('Patched', file);
    edited++;
  }
}

const result = spawnSync('grep', ['-R', '--line-number', '-E', '\\b-G\\b', iosDir], { stdio: 'inherit' });
if (result.status === 0) {
  process.exit(1);
}
process.exit(0);

