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
const tunnel            = require('../lib/tunnel');




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
        ghostMode: false,
        watch   : true,
        reloadDebounce: 2000,
    }, async function (err) {
        if(err){
            logger.error(err);
        } else {
            logger.success('Serving: ' + path + '/' + entry);
            logger.info('Local:            http://localhost:' + port);


            try{
                tunnel.start({srcPort: port}).then(url => {
                    logger.info('Remote:           ' + url);
                    vf.serve(url,descriptor)
                        .then((res) => {
                            let overlay = res.data.overlay;
                            descriptor.serve_id = overlay.id;
                            utils.saveDescriptor(descriptor);
                        })
                        .catch((err) => {
                            if(err.response && err.response.status === 401){
                                logger.warn(messages.serveNoAuth);
                            }else{
                                logger.error(err);
                            }
                        });
                }) ;
            } catch(err){
                logger.error(messages.tunnelError);
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

    //Handle windows case of terminate process
    if (process.platform === "win32") {
        var rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on("SIGINT", function () {
            process.emit("SIGINT");
        });
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
        vf.serve('keep_alive', descriptor)
            .catch(err => {
                logger.error(messages.connectionError);
            });
    }, keepAliveInterval);
};