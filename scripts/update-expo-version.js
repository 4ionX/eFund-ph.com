const fs = require('fs');

const version = process.env.npm_package_version;

const appJsonPath = './app.json';
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

appJson.expo.version = version;

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

console.log(`✅ Updated app.json version to ${version}`);
