const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  block_list: [{
    username: {
      type:String,
      minlength: 1
    }
  }],
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

UserSchema.methods.toJSON = function () { //to return only id n username else it will return everthing include password so we overwrite moongoose method
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','username']);
};

//instance method to generate Authentication token and saving in user document
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access}, 'secretabc123').toString();

  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.addToBlocklist = function (username) {
  var user = this;
  //to check if user exist
  return User.find({username}).then((result_user) => {
    if (result_user.length === 0) {
      return Promise.reject(`${username} does not exist`);
    }
    else {
      //check if user is already blocked
      if ( _.find(user.block_list,{'username' : username})) {
        return username;
      }
      user.block_list = user.block_list.concat([{username}]);
      return user.save().then(() => {
        return username;
      });
    }
  });
};

UserSchema.methods.checkUserBlocked = function (toUser) {
  var user = this;

  // get object of receiving user
  return User.find({'username' : toUser}).then((to_user) => {
    //check if receiving user exist
    if(_.size(to_user) === 0) {
      return Promise.reject(`${toUser} does not exist`);
    }
    // to check if sender has blocked receiving user or vice-versa
    else if (
            _.find(user.block_list,{'username' : toUser}) ||
            _.find(to_user.block_list,{'username' : user.username})
          ) {
      return Promise.reject('User is blocked');
    }
    else {
      return Promise.resolve();
    }
  });
};

//Model method to find user by credentials(username and password)
UserSchema.statics.findByCredentials = function (username,password) {
  var User = this;

  return User.findOne({username}).then ((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err,res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//Model method to find user by token
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token,'secretabc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

//mongoose middleware run before saving document - used for hashing password
UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(user.password,salt, (err,hash) => {
          user.password = hash;
          next();
      });
    });
  }   else {
    next();
  }
});


var User = mongoose.model('User',UserSchema);

module.exports = {User};
