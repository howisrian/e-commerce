const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/login', (req, res) => {
  res.send('Login form');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.send('User profile page');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;