const vf            = require('./vf');
const utils         = require('./utils');
const descriptor    = utils.getDescriptor();

vf.serve('tear_down', descriptor || {}).then(() => {
    console.log(descriptor);
}).catch(() => {
    console.log(descriptor);
});