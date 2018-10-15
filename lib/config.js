const path = require('path');

module.exports = {
    // baseUrl : "https://www.videoflow.io/",
    baseUrl             : "http://localhost:3002/",
    credentials         : path.resolve(__dirname + '/../cred.json'),
    defaultServePort    : 5454,

    messages : {
        authSuccess     : "Authentication successful",
        authFail        : "Authentication error",
        logoutSuccess   : "Logged out",
        missingDescriptor: "Missing vff.json file, run \"vff init\" to initialize a vff project",
    }
};