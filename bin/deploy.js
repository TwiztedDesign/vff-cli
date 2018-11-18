const utils     = require('../lib/utils');
const logger    = require('../lib/logger');
const vf        = require('../lib/vf');
const config    = utils.config();
const messages  = config.messages;
const fs        = require('fs');
const path      = require('path');

const STATUS_ACTIVE     = 'active';
const archiveName       = 'overlay';
const archiveExtension  = 'zip';
const archiveMime       = 'application/zip';


module.exports = function () {
    logger.run("Verifying");
    let descriptor = utils.getDescriptor();
    if(descriptor){
        vf.deploy(descriptor, archiveMime).then(res => {
            descriptor.id = res.data.overlay.id;
            utils.saveDescriptor(descriptor);
            logger.run('Compressing');
            utils.zip('**/!(*.'+ archiveExtension +')', archiveName ,() => {
                logger.run('Uploading');
                const file = fs.readFileSync(path.resolve('./') + '/' + archiveName + '.' + archiveExtension);

                utils.upload(res.data.upload_url, file, archiveMime).then(() => {
                    descriptor.status = STATUS_ACTIVE;
                    vf.update(descriptor);
                    utils.delete(path.resolve('./') + '/' + archiveName + '.' + archiveExtension);
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
