const path = require("node:path");
const express = require("express");

const views = require("./views.js");

module.exports = {
    sets: (app) => {
        app.set("view engine", "pug");
    },
    uses: (app) => {
        const publicDir = path.join(__dirname, "../public");
        app.use(express.static(publicDir));

        const userRoute = require('./routes/user.js');
        app.use('/user', userRoute.router);

        app.get('*', async (request, response, next) => {
            const message = `404: page not found "${request.url}".`;
            next(new Error(message));
        });
        app.use(async (error, request, response, next) => {
            await views.showErr(response, error.message, next);
            next(error);
        });
    },
};
