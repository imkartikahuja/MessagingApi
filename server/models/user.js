const mongoose = require('mongoose');

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
  }
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


var User = mongoose.model('User',UserSchema);

module.exports = {User};
