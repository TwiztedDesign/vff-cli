const inquirer  = require('inquirer');
const path      = require('path');
const fs        = require('fs');
const ncp       = require('ncp').ncp;
const utils     = require('../lib/utils');

    questions = [
        { type: 'input', name: 'name', message: 'Name:', default: path.basename(path.resolve('./')) },
        { type: 'list', name: 'type', message: 'Type (more coming soon):', default: 'basic', choices: ['basic'] },
    ];

module.exports = function () {
    if(utils.getDescriptor()){
        return utils.logger.error("Looks like a VFF project has already been created in this folder.");
    }
    inquirer
        .prompt(questions)
        .then(function (answers) {
            ncp.limit = 16;
            utils.logger.run('Creating vff project');
            ncp(path.resolve(__dirname + '/../boilerplates/' + answers.type), path.resolve('./'), function (err) {
                if (err) {
                    return utils.logger.done(err);
                }
                answers.main = 'index.html';
                answers.version = '1.0.0';
                fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(answers, null, 4), 'utf8', () => {
                    utils.logger.done();
                });

            });

        });
};
