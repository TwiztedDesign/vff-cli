const express       = require('express');
const ngrok         = require('ngrok');
const app           = express();
const dir           = require('path').resolve('./');
const vf            = require('../lib/vf');
const defaultPort   = require('../lib/config').defaultServePort;
const utils         = require('../lib/utils');
const logger        = require('../lib/logger');
const messages      = require('../lib/config').messages;

module.exports = (directory) => {
    let descriptor = utils.getDescriptor();
    let port = directory.port || defaultPort;
    let path = dir + (directory.path || '');
    let entry = directory.entry || descriptor? descriptor.main : null || 'index.html';
    app
        .use(express.static(path))
        .use("/", function(req, res, next){
            if(req.path === '/'){
                res.sendFile(entry, { root: path + "/" });
            } else {
                next();
            }
        });

    app.listen(port, function() {
        logger.success('Serving: ' + path + '/' + entry);
        logger.info('Local: http://localhost:' + port);
        ngrok.connect(port,function (err, url){
            if (err !== null) {
                logger.error(err);
            }
            logger.info('Ngrok: ' + url);
            vf.serve(url,descriptor)
                .then(() => {
                    logger.success(messages.serveSuccess);
                })
                .catch((err) => {
                    if(err.response.status === 401){
                        logger.warn(messages.serveNoAuth);
                    }
                });
        });
    });

    process.on('SIGINT', function() {
        vf.serve('tear_down', {}).then(() => {
            process.exit();
        }).catch(() => {
            process.exit();
        });
    })
};