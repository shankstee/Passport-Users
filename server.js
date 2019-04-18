// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var exphbs  = require('express-handlebars');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require("sequelize");
var randomstring = require("randomstring");
var passport = require("passport");
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);



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

app.use(passport.initialize());
app.use(passport.session());

// Tell app to use the routes folder
app.use(routes);

var sequelize = new Sequelize(
  "passportPractice",
  "Sessions",
  "password", {
      "dialect": "sqlite",
      "storage": "./session.sqlite"
  });

  var mySessionStore = new SequelizeStore({
    db: sequelize
  });
  // make sure that Session tables are in place
  mySessionStore.sync();



// app.use(session({ secret: randomstring.generate(), resave: false, saveUninitialized: false }));


app.use(session({
  secret: randomstring.generate(),
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false, // we support the touch method so per the express-session docs this should be set to false
  proxy: true // if you do SSL outside of node.
}))




// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');











// ==============================================================================
// LISTENER
// The below code effectively "starts" our server
// ==============================================================================

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });
});
