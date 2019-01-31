const inquirer          = require('inquirer');
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const config            = require('../lib/config');
const environments      = config.environments;


const envChoices = Object.keys(environments).map(env => {
    return {
        name : environments[env].name,
        value : {
            url : environments[env].url,
            key : env
        }};
});

const questions = [
    { type: 'list', name: 'env', message: 'Environments:', choices: envChoices},
];

module.exports = function () {
    inquirer
        .prompt(questions)
        .then(function (answers) {
            let localConfig = utils.getLocalConf();
            localConfig.env = answers.env.key;
            utils.saveLocalConf(localConfig);
            logger.success('Env updated');
        });
};