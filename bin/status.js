const logger        = require('../lib/logger');
const vf            = require('../lib/vf');
const utils         = require('../lib/utils');

module.exports = function () {

    vf.getUser().then(function(res){
        logger.info("Logged in as: " + res.data.local.email);
    }).catch(function(){
        logger.info("Not logged in");
    });

    logger.info("Server URL: " + utils.getBaseUrl());
};
