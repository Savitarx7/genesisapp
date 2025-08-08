const fs = require('fs');
const path = 'ios/Podfile';
if (fs.existsSync(path)) {
  let podfile = fs.readFileSync(path, 'utf8');
  podfile = podfile.replace(/use_native_modules!\s*\([^)]*\)/g, 'use_native_modules!');
  fs.writeFileSync(path, podfile);
  console.log('✅ Patched Podfile to remove config_command argument.');
}
