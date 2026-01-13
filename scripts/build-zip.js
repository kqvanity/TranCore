// scripts/build-zip.js
const { zip } = require('zip-a-folder');
const pkg = require('../package.json');

const main = async () => {
    const sourceDir = 'dist';
    const outputZip = `${pkg.name}-firefox-${pkg.version}.zip`;
    await zip(sourceDir, outputZip);
    console.log(`Successfully created ${outputZip}`);
};

main();
