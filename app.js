const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

// db config

const db = require("./config/key").MongoURI;

// connect to mango
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log("err"));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

//express session middleware
app.use(
  session({
    secret: "secret",
    resolve: true,
    saveUninitialized: true
  })
);

//connect flash middleware
app.use(flash());

//Global vars

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success msg");
  res.locals.error_msg = req.flash("error msg");
});

//Routes
app.use("/", require("./route/index"));
app.use("/users", require("./route/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`));
