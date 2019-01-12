const inquirer          = require('inquirer');
const path              = require('path');
const fs                = require('fs');
const ncp               = require('ncp').ncp;
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const boilerplatesPath  = "/../boilerplates/";
const boilerplates      = fs.readdirSync(path.resolve(__dirname + boilerplatesPath));


let questions = [
        { type: 'input', name: 'name', message: 'Name:', default: path.basename(path.resolve('./')) },
        { type: 'list', name: 'type', message: 'Type (more coming soon):', default: 'basic', choices: boilerplates },
    ];

module.exports = function () {
    if(utils.getDescriptor()){
        return logger.error("Looks like a VFF project has already been created in this folder.");
    }
    inquirer
        .prompt(questions)
        .then(function (answers) {
            ncp.limit = 16;
            logger.run('Creating vff project');
            ncp(path.resolve(__dirname + boilerplatesPath + answers.type), path.resolve('./'), function (err) {
                if (err) {
                    console.log(err);
                    return logger.done(err);
                }
                answers.main = 'index.html';
                answers.version = '1.0.0';
                delete answers.type;
                fs.writeFile(path.resolve('./') + '/vff.json', JSON.stringify(answers, null, 4), 'utf8', () => {
                    logger.done();
                });

            });

        });
};
