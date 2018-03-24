var {User} = require('./../models/user');

var authenticate = (req,res,next) => {
  var token = req.header('x-auth');   //to fetch token from header to authenticate user

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.send(401).send();
  });
};

module.exports = {authenticate};
