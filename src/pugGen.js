const helper = require("./helper.js");

function selectTitle(viewName) {
    const indexViewName = "index";
    switch (viewName) {
        case "contact":
            return "Contact #{author.name}";
        case indexViewName:
            return "#{author.name}, #{author.age}";
        case "others":
            return "Other Singles";
        default:
            return selectTitle(indexViewName);
    }
}

function generateBeginning(viewName) {
    let result = helper.readFile("../pugGen/beginning.pug");

    result = result.replaceAll("%title", selectTitle(viewName));
    result = result.replaceAll("%viewName", viewName);

    return result;
}

function generateMiddle(viewName) {
    const result = helper.readFile(`../pugGen/mainContents/${viewName}.pug`);
    return helper.indentText(result, 2);
}

function generateEnd(viewName) {
    const result = helper.readFile("../pugGen/end.pug");
    return helper.indentText(result, 2);
}

function generate(viewName) {
    const parts = [
        generateBeginning(viewName),
        generateMiddle(viewName),
        generateEnd(viewName),
    ];
    return parts.join("\n");
}

module.exports = generate;
