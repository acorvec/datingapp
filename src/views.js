const helper = require("./helper.js");

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
        return next(error);
    }

    const options = { message, styles };
    const html = pug.render(pugText, options);
    response.send(html);

    const error = new Error(message);
    next(error);
}

module.exports = { showErr: showErr };
