const fs = require("fs");
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

function parseFromFile(showErr, response, fileName) {
    const authorPath = `../authors/${fileName}.json`;
    const jsonText = helper.readFile(authorPath);
    if (jsonText === undefined) {
        const message = `404: author not found "${fileName}".`;
        showErr(response, message);
        return undefined;
    }

    const result = parseFromJson(jsonText);
    if (result === undefined) {
        const resolvedPath = helper.resolve(authorPath);
        const message = `Unable to parse JSON at path "${resolvedPath}"`;
        showErr(response, message);
        return undefined;
    }

    result.fileName = fileName;
    return result;
}

function loadOthers(showErr, response, fileNameToExclude) {
    // get the directory listing
    const directoryListing = fs.readdirSync("authors");

    // pre-allocate an array of the expected size
    const expectedCount = directoryListing.length - 1;
    const result = helper.arrayOfUndefined(expectedCount);

    // push the author if their account isn't disabled;
    // keep track of whether or not the author failed to load
    const pushOther = (index, fileName) => {
        const other = parseFromFile(showErr, response, fileName);
        if (!other.accountDisabled) result[index] = other;
        return other !== undefined;
    };

    for (const index in directoryListing) {
        const fileSplit = directoryListing[index].split(".");
        const fileName = fileSplit[0];
        if (fileName !== fileNameToExclude) {
            const succeeded = pushOther(index, fileName);
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
