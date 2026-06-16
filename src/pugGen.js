const helper = require("./helper.js");
const caches = require('./caches.js');

function selectTitle(viewName) {
    const indexViewName = "index";
    switch (viewName) {
        case "contact":
            return "Contact #{user.name}";
        case indexViewName:
            return "#{user.name}, #{user.age}";
        case "others":
            return "Other Singles";
        default:
            return selectTitle(indexViewName);
    }
}

async function generateBeginning(viewName) {
    let result = await helper.readFile("../pugGen/beginning.pug");
    if (result === null) {
        const message = [
            `Unable to load beginning pug file for view "${viewName}".`
        ].join('');
        throw new Error(message);
    }

    // it's probably important to keep the large replaces 
    // at the bottom to improve performance
    result = result.replaceAll("%title", selectTitle(viewName));
    result = result.replaceAll("%viewName", viewName);

    let script = null;

    // it's probably important to keep the large replaces 
    // at the bottom to improve performance
    script = await caches.darkScript;
    if (script === null) 
        throw new Error(`unable to load file at "${caches.darkScriptPath}".`);
    
    result = result.replace("%darkScript", script);

    return result;
}

async function generateMiddle(viewName) {
    const filePath = `../pugGen/mainContents/${viewName}.pug`;
    const result = await helper.readFile(filePath);
    if (result === null) {
        const message = [
            `Unable to load middle pug file for view "${viewName}".`
        ].join('');
        throw new Error(message);
    }
    return helper.indentText(result, 2);
}

async function generateEnd(viewName) {
    const result = await helper.readFile("../pugGen/end.pug");
    if (result === null) {
        const message = [
            `Unable to load end pug file for view "${viewName}".`
        ].join('');
        throw new Error(message);
    }
    return helper.indentText(result, 2);
}

async function generate(viewName) {
    const promises = [
        generateBeginning(viewName),
        generateMiddle(viewName),
        generateEnd(viewName),
    ];
    const parts = await Promise.all(promises);
    return parts.join("\n");
}

module.exports = generate;
