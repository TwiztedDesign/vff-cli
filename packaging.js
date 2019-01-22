const pkg         = require('pkg');
const fs          = require('fs');

console.log('=========== Starting Packaging ============');
pkg.exec(['./package.json', '--target', 'win', '--out-path', './packs']).then(() => {

    fs.rename('./packs/vff-cli.exe', './packs/vff.exe', () => {
        console.log('==============    Done    ===============');
    });
});