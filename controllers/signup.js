const User = require('../models/user');
const tokenForUser = require('./generateToken');
const validator = require('validator');


function signup (req, res, next){
  const username = validator.escape(req.body.username).toLowerCase();
  const email = validator.escape(req.body.email).toLowerCase();
  const password = validator.escape(req.body.password).toLowerCase();

  if(!username || validator.isEmpty(username)){return res.status(422).json({success: false, error: 'username is required', errorCode: 1});}
  if(!email || validator.isEmpty(email)){return res.status(422).json({success: false, error: 'email is required', errorCode: 2});}
  if(!password || validator.isEmpty(password)){return res.status(422).json({success: false, error: 'password is required', errorCode: 3});}

  const checkUsername = new Promise( (resolve, reject) => {
    User.findOne({ username: username }, (err, existingUser, next) => {
      if (err){ reject(err)};
      if (existingUser) {resolve(true);}

      resolve(false);
    });
  });

  const checkEmail = new Promise( (resolve, reject) => {
    User.findOne({ email: email}, (err, existingUser, next) => {
      if (err){ reject(err)};
      if (existingUser) {resolve(true);}
      resolve(false);
    });
  });

  Promise.all([checkUsername, checkEmail])
  .then( (values) => {
  if(values[0]){return res.status(422).json({success: false, error: 'username is already in use', errorCode: 1});}
  if(values[1]){return res.status(422).json({success: false, error: 'email is already in use', errorCode: 2});}
  const user = new User({
    username,
    email,
    password
  });

  user.save()
      .then( (data) => {return res.json({success: true, username: username, token: tokenForUser(data)})})
      .catch( (err) => {return(next(err))});
})
  .catch( (err) => {return(next(err))});
}

module.exports = signup;
