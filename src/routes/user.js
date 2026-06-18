const express = require('express');
const pug = require("pug");

const user = require("../model/user.js");
const helper = require("../helper.js");
const views = require("../views.js");
const cssGen = require("../view/cssGen.js");
const pugGen = require("../view/pugGen.js");

const router = express.Router();

async function showView(
    response,
    userFileName,
    viewName,
    next,
    requiresOtherUsers = false
) {
    let loadedUser = {};
    try {
        loadedUser = await user.parseFromFile(response, userFileName);
    } catch (error) { return next(error); }

    if (loadedUser.accountDisabled) {
        const message = `${loadedUser.name}'s account is disabled.`;
        return next(new Error(message));
    }

    let styles = {};
    try {
        const [skel, dark, light] = await Promise.all([
            cssGen(viewName, 'skel'),
            cssGen(viewName, 'dark'),
            cssGen(viewName, 'light'),
        ]);
        styles = { skel, dark, light };
    } catch (error) { return next(error); }

    const adminPath = "../meta/admin.json";
    const adminText = await helper.readFile(adminPath);
    if (adminText === null) 
        return next(new Error(`unable to read file at "${adminPath}".`));

    const admin = helper.parseJson(adminText);
    if (admin === null)
        return next(new Error(`unable to parse JSON at "${adminPath}".`));

    let otherUsers = undefined;
    if (requiresOtherUsers) {
        otherUsers = await user.loadOthers(
            response, 
            userFileName, 
            next
        );
    }
    const options = {
        user: loadedUser,
        styles: styles,
        admin: admin,
        otherUsers: otherUsers,
    };

    let gennedPug = {};
    try {
        gennedPug = await pugGen(viewName);
    } catch (error) { return next(error); }

    const renderedDoc = pug.render(gennedPug, options);
    response.send(renderedDoc);
}

const showIndex = async (response, userFileName, next) => {
    await showView(response, userFileName, "index", next);
};
const showContact = async (response, userFileName, next) => {
    await showView(response, userFileName, "contact", next);
};
const showOthers = async (response, userFileName, next) => {
    await showView(
        response,
        userFileName,
        "others",
        next,
        (requiresOtherUsers = true)
    );
};

const contactPattern = '/:name/profile/contact';
const othersPattern = '/:name/profile/others';
const indexPattern = '/:name/';

const rootPath = '/user';

router.get(contactPattern, async (request, response, next) => {
    await showContact(response, request.params.name, next);
});
router.get(othersPattern, async (request, response, next) => {
    await showOthers(response, request.params.name, next);
});
router.get(indexPattern, async (request, response, next) => {
    await showIndex(response, request.params.name, next);
});

router.get('*', async (request, response, next) => {
    const message = `404: page not found "${rootPath + request.url}".`;
    next(new Error(message));
});

module.exports = { rootPath: rootPath, router: router };