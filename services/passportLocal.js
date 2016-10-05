const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');
const validator = require('validator');

const localOptions = {usernameField: 'email'}

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

  const sanitizedEmail = validator.escape(email).toLowerCase();
  const sanitizedPassword = validator.escape(password).toLowerCase();

  User.findOne({email: sanitizedEmail}, function(err, user) {
    if (err) {return done(err);}
    if (!user) {return done(null, false);}
    user.comparePassword(sanitizedPassword, function(err, isMatch) {
    if (err) {return done(err);}
    if (!isMatch) {return done(null, false);}
    return done(null, user);
  });
});
});

passport.use(localLogin);
