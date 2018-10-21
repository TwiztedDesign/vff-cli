const express       = require('express');
const ngrok         = require('ngrok');
const app           = express();
const dir           = require('path').resolve('./');
const vf            = require('../lib/vf');
const defaultPort   = require('../lib/config').defaultServePort;
const utils         = require('../lib/utils');

module.exports = (directory, options) => {
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
        console.log('Serving:', path + '/' + entry);
        console.log('Local: http://localhost:' + port);
        ngrok.connect(port,function (err, url){
            if (err !== null) {
                console.log('Error:', err);
            }
            console.log('Ngrok:', url);
            vf.serve(url);
        });
    });

    process.on('SIGINT', function() {
        vf.serve('tear_down',()=>{
            process.exit();
        });
    })
};