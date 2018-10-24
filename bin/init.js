const inquirer  = require('inquirer');
const path      = require('path');
const fs        = require('fs');
const questions = [
        { type: 'input', name: 'name', message: 'Name:', default: path.basename(path.resolve('./')) },
        { type: 'input', name: 'main', message: 'Main:', default: 'index.html'},
        { type: 'input', name: 'version', message: 'Version:', default: '1.0.0'}
    ];

module.exports = function () {
    inquirer
        .prompt(questions)
        .then(function (answers) {
            fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(answers, null, 4), 'utf8', () => {});
        });
};
