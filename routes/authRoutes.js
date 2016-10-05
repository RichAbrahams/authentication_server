const express = require('express');
const signup = require('../controllers/signup');
const signin = require('../controllers/signin');
const router = express.Router();
const passportJwt = require('../services/passportJwt');
const passportLocal = require('../services/passportLocal');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

router.use(errorHandler);

router.post('/signup', signup);
router.post('/signin', requireSignin, signin);
router.get('/rest', requireAuth, function(req, res) {
  res.send('authenticated route');
});

function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(500).json({error: 'server error, please retry later'})
}

module.exports = router;
