 var express = require("express");
 var router = express.Router();



router.get("/", function(req, res){
    res.render("index", {welcome: "Welcome to your database"});
});

router.post("/register", function(req, res, next){
    // res.render("register", {welcomeTwo: "You are logged in"});
    console.log(req.body);
    res.end();
});

router.get('*', function(req, res) {
    res.render('error');
  });

  module.exports = router;