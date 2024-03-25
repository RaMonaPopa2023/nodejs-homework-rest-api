require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const contactsRouter = require("./routes/contacts");

const { connectToDb } = require("./db");

var app = express();

connectToDb();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/avatars", indexRouter);
app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

module.exports = app;
