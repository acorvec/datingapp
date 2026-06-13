const express = require('express');
const router = express.Router();

const views = require("../views.js");

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

const contactPattern = '/:name/profile/contact';
const othersPattern = '/:name/profile/others';

const rootPath = '/user';

router.get(contactPattern, async (request, response, next) => {
    const obj = getAuthorFilename(request);
    await views.showContact(response, obj['authorFileName'], next);
});
router.get(othersPattern, async (request, response, next) => {
    const obj = getAuthorFilename(request);
    await views.showOthers(response, obj['authorFileName'], next);
});
router.get('/:name/', indexFn);

router.get('*', async (request, response, next) => {
    const message = `404: page not found "${rootPath + request.url}".`;
    await views.showErr(response, message, next);
});

module.exports = {
    rootPath: rootPath,
    router: router
};