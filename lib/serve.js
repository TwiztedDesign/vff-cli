const
    express       = require('express'),
    ngrok         = require('ngrok'),
    app           = express(),
    dir           = require('path').resolve('./'),
    request       = require('request'),
    baseUrl       = require('./config').baseUrl,
    postUrl       = 'api/develop/url',
    fs            = require('fs'),

    defaultPort   = 5454;

let credentials = {};
if(fs.existsSync('./cred.json')) {
    credentials  = require('../cred.json');
}

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

            request.post(baseUrl + postUrl, {form: {url : url}, headers: {
                    'x-access-token': credentials.access_token
                }}, (err, req, body) => {
                if(err){
                    console.log(err);
                } else {
                    console.log(req.statusCode, body);
                }
            });
        });
    });
};







