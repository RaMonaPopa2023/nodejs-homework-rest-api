var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const { connectToDb } = require("./db");

var app = express();

connectToDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
