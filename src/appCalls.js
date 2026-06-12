const path = require("node:path");
const express = require("express");

const views = require("./views.js");

function isolateEndpoint(path) {
    const splitPath = path.split("/");
    const lastItem = splitPath[splitPath.length - 1];
    let usedLength = 0;
    if (lastItem === "") usedLength = splitPath.length - 1;
    else usedLength = splitPath.length;
    if (usedLength === 3) return splitPath[2];
    else if (usedLength === 2) return "/";
    else if (usedLength === 1) return "/";
    else return undefined;
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

        app.get('/:name/index', indexFn);

        app.get('/:name/contact', (request, response, next) => {
            const obj = getAuthorFilename(request);
            views.showContact(response, obj['authorFileName'], next);
        });
        app.get('/:name/others', (request, response, next) => {
            const obj = getAuthorFilename(request);
            views.showOthers(response, obj['authorFileName'], next);
        });

        app.get('/:name/', indexFn);

        app.get('*', (request, response, next) => {
            const endpoint = isolateEndpoint(request.url);
            if (endpoint === '/') {
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
