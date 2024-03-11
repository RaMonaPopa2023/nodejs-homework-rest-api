require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const contactsRouter = require("./routes/contacts");

const { connectToDb } = require("./db");
const cors = require("cors");
const app = express();

connectToDb();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/contacts", contactsRouter);

app.use((req, res, next) => {
  res.header("Cache-Control", "no-store");
  next();
});
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error("Error:", err);

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
