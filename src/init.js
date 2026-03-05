function initialize(app) {
    const requests = require("./appCalls.js");

    requests.setCalls(app);
    requests.useCalls(app);

    app.listen(3000);
}

module.exports = initialize;
