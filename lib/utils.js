const archiver      = require('archiver');
const fs            = require('fs');
const path          = require('path');
const axios         = require("axios");
const logger        = require("./logger");
const config        = require('./config.json');

const homedir       = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const vffconfPath   = path.resolve(homedir + config.localConfFilename);


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
                logger.error('Invalid vff.json file: missing "name" property');
                return;
            }
            return descriptor;
        }
    },
    saveDescriptor : (descriptor, descriptorPath) => {
        descriptorPath = descriptorPath || path.resolve('./') + '/vff.json';
        fs.writeFileSync(descriptorPath, JSON.stringify(descriptor, null, 4), 'utf8', () => {});
    },
    getLocalConf : () => {
        let vffconf;
        if(fs.existsSync(vffconfPath)){
            vffconf = require(vffconfPath);
        } else {
            vffconf = {};
            fs.writeFileSync(vffconfPath, JSON.stringify(vffconf, null, 4), 'utf8', () => {});

        }
        return vffconf;
    },
    getEnvConf : function() {
        let env = this.getEnvironment();
        return this.getLocalConf()[env] || {};
    },
    getAccessToken : function() {
        return this.getEnvConf().accessToken || '';
    },
    setAccessToken : function(token) {
        let env = this.getEnvironment();
        let localConf = this.getLocalConf();
        localConf[env] = localConf[env] || {};
        localConf[env].accessToken = token;
        this.saveLocalConf(localConf);
    },
    getBaseUrl :  function(){
        return config.environments[this.getEnvironment()].url;
    },
    getEnvironment : function(){
        return this.getLocalConf().env || 'prod';
    },
    getEnvironmentSuffix : function(){
        let env = this.getEnvironment();
        return env === 'prod'? '' : `_${env}`
    },
    saveLocalConf : (conf) => {
        fs.writeFile(vffconfPath, JSON.stringify(conf, null, 4), 'utf8', () => {});
    }
};
