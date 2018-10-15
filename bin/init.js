const
    inquirer  = require('inquirer'),
    vf        = require('../lib/vf'),
    path      = require('path'),
    fs        = require('fs'),

    questions = [
        // { type: 'input', name: 'name', message: 'Name:', default: path.dirname(path.resolve('./')) },
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
