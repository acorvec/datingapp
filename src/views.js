const author = require("./author.js");
const helper = require("./helper.js");

const pugGen = require("./pugGen.js");
const cssGen = require("./cssGen.js");

const pug = require("pug");

function showErr(response, message) {
    const viewName = "err";

    const darkModeStylePath = `../static/style/${viewName}/dark.css`;
    const darkModeStyles = helper.readFile(darkModeStylePath);

    const lightModeStylePath = `../static/style/${viewName}/light.css`;
    const lightModeStyles = helper.readFile(lightModeStylePath);

    const options = {
        message: message,
        darkModeStyles: darkModeStyles,
        lightModeStyles: lightModeStyles,
    };
    response.render("err", options);
}

function showView(
    response,
    authorFileName,
    viewName,
    requiresOtherAuthors = false
) {
    const loadedAuthor = author.parseFromFile(
        showErr,
        response,
        authorFileName
    );
    if (loadedAuthor === undefined) return;
    if (loadedAuthor.accountDisabled) {
        const message = `${loadedAuthor.name}'s account is disabled.`;
        showErr(response, message);
        return;
    }

    const styles = {
        skel: cssGen(viewName, "skel"),
        dark: cssGen(viewName, "dark"),
        light: cssGen(viewName, "light"),
    };

    const adminText = helper.readFile("../meta/admin.json");
    const admin = helper.parseJson(adminText);

    let otherAuthors = undefined;
    if (requiresOtherAuthors) {
        otherAuthors = author.loadOthers(showErr, response, authorFileName);
        // if the loading failed,
        // then the loading function displays an error and returns undefined;
        // we should stop the function, as a page is already loaded
        if (otherAuthors === undefined) return;
    }
    const options = {
        author: loadedAuthor,
        styles: styles,
        admin: admin,
        otherAuthors: otherAuthors,
    };

    const gennedPug = pugGen(viewName);
    const renderedDoc = pug.render(gennedPug, options);
    response.send(renderedDoc);
}

module.exports = {
    showErr: showErr,
    showIndex: (response, authorFileName) => {
        showView(response, authorFileName, "index");
    },
    showContact: (response, authorFileName) => {
        showView(response, authorFileName, "contact");
    },
    showOthers: (response, authorFileName) => {
        showView(
            response,
            authorFileName,
            "others",
            (requiresOtherAuthors = true)
        );
    },
};
