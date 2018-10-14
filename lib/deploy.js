const
    fs        = require('fs'),
    path      = require('path'),
    skipDirs  = ['node_modules', '.git', '.idea', '.ds_store'],
    skipFiles = ['.ds_store'],
    baseUrl   = require('./config').baseUrl,
    postUrl   = 'api/develop/deploy',
    request   = require('request'),
    archiver  = require('archiver'),
    credPath  = path.resolve(__dirname + '/../cred.json');



function list(dir, filelist) {
    dir = dir || './';
    if(skipDirs.indexOf(dir.toLowerCase()) > -1) {
        return filelist;
    }
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = list(path.join(dir, file), filelist);
        }
        else if(skipFiles.indexOf(file.toLowerCase()) < 0){
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
}

let credentials = {};
if(fs.existsSync('./cred.json')) {
    credentials  = require('../cred.json');
}


module.exports = function () {
    console.log('Deploying');

    let files = list();

    let output = fs.createWriteStream(path.resolve('./') + '/overlay.zip');
    let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    output.on('end', function() {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    // archive.directory('.');
    archive.file('simple-overlay.html');
    archive.file('simple-script.js');
    archive.finalize();



    // request.post(baseUrl + postUrl, {form: {files : files}, headers: {
    //         'x-access-token': credentials.access_token
    //     },qsStringifyOptions : {
    //         arrayFormat : 'repeat' // [indices(default)|brackets|repeat]
    //     }}, (err, req, body) => {
    //     if(err){
    //         console.log(err);
    //     } else {
    //         var urls = JSON.parse(body);
    //         console.log(urls);
    //     }
    // });

    // console.log(list());
};
