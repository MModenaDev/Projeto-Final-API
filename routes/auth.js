const express = require('express');
const router = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');
// require the user model !!!!
const User = require('../models/User');


router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  
  if (!email || !password) {
    res.status(400).json({
      message: 'Provide email and password'
    });
    return;
  }

  User.findOne({
    email
  }, (err, foundUser) => {

    if (err) {
      res.status(500).json({
        message: "Email check went bad."
      });
      return;
    }

    if (foundUser) {
      res.status(400).json({
        message: 'Email already in use.'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      email: email,
      password: hashPass
    });

    aNewUser.save(err => {
      if (err) {
        res.status(500).json({
          message: 'Saving user to database went wrong.'
        });
        return;
      }

      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {

        if (err) {
          res.status(500).json({
            message: 'Login after signup went bad.'
          });
          return;
        }

        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
      });
    });
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({
        message: 'Something went wrong authenticating user'
      });
      return;
    }

    if (!theUser) {
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({
          message: 'Session save went bad.'
        });
        return;
      }

      // We are now logged in (that's why we can also send req.user)
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({
    message: 'Log out success!'
  });
});


router.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({
    message: 'Unauthorized'
  });
});
 
router.get('/facebook', passport.authenticate('facebook', {scope: ["email"]} ));

router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: 'https://wander-ironhack.herokuapp.com/signup', failureRedirect: 'https://wander-ironhack.herokuapp.com' }));

router.get('/google',passport.authenticate('google', {scope: ["profile", "email"]}));

router.get('/google/callback', passport.authenticate('google',  { successRedirect: 'https://wander-ironhack.herokuapp.com/signup', failureRedirect: 'https://wander-ironhack.herokuapp.com' }));

module.exports = router;