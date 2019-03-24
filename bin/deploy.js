const utils                         = require('../lib/utils');
const logger                        = require('../lib/logger');
const vf                            = require('../lib/vf');
const config                        = require('../lib/config');
const messages                      = config.messages;
const maxFileSizeForDeployInMb      = config.maxFileSizeForDeployInMb;
const maxRetries            = config.maxNumberOfRetries;
const fs                            = require('fs');
const path                          = require('path');
const inquirer                      = require('inquirer');
const kbInMb                        = 1000000;

const STATUS_ACTIVE     = 'active';
const archiveName       = 'overlay';
const archiveExtension  = 'zip';
const archiveMime       = 'application/zip';


function validateFileSize(filePath){
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / kbInMb;
    return fileSizeInMegabytes > maxFileSizeForDeployInMb;
}

module.exports = function () {
    logger.run("Verifying");
    let descriptor = utils.getDescriptor();
    if(descriptor){
        vf.deploy(descriptor, archiveMime).then(res => {
            descriptor[`id${utils.getEnvironmentSuffix()}`] = res.data.overlay.id;
            utils.saveDescriptor(descriptor);
            logger.run('Compressing');
            utils.zip('**/!(*.'+ archiveExtension +')', archiveName ,() => {
                let filePath = path.resolve('./') + '/' + archiveName + '.' + archiveExtension;
                //Verify the file size is not above the limit
                if(validateFileSize(filePath)){
                    logger.error(messages.servedProjectFileSizeExceeded);
                } else {
                    logger.run('Uploading');
                    const file = fs.readFileSync(filePath);
                    let uploadWithRetries = utils.retry({ attempt: utils.upload, maxRetries });
                    uploadWithRetries(res.data.upload_url, file, archiveMime).then(() => {
                        descriptor.status = STATUS_ACTIVE;
                        vf.update(descriptor);
                        utils.delete(path.resolve('./') + '/' + archiveName + '.' + archiveExtension);
                    }).catch(err => {
                        logger.error(err);
                    }).then(() => {
                        logger.done();
                        if(res.data.overlay.name_changed && !descriptor.norename){
                            logger.warn('The overlay was renamed in Videoflow');
                            inquirer
                                .prompt({ type: 'list', name: 'change', message: 'Do you want to change the name in the vff.json file:', choices: [
                                        {name : "Yes", value : "yes"},
                                        {name : "No", value : "no"},
                                        {name : "No, and don't ask me again", value : "never"},
                                    ]},)
                                .then(function (answers) {
                                    switch (answers.change){
                                        case 'yes':
                                            descriptor.name = res.data.overlay.name;
                                            descriptor.vff_name = res.data.overlay.name;
                                            utils.saveDescriptor(descriptor);
                                            logger.info("The overlay was renamed in vff.json");
                                            break;
                                        case 'no':
                                            break;
                                        case 'never':
                                            descriptor.norename = true;
                                            utils.saveDescriptor(descriptor);
                                            logger.info("You won't be bothered with this again");
                                            break;
                                    }
                                });
                        }
                    });
                }
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
