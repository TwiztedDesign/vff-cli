const path = require('path');

module.exports = {
    // baseUrl : "https://www.videoflow.io/",
    baseUrl             : "http://localhost:3002/",
    credentials         : path.resolve(__dirname + '/../cred.json'),
    defaultServePort    : 5454,
    keepAliveInterval   : 60000,

    messages : {
        authSuccess     : "Authentication successful",
        authFail        : "Authentication error",
        logoutSuccess   : "Logged out",
        missingDescriptor: "Missing vff.json file, run \"vff init\" to initialize a vff project",
        noAuth          : "You are not logged in, use \"vff login\" and try again",
        serveNoAuth     : "The overlay will not be accessible in https://videoflow.io, please login with \"vff login\"",
        serveSuccess    : "To view the overlay live, go to https://videoflow.io",
        addrInUse       : "You are already serving and overlay",
        ngrokError      : "Remote serving could not be initiated, please check your network connection and try again"
    }
};