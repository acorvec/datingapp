const author = require("./author.js");
const helper = require("./helper.js");

const pugGen = require("./pugGen.js");
const cssGen = require("./cssGen.js");

const pug = require("pug");

async function showErr(response, message, next) {
    const viewName = "err";

    const darkModeStylePath = `../public/style/${viewName}/dark.css`;
    const lightModeStylePath = `../public/style/${viewName}/light.css`;

    const promises = [
        helper.readFile(darkModeStylePath), 
        helper.readFile(lightModeStylePath)
    ];
    const darkModeStyles = await promises[0];
    const lightModeStyles = await promises[1];

    const options = {
        message: message,
        darkModeStyles: darkModeStyles,
        lightModeStyles: lightModeStyles,
    };

    const error = new Error('Not Found');
    error.status = 404;
    response.status(404);
    response.render("err", options);
    next(error);
}

async function showView(
    response,
    authorFileName,
    viewName,
    next,
    requiresOtherUsers = false
) {
    const loadedAuthor = await author.parseFromFile(
        showErr,
        response,
        authorFileName,
        next
    );
    if (loadedAuthor === undefined) return;
    if (loadedAuthor.accountDisabled) {
        const message = `${loadedAuthor.name}'s account is disabled.`;
        await showErr(response, message, next);
        return;
    }

    const promises = [
        cssGen(viewName, "skel"),
        cssGen(viewName, "dark"),
        cssGen(viewName, "light")
    ];

    const styles = {
        skel: await promises[0],
        dark: await promises[1],
        light: await promises[2]
    };

    const adminText = await helper.readFile("../meta/admin.json");
    const admin = helper.parseJson(adminText);

    let otherUsers = undefined;
    if (requiresOtherUsers) {
        otherUsers = await author.loadOthers(
            showErr, 
            response, 
            authorFileName, 
            next
        );
        // if the loading failed,
        // then the loading function displays an error and returns undefined;
        // we should stop the function, as a page is already loaded
        if (otherUsers === undefined) return;
    }
    const options = {
        author: loadedAuthor,
        styles: styles,
        admin: admin,
        otherUsers: otherUsers,
    };

    const gennedPug = await pugGen(viewName);
    const renderedDoc = pug.render(gennedPug, options);
    response.send(renderedDoc);
}

module.exports = {
    showErr: showErr,
    showIndex: async (response, authorFileName, next) => {
        await showView(response, authorFileName, "index", next);
    },
    showContact: async (response, authorFileName, next) => {
        await showView(response, authorFileName, "contact", next);
    },
    showOthers: async (response, authorFileName, next) => {
        await showView(
            response,
            authorFileName,
            "others",
            next,
            (requiresOtherUsers = true)
        );
    },
};
