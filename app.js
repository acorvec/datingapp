const express = require("express");
const initialize = require("./src/init.js");

const app = express();
initialize(app);
