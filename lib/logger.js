const spinner   = require('ora')();
const chalk     = require('chalk');
const symbols   = require('./symbols');


function stopSpinner(symbol){
    if(spinner.isSpinning) {
        spinner.stopAndPersist({
            symbol: symbol
        });
    }
}


module.exports = {
    error : (msg) => {
        stopSpinner(symbols.error);
        console.log(symbols.error, chalk.red(msg));
    },
    success : (msg) => {
        stopSpinner(symbols.success);
        console.log(symbols.success, chalk.green(msg));
    },
    info : (msg) => {
        stopSpinner(symbols.info);
        console.log(symbols.info, chalk.blue(msg));
    },
    warn : (msg) => {
        stopSpinner(symbols.warning);
        console.log(symbols.warning, chalk.yellow(msg));
    },
    log : (msg) => {
        if(spinner.isSpinning){
            spinner.text = msg;
        } else {
            console.log(msg);
        }
    },
    run : (msg) => {
        stopSpinner(symbols.success);
        spinner.text = msg;
        spinner.start();
    },
    done : (err) => {
        spinner.stopAndPersist({
            symbol : err? symbols.error : symbols.success
        });
    }
};