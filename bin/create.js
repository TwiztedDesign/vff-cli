const inquirer          = require('inquirer');
const path              = require('path');
const fs                = require('fs');
const ncp               = require('ncp').ncp;
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const boilerplatesPath  = "/../boilerplates/";
const boilerplates      = fs.readdirSync(path.resolve(__dirname + boilerplatesPath));


const questions = [
        { type: 'input', name: 'name', message: 'Name:', default: path.basename(path.resolve('./')) },
        { type: 'list', name: 'type', message: 'Type (more coming soon):', default: 'basic', choices: boilerplates },
    ];


function create(directory = ''){
    inquirer
        .prompt(questions)
        .then(function (answers) {
            ncp.limit = 16;
            logger.run('Creating vff project');
            ncp(path.resolve(__dirname + boilerplatesPath + answers.type), path.resolve('./' + directory), function (err) {
                if (err) {
                    console.log(err);
                    return logger.done(err);
                }
                answers.main = 'index.html';
                answers.version = '1.0.0';
                answers.vff_name = answers.name;
                delete answers.type;
                fs.writeFile(path.resolve('./' + directory) + '/vff.json', JSON.stringify(answers, null, 4), 'utf8', () => {
                    logger.done();
                });

            });

        });
}

module.exports = function (dir, cmd) {

    if(cmd){
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            questions[0].default = dir;
            create(dir);
        } else {
            logger.error("Directory exists")
        }
    } else if(utils.getDescriptor()){
        logger.error("Looks like a VFF project has already been created in this folder.");
    } else {
        create()
    }

};
