/////// app.js

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const mongoDb = "mongodb+srv://vinnav:fg8nzx846@cluster0.nw3es.mongodb.net/authentication?retryWrites=true&w=majority";
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index", { user: req.user });
});
app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
            username: req.body.username,
            password: hashedPassword
          }).save(err => {
            if (err) { 
              return next(err);
            };
        });
      res.redirect("/");
    });
  });

bcrypt.hash("somePassword", 10, (err, hashedPassword) => {
// if err, do something
// otherwise, store hashedPassword in DB
});

passport.use(
new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
    if (err) { 
        return done(err);
    };
    if (!user) {
        return done(null, false, { msg: "Incorrect username" });
    }
    bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, {msg: "Incorrect password"})
        }
      })
    return done(null, user);
    });
})
);
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
User.findById(id, function(err, user) {
    done(err, user);
});
});

// pass req.user through the rest of the app
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
  });

app.post(
    "/log-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);
app.get("/log-out", (req, res) => {
req.logout();
res.redirect("/");
});

app.listen(3000, () => console.log("app listening on port 3000!"));