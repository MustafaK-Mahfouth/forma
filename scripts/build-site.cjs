const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const file of ['index.html', 'style.css']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
for (const directory of ['assets', 'js']) {
  fs.cpSync(path.join(root, directory), path.join(out, directory), { recursive: true });
}
console.log('Website packaged in dist/');
