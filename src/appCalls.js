const path = require("node:path");
const express = require("express");

const views = require("./views.js");

module.exports = {
    setCalls: (app) => {
        app.set("views", "./views");
        app.set("view engine", "pug");
    },
    useCalls: (app) => {
        const publicDir = path.join(__dirname, "../public");
        app.use(express.static(publicDir));

        const getAuthorFilename = (request) => {
            let authorFileName = request.params.name;
            if (!authorFileName)
                authorFileName = 'andrew';

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
        app.get('/', indexFn);
    },
};
