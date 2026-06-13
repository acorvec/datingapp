function initialize(app) {
    const setup = require("./setup.js");

    setup.setCalls(app);
    setup.useCalls(app);

    app.listen(3000);
}

module.exports = initialize;
