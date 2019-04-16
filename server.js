// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var exphbs  = require('express-handlebars');

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


// Make public a static folder
app.use(express.static("public"));

// Handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(routes);



// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================

// require("./app/routing/apiRoutes")(app);
// require("./app/routing/htmlRoutes")(app);



// ==============================================================================
// LISTENER
// The below code effectively "starts" our server
// ==============================================================================

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });
});
