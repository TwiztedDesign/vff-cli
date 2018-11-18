const logger        = require('../lib/logger');
const vf            = require('../lib/vf');
const utils         = require('../lib/utils');
const config        = utils.config();
const descriptor    = utils.getDescriptor();

module.exports = function () {

    if(descriptor){
        logger.info("Overlay name: " + descriptor.name);
    } else {
        logger.info("Overlay not initialized");
    }

    vf.getUser().then(function(res){
        logger.info("Logged in as: " + res.data.local.email);
    }).catch(function(){
        logger.info("Not logged in");
    });

    logger.info("Server URL: " + config.baseUrl);
};
