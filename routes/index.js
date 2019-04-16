 var express = require("express");
 var router = express.Router();
 var db = require("../models");



router.get("/register", function(req, res){
    res.render("register", {welcome: "Welcome to your database please sign up"});
});

router.post("/register", function(req, res, next){
    // res.render("register", {welcomeTwo: "You are logged in"});

    db.userTable.create({
        userName : req.body.userName,
        email: req.body.email,
        password: req.body.password
      }).then(function () {
         console.log("complete")
          
      });

      res.render("register", {welcome: "Welcome in!"});


    
    
});

router.get('*', function(req, res) {
    res.render('error');
  });

  module.exports = router;