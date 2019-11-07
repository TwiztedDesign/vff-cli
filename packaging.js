const { exec }      = require('pkg');
const fs            = require('fs');
const path          = require('path');
// const processExec   = require('child_process').exec;
const pjson         = require('./package.json');
const util          = require('util');
const processExec   = util.promisify(require('child_process').exec);

function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

async function pack(buildPath){
    console.log('=========== Starting Packaging ============');
    console.log('=========== Delete old packages ============');
    rimraf(buildPath);
    console.log('=========== Finished Delete old packages ============');

    console.log('=========== Building Window Executable ============');
    await exec(['./package.json', '--target', 'win', '--out-path', buildPath]);
    console.log('=========== Finished Building Window Executable ============');

    console.log('=========== Building MacOS Executable ============');
    await exec(['./package.json', '--target', 'macos', '--out-path', buildPath]);
    console.log('=========== Finished MacOS Executable ============');

    console.log('=========== Renaming ============');
    fs.renameSync(`${buildPath}/vff-cli.exe`, `${buildPath}/vff.exe`);
    fs.renameSync(`${buildPath}/vff-cli`, `${buildPath}/vff`);
    fs.copyFileSync(`${buildPath}/vff`, `./macos-installation-builder/application/vff`);
    console.log('=========== End Renaming ============');

    console.log('=========== Building installation ============');
    //Run this command manually bash ./macos-installation-builder/build-macos-x64.sh vff-cli <vff-cli-version>
    const { stdout, stderr } = await processExec(`bash ./build-macos-x64.sh vff-cli ${pjson.version}`, {
        cwd: './macos-installation-builder'
    });
    if(stderr) console.log(stderr);
    if(stdout) console.log(stdout);
    console.log('=========== Finished Building installation ============');

    console.log('============== Done ===============');
}

pack('./packs');
