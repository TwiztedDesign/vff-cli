const tunnel            = require('reverse-tunnel-ssh');
const logger            = require('./logger');
const tunnelDefaults    = require('./config').tunnel;


module.exports = {

    start : function(options){
        options = Object.assign({}, tunnelDefaults, options || {});
        return new Promise((resolve, reject) => {

            let conn = tunnel(options, function(error, clientConnection) {

            });

            conn.on('error', function (error) {
                logger.error("Connection error");
                console.log(error);
                reject();
            });
            conn.on('ready', function() {
                conn.shell(function(err, stream) {
                    if (err){
                        logger.error(error);
                    }
                    stream.on('close', function() {
                        console.log('closed');
                        conn.end();
                    }).on('data', function(data) {
                        if(data.indexOf("Forwarding") > -1){
                            let url = data.toString().match(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/)[0];
                            resolve(url);
                        }

                    }).stderr.on('data', function(data) {
                        logger.error("std error");
                        logger.error(data);
                        console.log(data);
                    });
                    stream.end('ls -l\nexit\n');
                });
            });

        });


    }
};