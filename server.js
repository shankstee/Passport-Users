// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require("sequelize");
var randomstring = require("randomstring");


// initalize sequelize with session store
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");
var isAuthenticated = require("./config/isAuthenticated");





//Require the models folder
var db = require("./models");

// set the index.js in the routes folder to this variable.
var routes = require("./routes");


require("dotenv").config();

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();


// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// express.json and express.urlEncoded make it easy for our server to interpret data sent to it.
// The code below is pretty standard.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressValidator());


// Make public a static folder
app.use(express.static("public"));

app.use(cookieParser());



app.use(session({ secret: randomstring.generate(), resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Tell app to use the routes folder
app.use(routes);

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log(username);
    console.log(password);
    // const db = require("./models");

    db.userTable.findAll({
      where: {
        userName: username
      }
    }).then(function (data, err) {
      if (err) done(err);
      console.log(data);

      if (data.length === 0) {
         done(null, false);
      } else {
        const userID = data[0].id;
        const hash = data[0].password.toString();
        console.log(hash);

        bcrypt.compare(password, hash, function (err, response) {
          if (response) {
            return done(null, { user_id: userID });
          } else {
            return done(null, false);
          }
        })
      }


    })


  }
));





// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');











// ==============================================================================
// LISTENER
// The below code effectively "starts" our server
// ==============================================================================

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
  });
});
