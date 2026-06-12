const helper = require("./helper");

async function readCssGenFile(filePath) {
    return await helper.readFile(`../cssGen/${filePath}.css`);
}

async function readStaticLightMode() {
    return await readCssGenFile("light");
}

async function readStaticDarkMode() {
    return await readCssGenFile("dark");
}

async function readStaticSkel() {
    return await readCssGenFile("skel");
}

async function readDarkModeMainContent(viewName) {
    return await readCssGenFile(viewName + "/dark");
}

async function readLightModeMainContent(viewName) {
    return await readCssGenFile(viewName + "/light");
}

async function readSkelMainContent(viewName) {
    return await readCssGenFile(viewName + "/skel");
}

async function generateDarkMode(viewName) {
    const promises = [readStaticDarkMode(), readDarkModeMainContent(viewName)];
    const results = await Promise.all(promises);
    return results.join("\n\n");
}

async function generateLightMode(viewName) {
    const promises = [readStaticLightMode(), readLightModeMainContent(viewName)];
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
