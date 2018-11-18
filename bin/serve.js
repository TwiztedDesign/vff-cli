const ngrok             = require('ngrok');
const dir               = require('path').resolve('./');
const vf                = require('../lib/vf');
const utils             = require('../lib/utils');
const config            = utils.config();
const defaultPort       = config.defaultServePort;
const keepAliveInterval = config.keepAliveInterval;
const logger            = require('../lib/logger');
const messages          = config.messages;
const tearDownTimeout   = config.tearDownTimeout;
const browserSync       = require('browser-sync').create();
const descriptor        = utils.getDescriptor();

module.exports = (directory) => {

    if(!descriptor) {
        return logger.error(messages.serveWithoutInit);
    }
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
                const ngrokKey = url.replace("https://", "").split('.')[0];
                logger.info('Remote:           ' + url);
                logger.info('Videoflow:        https://dev.videoflow.io/' + ngrokKey + '/');

                vf.serve(url,descriptor)
                    .then((res) => {
                        let overlay = res.data.overlay;
                        descriptor.serve_id = overlay.id;
                        utils.saveDescriptor(descriptor);

                        logger.success(messages.serveSuccess);
                    })
                    .catch((err) => {
                        if(err.response && err.response.status === 401){
                            logger.warn(messages.serveNoAuth);
                        }else{
                            logger.error(err);
                        }
                    });

            } catch(err){
                logger.error(messages.ngrokError);
            }
        }
    });

    function tearDown() {
        logger.run('Stopping...');
        vf.serve('tear_down', descriptor || {}).then(() => {
            logger.done();
            process.exit();
        }).catch((err) => {
            logger.done({});
            logger.error(`Error - ${err}`);
            process.exit();
        });

        setTimeout(() => {
            logger.done({});
            logger.error("Timeout - No response from server");
            process.exit();
        }, tearDownTimeout);
    }

    process.on('SIGINT', () => {
        tearDown();
    });
    process.on("SIGTERM", function() {
        tearDown();
    });
    process.on("SIGUSR2", function() {
        tearDown();
    });

    //Keep alive loop
    setInterval(function () {
        vf.serve('keep_alive', descriptor);
    }, keepAliveInterval);
};