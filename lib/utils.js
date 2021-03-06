const archiver                  = require('archiver');
const fs                        = require('fs');
const os                        = require('os');
const path                      = require('path');
const axios                     = require("axios");
const logger                    = require("./logger");
const config                    = require('./config.json');
const maxFileSizeForDeployInMb  = config.maxFileSizeForDeployInMb;


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
        console.log('uploading');
        return axios.put(url, file, {
            headers: {'Content-Type': mime},
            maxContentLength: maxFileSizeForDeployInMb * 1024 * 1024
        });
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
    },
    retry : (attempt, maxRetries) => async (...args) => {
        const delay = 500;
        let retryCount = 0;
        do {
            try {
                return await attempt(...args);
            } catch (error) {
                const isLastAttempt = retryCount === maxRetries;
                if (isLastAttempt) {
                    return Promise.reject(error);
                }
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        } while (retryCount++ < maxRetries);
    },
    getLocalIP : function(){
        let ifaces = os.networkInterfaces();

        for (let arr of Object.values(ifaces)) {
            for (let iface of arr) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    continue;
                }
                return iface.address;
            }
        }
    }
};

