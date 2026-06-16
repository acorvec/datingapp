const helper = require("./helper");

async function readCssGenFile(filePath) {
    const abs = `../cssGen/${filePath}.css`;
    const result = await helper.readFile(abs);
    if (result === null)
        throw new Error(`unable to read file "${abs}".`);
    else
        return result;
}

async function readStaticLightMode() {
    return readCssGenFile("light");
}

async function readStaticDarkMode() {
    return readCssGenFile("dark");
}

async function readStaticSkel() {
    return readCssGenFile("skel");
}

async function readDarkModeMainContent(viewName) {
    return readCssGenFile(viewName + "/dark");
}

async function readLightModeMainContent(viewName) {
    return readCssGenFile(viewName + "/light");
}

async function readSkelMainContent(viewName) {
    return readCssGenFile(viewName + "/skel");
}

async function generateDarkMode(viewName) {
    const promises = [readStaticDarkMode(), readDarkModeMainContent(viewName)];
    const results = await Promise.all(promises);
    return results.join("\n\n");
}

async function generateLightMode(viewName) {
    const promises = [
        readStaticLightMode(), readLightModeMainContent(viewName)
    ];
    const results = await Promise.all(promises);
    return results.join("\n\n");
}

async function generateSkel(viewName) {
    const promises = [readStaticSkel(), readSkelMainContent(viewName)];
    const results = await Promise.all(promises);
    return results.join("\n\n");
}

async function generate(viewName, mode) {
    switch (mode) {
        case "dark":
            return await generateDarkMode(viewName);
        case "light":
            return await generateLightMode(viewName);
        case "skel":
            return await generateSkel(viewName);
        default:
            throw new Error("invalid enum value");
    }
}

module.exports = generate;
