const utils     = require('./utils');
const baseUrl   = utils.getBaseUrl();

const
    loginUrl  = 'login',
    serveUrl = 'api/overlay/serve',
    deployUrl = 'api/overlay/deploy',
    updateUrl = 'api/overlay',
    getUserUrl = 'api/user/me';
const messages  = require('./config').messages;
const axios     = require("axios");
const logger    = require('./logger');

module.exports = {

    login : (email, password) => {

        axios.post(baseUrl + loginUrl, {email : email, password : password, remember_me : true})
            .then((res) => {
                utils.setAccessToken(res.data.access_token);
                logger.success(messages.authSuccess);
            })
            .catch(() => {
                logger.error(messages.authFail);
            });
    },

    logout : () => {
        utils.setAccessToken('');
        logger.success(messages.logoutSuccess);
    },

    serve : (url, descriptor) => {
        let overlay = Object.assign({url : url}, descriptor);
        return axios.post(baseUrl + serveUrl, {
            overlay : overlay
        }, {
            headers: {
                'x-access-token': utils.getAccessToken()
            }
        });
    },

    deploy : (descriptor, filetype) => {
        let overlay = Object.assign({filetype : filetype}, descriptor);
        return axios.post(baseUrl + deployUrl, {overlay : overlay}, {
            headers: {
                'x-access-token': utils.getAccessToken()
            }
        });
    },

    update : (descriptor) => {
        return axios.post(baseUrl + updateUrl, {overlay : descriptor}, {
            headers: {
                'x-access-token': utils.getAccessToken()
            }
        });
    },

    getUser : () => {
        return axios.get(baseUrl + getUserUrl, {
            headers: {
                'x-access-token': utils.getAccessToken()
            }
        });
    }
};