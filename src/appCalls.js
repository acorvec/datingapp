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
        const indexFn = async (request, response, next) => {
            const obj = getAuthorFilename(request);
            await views.showIndex(response, obj['authorFileName'], next);
        };

        app.get('/user/:name/profile/contact', async (request, response, next) => {
            const obj = getAuthorFilename(request);
            await views.showContact(response, obj['authorFileName'], next);
        });
        app.get('/user/:name/profile/others', async (request, response, next) => {
            const obj = getAuthorFilename(request);
            await views.showOthers(response, obj['authorFileName'], next);
        });
        app.get('/user/:name/', indexFn);

        app.get('*', async (request, response, next) => {
            if (isRoot(request.url)) {
                const obj = getAuthorFilename(request);
                await indexFn(request, response, next);
            }
            else {
                const message = `404: page not found "${request.url}".`;
                await views.showErr(response, message, next);
            }
        });
    },
};
