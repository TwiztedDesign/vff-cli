const inquirer  = require('inquirer');
const vf        = require('../lib/vf');
const questions = [
        { type: 'input', name: 'email', message: 'Email:'},
        { type: 'password', name: 'password', message: 'Password:'},
    ];

module.exports = function () {
    inquirer
        .prompt(questions)
        .then(function (answers) {
            vf.login(answers.email, answers.password);
        });
};
