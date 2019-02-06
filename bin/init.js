const inquirer  = require('inquirer');
const path      = require('path');
const utils     = require('../lib/utils');
const questions = [
        { type: 'input', name: 'name', message: 'Name:', default: path.basename(path.resolve('./')) },
        { type: 'input', name: 'main', message: 'Main:', default: 'index.html'},
        { type: 'input', name: 'version', message: 'Version:', default: '1.0.0'}
    ];

module.exports = function () {
    inquirer
        .prompt(questions)
        .then(function (answers) {
            answers.vff_name = answers.name;
            utils.saveDescriptor(answers);
        });
};
