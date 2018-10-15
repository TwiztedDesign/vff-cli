const utils     = require('../lib/utils');
const logger    = utils.logger;
const vf        = require('../lib/vf');
const messages  = require('../lib/config').messages;
const fs        = require('fs');
const path      = require('path');

module.exports = function () {
    logger.run("Deploying");
    let descriptor = utils.getDescriptor();
    if(descriptor){
        vf.deploy(descriptor, (err, res) => {
            if(err){
                console.log(err);
                logger.done();
            } else {
                descriptor.id = res.overlay.id;
                utils.saveDescriptor(descriptor);
                logger.run('Compressing');
                utils.zip('**/!(*.zip)', 'overlay' ,() => {
                    logger.run('Uploading');
                    fs.readFile(path.resolve('./') + '/overlay.zip', (err, data) => {
                        utils.upload(res.upload_url, data, (err, res, body) => {
                            utils.delete(path.resolve('./') + '/overlay.zip', ()=>{});
                            // utils.unzip('overlay');
                            if(err){
                                logger.error(err);
                            }
                            logger.done();
                        });
                    })
                });
            }
        });
    } else {
        logger.error(messages.missingDescriptor);
        logger.done();
    }
};
