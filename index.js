#!/usr/bin/env node

const program   = require('commander'),
      serve     = require('./lib/serve'),
      login     = require('./lib/login');
      logout    = require('./lib/logout');


program
    .version('0.0.1');
program
    .command('serve')
    .description("Serve the current folder")
    .option("-p, --port <port>", "set port")
    .option("-d, --dir <path>", "set directory")
    .option("-e, --entry <entry>", "set entry file")
    .action(serve);


program
    .command('login')
    .action(login);

program
    .command('logout')
    .action(logout);






program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();