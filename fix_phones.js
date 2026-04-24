import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/671116107/g, '692736822');
content = content.replace(/671 116 107/g, '692 736 822');
fs.writeFileSync('src/App.tsx', content);
console.log('Done replacing phone numbers.');
