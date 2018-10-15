const archiver  = require('archiver');
const fs        = require('fs');
const path      = require('path');
const request   = require('request');

module.exports = {

    zip : (glob, filename, cb) => {

        let output = fs.createWriteStream(path.resolve('./') + '/' + filename + '.zip');
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            cb();
        });

        output.on('end', function() {
            console.log('Data has been drained');
            cb();
        });


        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);
        archive.glob(glob);

        archive.finalize();

    },

    upload : (url) => {

    },

    delete : (path, cb) => {
        fs.unlink(path, cb);
    },

    getDescriptor : () => {
        var descriptorPath = (path.resolve('./') + '/vff.json');
        console.log(descriptorPath);
        if(fs.existsSync(descriptorPath)) {
            let descriptor = require(descriptorPath);
            if(!descriptor.name){
                console.log('Invalide vff.json file');
                console.log('missing "name" propertry');
                return;
            }
            return descriptor;
        };
    },
    saveDescriptor : (descriptor) => {
        console.log('Saving vff.json', descriptor, 'to path:', path.resolve('./') + '/vff.json');
        fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(descriptor, null, 4), 'utf8', () => {});
    }
};
