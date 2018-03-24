const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstname : {
    type: String,
    required: true,
    minlength: 1
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access}, 'secretabc123').toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.toJSON = function () {     //to return only id n username else it will return everthing include password so we overwrite moongoose method
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

var User = mongoose.model('User',UserSchema);

module.exports = {User};
