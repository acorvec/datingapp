const fs = require("fs").promises;
const helper = require("./helper.js");

function calculateAge(bday) {
    const today = new Date();
    const yearDifference = today.getFullYear() - bday.getFullYear();
    if (today.getMonth() > bday.getMonth()) return yearDifference;
    else if (today.getMonth() < bday.getMonth()) return yearDifference - 1;
    else {
        if (today.getDate() >= bday.getDate()) return yearDifference;
        else return yearDifference - 1;
    }
}

function parseFromJson(jsonText) {
    const result = helper.parseJson(jsonText);
    if (result === null) return null;

    const bday = new Date(result.birthday);
    result.age = calculateAge(bday);
    return result;
}

async function parseFromFile(response, fileName) {
    const userPath = `../users/${fileName}.json`;
    const jsonText = await helper.readFile(userPath);
    if (jsonText === null) {
        const message = `404: user not found "${fileName}".`;
        throw new Error(message);
    }

    const result = parseFromJson(jsonText);
    if (result === null) {
        const resolvedPath = helper.resolve(userPath);
        const message = `Unable to parse JSON at path "${resolvedPath}"`;
        throw new Error(message);
    }

    result.fileName = fileName;
    return result;
}

async function loadOthers(response, fileNameToExclude, next) {
    const directoryListing = await fs.readdir("users");

    const result = [];
    const pushOther = async (fileName) => {
        let other = undefined;
        try {
            other = await parseFromFile(response, fileName, next);
        } catch { 
            next(new Error(`user "${fileName}" failed to load.`));
        }
        if (!other.accountDisabled) result.push(other);
    };

    for (const path of directoryListing) {
        const fileSplit = path.split(".");
        const fileName = fileSplit[0];
        if (fileName !== fileNameToExclude) 
            pushOther(fileName);
    }

    return result;
}

module.exports = {
    calculateAge: calculateAge,
    parseFromJson: parseFromJson,
    parseFromFile: parseFromFile,
    loadOthers: loadOthers,
};
