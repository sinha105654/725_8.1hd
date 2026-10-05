const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.send('Email already registered');
    const user = new User({ email, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/subjects',
  failureRedirect: '/login'
}));

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

module.exports = router;
module.exports.ensureAuthenticated = ensureAuthenticated;
