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
    let servedOverlay = {};
    let port = directory.port || defaultPort;
    let path = dir + (directory.path || '');
    let entry = directory.entry || descriptor? descriptor.main : null || 'index.html';
    app
        .use(express.static(path))
        .use("/", (req, res, next) => {
            if(req.path === '/'){
                res.sendFile(entry, { root: path + "/" });
            } else {
                next();
            }
        });

    app.listen(port, () => {
        logger.success('Serving: ' + path + '/' + entry);
        logger.info('Local:            http://localhost:' + port);
    }).on('error', (err) => {
        if(err.code === 'EADDRINUSE') {
            logger.error(messages.addrInUse);
        }
    });

    ngrok.connect(port, (err, url) =>{
        if (err !== null) {
            logger.error(err);
        }
        logger.info('Ngrok:            ' + url);
        logger.info('Local Videoflow:  http://localhost:3002/dev/' + url.replace("https://", "").split('.')[0] + '/');
        logger.info('Videoflow:        https://videoflow.io/dev/' + url.replace("https://", "").split('.')[0] + '/');
        vf.serve(url,descriptor)
            .then((response) => {
                servedOverlay = response.data.overlay;
                logger.success(messages.serveSuccess);
            })
            .catch((err) => {
                if(err.response.status === 401){
                    logger.warn(messages.serveNoAuth);
                }
            });
    });

    process.on('SIGINT', () => {
        delete servedOverlay.url;
        vf.serve('tear_down', servedOverlay).then(() => {
            process.exit();
        }).catch(() => {
            process.exit();
        });
    })
};