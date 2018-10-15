const request   = require('request');
const fs        = require('fs');
const baseUrl   = require('./config').baseUrl;
const credPath  = require('./config').credentials;
const loginUrl  = 'login', serveUrl = 'api/overlay/serve', deployUrl = 'api/overlay/deploy';
const messages  = require('./config').messages;

let credentials;
try{
    credentials = require('../cred.json');
} catch(err){
    credentials = {};
}

module.exports = {

    login : (email, password) => {
        request.post(baseUrl + loginUrl, {form :{email : email, password : password, remember_me : true}}, function(err, res, body){
            if(!err && res.statusCode === 200){
                console.log(messages.authSuccess);
                let cred = { access_token : JSON.parse(body).access_token};
                fs.writeFile(credPath, JSON.stringify(cred), 'utf8', () => {});
            } else {
                fs.writeFile(credPath, JSON.stringify({}), 'utf8', () => {});
                console.log(messages.authFail);
            }
        });
    },

    logout : () => {
        fs.writeFile(credPath, JSON.stringify({}), 'utf8', () => {});
        console.log(messages.logoutSuccess);
    },

    serve : (url) => {
        request.post(baseUrl + serveUrl, {form: {url : url}, headers: {
                'x-access-token': credentials.access_token
            }}, (err, req, body) => {
            if(err){
                console.log(err);
            } else {
                console.log(req.statusCode, body);
            }
        });
    },

    deploy : (descriptor, cb) => {
        request.post(baseUrl + deployUrl, {
            json: {overlay : descriptor},
            headers: {
                'x-access-token': credentials.access_token
            }
        }, (err, res, body) => {
            if(!err && res && res.statusCode !== 200){
                err = {statusCode : res.statusCode};
            }
            cb(err, body)
        });
    }
};