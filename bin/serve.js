const ngrok             = require('ngrok');
const dir               = require('path').resolve('./');
const vf                = require('../lib/vf');
const defaultPort       = require('../lib/config').defaultServePort;
const keepAliveInterval = require('../lib/config').keepAliveInterval;
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const messages          = require('../lib/config').messages;
const browserSync       = require('browser-sync').create();

module.exports = (directory) => {
    let descriptor = utils.getDescriptor();
    let servedOverlay = {};
    let port = directory.port || defaultPort;
    let path = dir + (directory.path || '');
    let entry = directory.entry || descriptor? descriptor.main : null || 'index.html';

    browserSync.init({
        server  : true,
        port    : port,
        open    : false,
        ui      : false,
        index   : entry,
        logLevel: "silent",
        watch   : true,
    }, async function (err) {
        if(err){
            logger.error(err);
        } else {
            logger.success('Serving: ' + path + '/' + entry);
            logger.info('Local:            http://localhost:' + port);

            try{
                const url = await ngrok.connect(port);
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

            } catch(err){
                logger.error(err);
            }
        }
    });

    process.on('SIGINT', () => {
        delete servedOverlay.url;
        vf.serve('tear_down', servedOverlay).then(() => {
            process.exit();
        }).catch(() => {
            process.exit();
        }).finally(()=> {
            process.exit();
        });
    });

    //Keep alive loop
    try {
        setInterval(function () {
            var overlayToSend = Object.assign({}, servedOverlay);
            delete overlayToSend.url;
            vf.serve('keep_alive', overlayToSend);
        }, keepAliveInterval);
    } catch (err) {
        logger.error(err);
    }
};