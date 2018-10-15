const archiver  = require('archiver');
const fs        = require('fs');
const path      = require('path');
const request   = require('request');
const spinner   = require('ora')();
const chalk     = require('chalk');
const symbols   = require('./symbols');


module.exports = {

    zip : (glob, filename, cb) => {

        let output = fs.createWriteStream(path.resolve('./') + '/' + filename + '.zip');
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        output.on('close', function() {
            cb();
        });

        output.on('end', function() {
            cb();
        });

        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(output);
        archive.glob(glob);

        archive.finalize();

    },

    upload : (url, file, cb) => {
        request.put({
            url : url,
            body : file
        }, cb);
    },

    delete : (path, cb) => {
        fs.unlink(path, cb);
    },

    getDescriptor : () => {
        let descriptorPath = (path.resolve('./') + '/vff.json');
        if(fs.existsSync(descriptorPath)) {
            let descriptor = require(descriptorPath);
            if(!descriptor.name){
                console.log('Invalide vff.json file');
                console.log('missing "name" propertry');
                return;
            }
            return descriptor;
        }
    },
    saveDescriptor : (descriptor) => {
        fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(descriptor, null, 4), 'utf8', () => {});
    },

    logger : {
        error : (msg) => {
            console.log(symbols.error, chalk.red(msg));
        },
        log : (msg) => {
            spiner.text = msg;
        },
        run : (msg) => {
            if(spinner.isSpinning){
                spinner.stopAndPersist({
                    symbol : symbols.success
                });
            }
            spinner.text = msg;
            spinner.start();
        },
        done : (err) => {
            spinner.stopAndPersist({
                symbol : err? symbols.error : symbols.success
            });
        }
    }

};
