const express = require("express");
const bodyParser = require("body-parser");
const logRoutes = require("./routes/logRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", logRoutes);

module.exports = app;
