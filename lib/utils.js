const archiver  = require('archiver');
const fs        = require('fs');
const path      = require('path');
const axios     = require("axios");
const logger    = require("./logger");

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

    upload : (url, file, mime) => {
        return axios.put(url, file, {headers: {'Content-Type': mime}});
    },

    delete : (path, cb) => {
        fs.unlink(path, cb || (()=>{}));
    },

    getDescriptor : () => {
        let descriptorPath = (path.resolve('./') + '/vff.json');
        if(fs.existsSync(descriptorPath)) {
            let descriptor = require(descriptorPath);
            if(!descriptor.name){
                logger.error('Invalide vff.json file: missing "name" propertry');
                return;
            }
            return descriptor;
        }
    },

    saveDescriptor : (descriptor) => {
        fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(descriptor, null, 4), 'utf8', () => {});
    },

    saveLocalConfig : (config) => {
        fs.writeFile(path.resolve(__dirname) + '/config.local.json', JSON.stringify(config, null, 4), 'utf8', () => {});
    },

    config : () => {
        let config = require('./config.json');
        let localConfig = {};
        try {
            localConfig = require('./config.local.json');
        } catch (e) {

        }
        return Object.assign(config, localConfig);
    },

    localConfig : () =>{
        let localConfig = {};
        try {
            localConfig = require('./config.local.json');
        } catch (e) {

        }
        return localConfig;
    }
};
