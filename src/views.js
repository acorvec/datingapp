const author = require("./author.js");
const helper = require("./helper.js");

const pugGen = require("./pugGen.js");
const cssGen = require("./cssGen.js");

const pug = require("pug");

function showErr(response, message, next) {
    const viewName = "err";

    const darkModeStylePath = `../public/style/${viewName}/dark.css`;
    const darkModeStyles = helper.readFile(darkModeStylePath);

    const lightModeStylePath = `../public/style/${viewName}/light.css`;
    const lightModeStyles = helper.readFile(lightModeStylePath);

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

function showView(
    response,
    authorFileName,
    viewName,
    next,
    requiresOtherUsers = false
) {
    const loadedAuthor = author.parseFromFile(
        showErr,
        response,
        authorFileName,
        next
    );
    if (loadedAuthor === undefined) return;
    if (loadedAuthor.accountDisabled) {
        const message = `${loadedAuthor.name}'s account is disabled.`;
        showErr(response, message, next);
        return;
    }

    const styles = {
        skel: cssGen(viewName, "skel"),
        dark: cssGen(viewName, "dark"),
        light: cssGen(viewName, "light"),
    };

    const adminText = helper.readFile("../meta/admin.json");
    const admin = helper.parseJson(adminText);

    let otherUsers = undefined;
    if (requiresOtherUsers) {
        otherUsers = author.loadOthers(
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

    const gennedPug = pugGen(viewName);
    const renderedDoc = pug.render(gennedPug, options);
    response.send(renderedDoc);
}

module.exports = {
    showErr: showErr,
    showIndex: (response, authorFileName, next) => {
        showView(response, authorFileName, "index", next);
    },
    showContact: (response, authorFileName, next) => {
        showView(response, authorFileName, "contact", next);
    },
    showOthers: (response, authorFileName, next) => {
        showView(
            response,
            authorFileName,
            "others",
            next,
            (requiresOtherUsers = true)
        );
    },
};
