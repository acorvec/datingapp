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
    let result = helper.parseJson(jsonText);
    if (result === undefined) return undefined;

    const bday = new Date(result.birthday);
    result.age = calculateAge(bday);
    return result;
}

async function parseFromFile(showErr, response, fileName, next) {
    const userPath = `../users/${fileName}.json`;
    const jsonText = await helper.readFile(userPath);
    if (jsonText === undefined) {
        const message = `404: author not found "${fileName}".`;
        await showErr(response, message, next);
        return undefined;
    }

    const result = parseFromJson(jsonText);
    if (result === undefined) {
        const resolvedPath = helper.resolve(userPath);
        const message = `Unable to parse JSON at path "${resolvedPath}"`;
        await showErr(response, message, next);
        return undefined;
    }

    result.fileName = fileName;
    return result;
}

async function loadOthers(showErr, response, fileNameToExclude, next) {
    // get the directory listing
    const directoryListing = await fs.readdir("users");

    // pre-allocate an array of the expected size
    const expectedCount = directoryListing.length - 1;
    const result = helper.arrayOfUndefined(expectedCount);

    // push the author if their account isn't disabled;
    // keep track of whether or not the author failed to load
    const pushOther = async (index, fileName) => {
        const other = await parseFromFile(showErr, response, fileName, next);
        if (!other.accountDisabled) result[index] = other;
        return other !== undefined;
    };

    for (const index in directoryListing) {
        const fileSplit = directoryListing[index].split(".");
        const fileName = fileSplit[0];
        if (fileName !== fileNameToExclude) {
            const succeeded = await pushOther(index, fileName);
            if (!succeeded) return undefined;
        }
    }

    return result.filter((element) => {
        return element !== undefined;
    });
}

module.exports = {
    calculateAge: calculateAge,
    parseFromJson: parseFromJson,
    parseFromFile: parseFromFile,
    loadOthers: loadOthers,
};
