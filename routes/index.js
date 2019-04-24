var express = require("express");

var router = express.Router();
var db = require("../models");

var bcrypt = require("bcrypt");
const saltRounds = 10;

var passport = require("passport");



// var session = require("express-session");


// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/isAuthenticated");


router.get("/register", function (req, res) {
    res.render("register", { welcome: "Welcome to your database please sign up" });
});

router.get("/login", function (req, res) {
    res.render("login", { welcome: "Please Login" });
});

router.post("/login", passport.authenticate(
    "local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }
));

router.get("/logout", function (req, res) {
    req.logout();
    req.session.destroy();
    res.render("logout");
});

router.get("/",  function (req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render("home", { title: "Welcome" });
});

router.post("/register", function (req, res, next) {

    req.checkBody("userName", "Username must not be empty").notEmpty();
    req.checkBody("userName", "Username must be 4-15 characters long").len(4,15);
    req.checkBody("email", "The email you entered is invalid. Please try again").isEmail();
    req.checkBody("email", "The email must be 4-100 characters long, please try again").len(4,100);
    req.checkBody("password", "The must be 8-100 characters long. Please try again").len(8,100);
    req.checkBody("password", "The password must contain a lowercase, uppercase, number, and a special character").matches(/^(?=[^A-Z]*[A-Z])(?=[^!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]*[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~])(?=\D*\d).{8,}$/, "i");
    req.checkBody("recheckPassword","The must be 8-100 characters long. Please try again").len(8,10);
    req.checkBody("recheckPassword","Both passwords must match").equals(req.body.password);
    
    const error = req.validationErrors();

    if (error) {
        console.log(error);
        res.render("register" ,{
            errors: error
        });

        // not sure why this return is needed to avoid a header error?
        return;
    } else{

    const password = req.body.password;

        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) throw err;
            // Store hash in your password DB.
            db.userTable.create({
                userName: req.body.userName,
                email: req.body.email,
                password: hash
            }).then(function (data, err) {
                if (err) throw err;
                var userID = data.dataValues.id;
                console.log(userID);

                req.login(userID, function (err) {
                    if (err) throw err;
                    res.redirect("/");
                    
                })

            });
        }); 
    };

    // res.render("register", { welcome: "Welcome in!" });
});


passport.serializeUser(function(userID, done) {
    done(null, userID);
  });
  
passport.deserializeUser(function(userID, done) {
    done(null, userID);


});

router.get('*', function (req, res) {
    res.render('error');
});

module.exports = router;