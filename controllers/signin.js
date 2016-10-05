const User = require('../models/user');
const tokenForUser = require('./generateToken');

function signin (req, res, next){
  res.json({username: req.user.username, token: tokenForUser(req.user)});
}

module.exports = signin;
