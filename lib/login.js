const inquirer  = require('inquirer'),
      fs        = require('fs'),
      path      = require('path');
      credPath  = path.resolve(__dirname + '/../cred.json'),
      request = require('request'),
      // loginUrl = 'https://www.videoflow.io/login',
      loginUrl = 'http://localhost:3002/login',
      questions = [
        { type: 'input', name: 'email', message: 'Email:'},
        { type: 'password', name: 'password', message: 'Password:'},
      ];

module.exports = function () {
    inquirer
        .prompt(questions)
        .then(function (answers) {
            request.post(loginUrl, {form :{email : answers.email, password : answers.password, remember_me : true}}, function(err, res, body){
                if(!err && res.statusCode === 200){
                    console.log('Authentication successful');
                    let cred = { access_token : JSON.parse(body).access_token};
                    fs.writeFile(credPath, JSON.stringify(cred), 'utf8', () => {});
                } else {
                    fs.writeFile(credPath, JSON.stringify({}), 'utf8', () => {});
                    console.log('Authentication error');
                }
            });

        });
};
