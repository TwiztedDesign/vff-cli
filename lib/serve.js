const express       = require('express'),
      ngrok         = require('ngrok'),
      app           = express(),
      dir           = require('path').resolve('./'),
      request       = require('request'),
      postUrl       = 'http://localhost:3002/api/user/develop',
      defaultPort   = 5454;


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


            request.post(postUrl, {form: {url : url}, headers: {
                    'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNThkYjgyYzRkNWZjY2YzNjRiZmEzMDhmIn0sInJlbWVtYmVyX21lIjoidHJ1ZSIsImlhdCI6MTUzOTI1OTkwMCwiZXhwIjoxNTM5ODY0NzAwfQ.r5TVsg4BxTQUIaipV8DrzF0ivii_Sij3PmExwiGPULs'
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







