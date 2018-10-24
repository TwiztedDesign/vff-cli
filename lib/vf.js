const fs        = require('fs');
const baseUrl   = require('./config').baseUrl;
const credPath  = require('./config').credentials;
const loginUrl  = 'login', serveUrl = 'api/overlay/serve', deployUrl = 'api/overlay/deploy', updateUrl = 'api/overlay';
const messages  = require('./config').messages;
const axios     = require("axios");
const logger    = require('./logger');

let credentials;
try{
    credentials = require('../cred.json');
} catch(err){
    credentials = {};
}

module.exports = {

    login : (email, password) => {
        let credFile = {};
        axios.post(baseUrl + loginUrl, {email : email, password : password, remember_me : true})
            .then((res) => {
                credFile = { access_token : res.data.access_token};
                logger.success(messages.authSuccess);
            })
            .catch(() => {
                logger.error(messages.authFail);
            })
            .then(() => {
                fs.writeFile(credPath, JSON.stringify(credFile), 'utf8', () => {});
            })
    },

    logout : () => {
        fs.writeFile(credPath, JSON.stringify({}), 'utf8', () => {});
        logger.success(messages.logoutSuccess);
    },

    serve : (url, descriptor) => {
        let overlay = Object.assign({url : url}, descriptor);
        return axios.post(baseUrl + serveUrl, {
            overlay : overlay
        }, {
            headers: {
                'x-access-token': credentials.access_token || ''
            }
        });
    },

    deploy : (descriptor) => {
        return axios.post(baseUrl + deployUrl, {overlay : descriptor}, {
            headers: {
                'x-access-token': credentials.access_token || ''
            }
        });
    },

    update : (descriptor) => {
        return axios.post(baseUrl + updateUrl, {overlay : descriptor}, {
            headers: {
                'x-access-token': credentials.access_token || ''
            }
        });
    }
};