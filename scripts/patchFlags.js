const fs = require('fs');
const path = require('path');

const roots = ['ios', 'ios/Pods'];
const targets = [];
function collect(p) {
  if (!fs.existsSync(p)) return;
  const st = fs.lstatSync(p);
  if (st.isFile()) {
    if (/\.(xcconfig|pbxproj)$/.test(p)) targets.push(p);
  } else if (st.isDirectory()) {
    for (const f of fs.readdirSync(p)) collect(path.join(p, f));
  }
}
roots.forEach(collect);

let patched = 0;
for (const f of targets) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  // Remove standalone "-G" in flags (keep lowercase "-g")
  s = s.replace(/(^|[\s,])\-G(?=($|[\s,]))/g, '$1');
  // Tidy spaces/commas
  s = s.replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ');
  if (s !== before) { fs.writeFileSync(f, s); patched++; console.log('Patched:', f); }
}
console.log(patched ? `✅ Removed '-G' from ${patched} file(s).` : 'ℹ️ No -G flags found.');
