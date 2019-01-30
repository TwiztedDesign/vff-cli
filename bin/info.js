const logger        = require('../lib/logger');
const utils         = require('../lib/utils');
const descriptor    = utils.getDescriptor();

module.exports = function () {
    if(descriptor){
        logger.info("Overlay name: " + descriptor.name);
    } else {
        logger.info("Overlay not initialized");
    }
};
