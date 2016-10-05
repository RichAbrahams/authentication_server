const User = require('../models/user');
const tokenForUser = require('./generateToken');

function signup (req, res, next){
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if(!username){return res.status(422).json({success: false, error: 'username is required'});}
  if(!email){return res.status(422).json({success: false, error: 'email is required'});}
  if(!password){return res.status(422).json({success: false, error: 'password is required'});}

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
  if(values[0]){return res.status(422).json({success: false, error: 'username is already in use'});}
  if(values[1]){return res.status(422).json({success: false, error: 'email is already in use'});}
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
