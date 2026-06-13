const path = require("node:path");
const express = require("express");

const views = require("./views.js");

module.exports = {
    setCalls: (app) => {
        app.set("view engine", "pug");
    },
    useCalls: (app) => {
        const publicDir = path.join(__dirname, "../public");
        app.use(express.static(publicDir));

        const userRoute = require('./routes/user.js');
        app.use('/user', userRoute.router);

        app.get('*', async (request, response, next) => {
            const message = `404: page not found "${request.url}".`;
            await views.showErr(response, message, next);
        });
    },
};
