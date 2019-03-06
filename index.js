#!/usr/bin/env node

const program   = require('commander');

program
    .version(require('./package').version, '-v, --version');

program
    .command('login')
    .description("Login to Videoflow")
    .action(require('./bin/login'));

program
    .command('logout')
    .description("Logout from Videoflow")
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
    .description("Deploy the current project to Videoflow")
    .action(require('./bin/deploy'));

program
    .command('init')
    .description("Initialize a new overlay project")
    .action(require('./bin/init'));

program
    .command('create')
    .description("Create an overlay, select from one of the preset templates")
    .action(require('./bin/create'));

program
    .command('status')
    .description("Check the current vff status")
    .action(require('./bin/status'));
program
    .command('info')
    .description("Check the current overlay info")
    .action(require('./bin/info'));

program
    .command('env')
    .description("Change the environment (for development purposes)")
    .action(require('./bin/env'));

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();