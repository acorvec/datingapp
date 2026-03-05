const path = require("node:path");
const express = require("express");

const views = require("./views.js");

function isolateAuthorFileName(path) {
    const splitPath = path.split("/");
    if (splitPath.length >= 2) return splitPath[1];
    else return undefined;
}

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
        const staticDir = path.join(__dirname, "../static");
        app.use(express.static(staticDir));

        app.use((request, response) => {
            if (request.method !== "GET") return;

            // parse the author's filename
            let authorFileName = isolateAuthorFileName(request.url);
            if (authorFileName.length === 0) authorFileName = "andrew";
            if (authorFileName === undefined) {
                const message = `404: page not found "${request.url}".`;
                views.showErr(response, message);
            }
            // parse the subpage
            const endpoint = isolateEndpoint(request.url);
            switch (endpoint) {
                case "/":
                    views.showIndex(response, authorFileName);
                    break;
                case "contact":
                    views.showContact(response, authorFileName);
                    break;
                case "others":
                    views.showOthers(response, authorFileName);
                    break;
                default:
                    const message = `404: page not found "${request.url}".`;
                    views.showErr(response, message);
            }
        });
    },
};
