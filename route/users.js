const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//user model
const User = require("../models/User");

//Login Page
router.get("/login", (req, res) => res.render("Login"));

//Register Page
router.get("/register", (req, res) => res.render("Register"));

//register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //check requred fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // check pass length
  if (password.length < 6) {
    errors.push({ msg: "Passwords should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      password,
      password2,
      email
    });
  } else {
    // validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        //user exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          password,
          password2,
          email
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then(user => {
                res.redirect("/user/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
