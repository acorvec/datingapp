const path = require("node:path");
const express = require("express");

const views = require("./views.js");

function isRoot(path) {
    return path.length === 1;
}

module.exports = {
    setCalls: (app) => {
        app.set("views", "./views");
        app.set("view engine", "pug");
    },
    useCalls: (app) => {
        const publicDir = path.join(__dirname, "../public");
        app.use(express.static(publicDir));

        const getAuthorFilename = (request) => {
            let authorFileName = 'andrew';
            if (request.params && request.params.name) 
                authorFileName = request.params.name;

            return { authorFileName: authorFileName };
        };
        const indexFn = (request, response, next) => {
            const obj = getAuthorFilename(request);
            views.showIndex(response, obj['authorFileName'], next);
        };

        app.get('/user/:name/profile/contact', (request, response, next) => {
            const obj = getAuthorFilename(request);
            views.showContact(response, obj['authorFileName'], next);
        });
        app.get('/user/:name/profile/others', (request, response, next) => {
            const obj = getAuthorFilename(request);
            views.showOthers(response, obj['authorFileName'], next);
        });
        app.get('/user/:name/', indexFn);

        app.get('*', (request, response, next) => {
            if (isRoot(request.url)) {
                const obj = getAuthorFilename(request);
                indexFn(request, response, next);
            }
            else {
                const message = `404: page not found "${request.url}".`;
                views.showErr(response, message);
            }
        });
    },
};
