const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs'); // !!!
const passport = require('passport');

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},(username, password, next) => {
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, {
        message: 'Incorrect username.'
      });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, {
        message: 'Incorrect password.'
      });
      return;
    }

    next(null, foundUser);
  });
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['emails'],
  },
  function(accessToken, refreshToken, profile, next) {
    User.findOrCreate({ 'facebook.id': profile.id }, { 'email': profile.emails[0].value}, function (err, user) {
      return next(err, user);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CONSUMER_KEY,
    clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
  },
  function(token, tokenSecret, profile, next) {
      User.findOrCreate({ 'google.id': profile.id }, { 'email': profile.emails[0].value}, function (err, user) {
        return next(err, user);
      });
  }
));