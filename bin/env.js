const inquirer          = require('inquirer');
const utils             = require('../lib/utils');
const logger            = require('../lib/logger');
const config            = utils.config();
const environments      = config.environments;
const environmentsKeys  = Object.keys(environments);


questions = [
    { type: 'list', name: 'env', message: 'Environments:', default: 'basic', choices: environmentsKeys },
];

module.exports = function () {
    console.log(environmentsKeys);
    inquirer
        .prompt(questions)
        .then(function (answers) {
            let envUrl = environments[answers.env];
            let localConfig = utils.localConfig();
            localConfig.baseUrl = envUrl;
            utils.saveLocalConfig(localConfig);
            logger.success('Env updated');
        });
};
