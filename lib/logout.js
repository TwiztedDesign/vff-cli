const
    fs        = require('fs'),
    path      = require('path'),
    credPath  = path.resolve(__dirname + '/../cred.json');

module.exports = function () {
    fs.writeFile(credPath, JSON.stringify({}), 'utf8', () => {});
    console.log('Logged out');
};
