const fs = require("fs");

function resolve(path) {
    try {
        return require.resolve(path);
    } catch (err) {
        return undefined;
    }
}

function arrayOfUndefined(length) {
    const result = new Array(length);
    return result.fill(undefined);
}

function readFile(path) {
    try {
        return fs.readFileSync(resolve(path), "utf-8");
    } catch (err) {
        return undefined;
    }
}

function parseJson(jsonText) {
    try {
        return JSON.parse(jsonText);
    } catch (err) {
        return undefined;
    }
}

function indentText(text, amount, spaceCount = 4) {
    const lines = text.split("\n");
    const spaces = " ".repeat(spaceCount);
    const prefix = spaces.repeat(amount);

    const indentedLines = [];
    for (const line of lines) indentedLines.push(prefix + line);

    return indentedLines.join("\n");
}

module.exports = {
    resolve: resolve,
    arrayOfUndefined: arrayOfUndefined,
    readFile: readFile,
    parseJson: parseJson,
    indentText: indentText,
};
