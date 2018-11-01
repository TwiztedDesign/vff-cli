const ngrok             = require('ngrok');
const dir               = require('path').resolve('./');
const vf                = require('../lib/vf');
const defaultPort       = require('../lib/config').defaultServePort;
const keepAliveInterval = require('../lib/config').keepAliveInterval;
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const messages          = require('../lib/config').messages;
const browserSync       = require('browser-sync').create();
const spawn             = require('child_process').spawn;
const teardownPath      = require('path').resolve(__dirname + '/../lib/teardown.js');
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
                        if(err.response.status === 401){
                            logger.warn(messages.serveNoAuth);
                        }
                    });

            } catch(err){
                logger.error(messages.ngrokError);
            }
        }
    });

    process.on('SIGINT', () => {
        spawn('node', [teardownPath]);
        process.exit();
    });

    //Keep alive loop
    setInterval(function () {
        vf.serve('keep_alive', descriptor);
    }, keepAliveInterval);
};