const helper = require("./helper");

function readCssGenFile(filePath) {
    return helper.readFile(`../cssGen/${filePath}.css`);
}

function readStaticLightMode() {
    return readCssGenFile("light");
}

function readStaticDarkMode() {
    return readCssGenFile("dark");
}

function readStaticSkel() {
    return readCssGenFile("skel");
}

function readDarkModeMainContent(viewName) {
    return readCssGenFile(viewName + "/dark");
}

function readLightModeMainContent(viewName) {
    return readCssGenFile(viewName + "/light");
}

function readSkelMainContent(viewName) {
    return readCssGenFile(viewName + "/skel");
}

function generateDarkMode(viewName) {
    const parts = [readStaticDarkMode(), readDarkModeMainContent(viewName)];
    return parts.join("\n\n");
}

function generateLightMode(viewName) {
    const parts = [readStaticLightMode(), readLightModeMainContent(viewName)];
    return parts.join("\n\n");
}

function generateSkel(viewName) {
    const parts = [readStaticSkel(), readSkelMainContent(viewName)];
    return parts.join("\n\n");
}

function generate(viewName, mode) {
    switch (mode) {
        case "dark":
            return generateDarkMode(viewName);
        case "light":
            return generateLightMode(viewName);
        case "skel":
            return generateSkel(viewName);
        default:
            throw new Error("invalid enum value");
    }
}

module.exports = generate;
