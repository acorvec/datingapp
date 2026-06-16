const helper = require('./helper');

const darkScriptPath = './front/dark.mjs';

const darkScript =
    helper.readFile(darkScriptPath).then((data) => {
        return helper.indentText(data, 3);
    });

module.exports = {
    darkScriptPath,
    darkScript 
};
