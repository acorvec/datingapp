function initialize(app) {
    const setup = require("./setup.js");

    setup.sets(app);
    setup.uses(app);

    app.listen(3000);
}

module.exports = initialize;
