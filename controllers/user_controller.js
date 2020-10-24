var User = require('../models/user');
var async = require('async');
var passport = require('passport')
const { body,validationResult } = require("express-validator");


// GET request for signup. 
exports.user_signup_get = function(req, res, next) {
    res.render("signup");
};

// POST request for signup. 
exports.user_signup_post = [
    body('username').trim().isLength({min:1}).escape().withMessage('Username must be specified'),
    body('password').isLength({min:1}).escape().withMessage('Password must be specified'),
    body('first_name').isLength({min:1}).escape().withMessage('First name must be specified'),
    body('last_name').isLength({min:1}).escape().withMessage('Last name must be specified'),
    body('secretcode').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        
        //Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('signup', { title: 'Signup', user: req.body, errors: errors.array() });
            return
        }
        else{
            //Data from form is valid.
            let memberstatus = "basic";
            if(req.body.secretcode == "premium"){
                memberstatus = "premium";
                console.log("member is premium");
            } else if (req.body.secretcode == "admin"){
                memberstatus = "admin";
                console.log("member is admin");
            }
            //Create a user object with escaped and trimmed data
            var user = new User(
                {
                    username: req.body.username,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    permission: memberstatus,
                });
            user.save(function(err){
                if(err){return next(err);}
                //Successful - redirect to new person record.
                res.redirect('/')
            })
        }
    }
];

// GET request for login. 
exports.user_login_get = function(req, res, next) {
    res.render("login");
};

// POST request for login. 
exports.user_login_post = function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      })
};

// Display user logout on GET.
exports.user_logout_get = function(req, res, next) {
    req.logout();
    res.redirect("/");
};