const utils     = require('../lib/utils');
const request   = require('request');
const https     = require('https');
const vf        = require('../lib/vf');
const messages  = require('../lib/config').messages;
const fs        = require('fs');
const path      = require('path');

module.exports = function () {


    let descriptor = utils.getDescriptor();
    if(descriptor){
        vf.deploy(descriptor, (err, res) => {
            console.log('Deploying');
            if(err){
                console.log(err);
            } else {
                descriptor.id = res.overlay.id;
                utils.saveDescriptor(descriptor);

                utils.zip('**/!(*.zip)', 'overlay' ,() => {
                    console.log('Zipped');

                    fs.readFile(path.resolve('./') + '/overlay.zip', (err, data) => {
                        console.log(res.upload_url);
                        request.put({
                            url : res.upload_url,
                            body : data
                        },(err, res, body) => {
                            utils.delete(path.resolve('./') + '/overlay.zip', ()=>{});
                            if(err){
                                console.log(err);
                            }
                        });
                    })

                });
            }
        });

    } else {
        console.log(messages.missingDescriptor);
    }


};
