const
    express       = require('express'),
    ngrok         = require('ngrok'),
    app           = express(),
    dir           = require('path').resolve('./'),
    vf            = require('../lib/vf'),
    defaultPort   = require('../lib/config').defaultServePort;

module.exports = (directory, options) => {

    let port = directory.port || defaultPort;
    let path = dir + (directory.path || '');
    let entry = directory.entry || 'index.html';
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
        console.log('Serving:', path);
        console.log('Local: http://localhost:' + port);
        ngrok.connect(port,function (err, url){
            if (err !== null) {
                console.log('Error:', err);
            }
            console.log('Ngrok:', url);
            vf.serve(url);
        });
    });
};







