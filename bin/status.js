const logger        = require('../lib/logger');
const vf            = require('../lib/vf');
const utils         = require('../lib/utils');

module.exports = async function () {
    try {
        let user = await vf.getUser();
        logger.info("Logged in as: " + user.data.local.email);
    }catch (e) {
        logger.info("Not logged in");
    }
    logger.info("Server URL: " + utils.getBaseUrl());
};
