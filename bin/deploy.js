const utils     = require('../lib/utils');
const logger    = require('../lib/logger');
const vf        = require('../lib/vf');
const messages  = require('../lib/config').messages;
const fs        = require('fs');
const path      = require('path');
const fileType  = require('file-type');

const STATUS_ACTIVE = 'active';


module.exports = function () {
    logger.run("Verifying");
    let descriptor = utils.getDescriptor();
    if(descriptor){
        vf.deploy(descriptor).then(res => {
            descriptor.id = res.data.overlay.id;
            utils.saveDescriptor(descriptor);
            logger.run('Compressing');
            utils.zip('**/!(*.zip)', 'overlay' ,() => {
                logger.run('Uploading');
                const file = fs.readFileSync(path.resolve('./') + '/overlay.zip');
                let type = fileType(file);
                utils.upload(res.data.upload_url, file, type.mime).then(() => {
                    descriptor.status = STATUS_ACTIVE;
                    vf.update(descriptor);
                    utils.delete(path.resolve('./') + '/overlay.zip');
                }).catch(err => {
                    logger.error(err);
                }).then(logger.done);
            });
        }).catch(err => {
            if(err.response.status === 401){
                logger.error(messages.noAuth);
            } else {
                logger.error(err);
            }
        });
    } else {
        logger.error(messages.missingDescriptor);
        logger.done();
    }
};
