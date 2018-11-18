#!/usr/bin/env node

const program   = require('commander');

program
    .version('0.0.1');

program
    .command('login')
    .action(require('./bin/login'));

program
    .command('logout')
    .action(require('./bin/logout'));

program
    .command('serve')
    .description("Serve the current folder")
    .option("-p, --port <port>", "set port")
    .option("-d, --dir <path>", "set directory")
    .option("-e, --entry <entry>", "set entry file")
    .action(require('./bin/serve'));

program
    .command('deploy')
    .action(require('./bin/deploy'));

program
    .command('init')
    .action(require('./bin/init'));

program
    .command('create')
    .action(require('./bin/create'));

program
    .command('status')
    .action(require('./bin/status'));

program
    .command('env')
    .action(require('./bin/env'));

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();