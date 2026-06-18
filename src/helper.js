const fs = require("fs").promises;

function resolve(path) {
    try {
        return require.resolve(path);
    } catch (err) {
        return null;
    }
}

async function readFile(path) {
    try {
        return await fs.readFile(resolve(path), "utf-8");
    } catch (err) {
        return null;
    }
}

function parseJson(jsonText) {
    try {
        return JSON.parse(jsonText);
    } catch (err) {
        return null;
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
    resolve,
    readFile,
    parseJson,
    indentText,
};
