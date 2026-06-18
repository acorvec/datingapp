const user = require("./user.js");
const helper = require("./helper.js");
const pugGen = require("./pugGen.js");
const cssGen = require("./cssGen.js");

const pug = require("pug");

async function showErr(response, message, next) {
    const viewName = 'err';
    const pugPath = '../pugGen/err.pug';

    let pugText = await helper.readFile(pugPath);
    if (pugText === null)
        next(new Error(`unable to load file at "${pugPath}".`));

    const darkScriptPath = './front/dark.mjs';
    const darkScript =
        helper.readFile(darkScriptPath).then((data) => {
            return helper.indentText(data, 3);
        });

    let script = null;

    // it's probably important to keep the large replaces 
    // at the bottom to improve performance
    script = await darkScript;
    if (script === null)
        throw new Error(`unable to load file at "${darkScriptPath}".`);
    pugText = pugText.replace('%darkScript', script);

    const darkModeStylePath = `../cssGen/err/dark.css`;
    const lightModeStylePath = `../cssGen/err/light.css`;
    const skelStylePath = `../cssGen/err/skel.css`;

    let styles = {};
    try {
        const promises = [
            helper.readFile(darkModeStylePath), 
            helper.readFile(lightModeStylePath),
            helper.readFile(skelStylePath)
        ];
        const results = await Promise.all(promises);
        const towel = (message) => { throw new Error(message); };
        styles = {
            dark: results[0] ??
                towel(`unable to read file at "${darkModeStylePath}".`),
            light: results[1] ??
                towel(`unable to read file at "${lightModeStylePath}".`),
            skel: results[2] ??
                towel(`unable to read file at "${skelStylePath}".`)
        };
    } catch (error) {
        next(new Error('unable to load Error stylesheets.'));
    }

    const options = { message, styles };
    const html = pug.render(pugText, options);
    response.send(html);

    const error = new Error(message);
    next(error);
}

async function showView(
    response,
    userFileName,
    viewName,
    next,
    requiresOtherUsers = false
) {
    let loadedAuthor = {};
    try {
        loadedAuthor = await user.parseFromFile(response, userFileName);
    } catch (error) { return next(error); }

    if (loadedAuthor.accountDisabled) {
        const message = `${loadedAuthor.name}'s account is disabled.`;
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
        user: loadedAuthor,
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

module.exports = {
    showErr: showErr,
    showIndex: async (response, userFileName, next) => {
        await showView(response, userFileName, "index", next);
    },
    showContact: async (response, userFileName, next) => {
        await showView(response, userFileName, "contact", next);
    },
    showOthers: async (response, userFileName, next) => {
        await showView(
            response,
            userFileName,
            "others",
            next,
            (requiresOtherUsers = true)
        );
    },
};
