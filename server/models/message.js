const mongoose = require('mongoose');

var Message = mongoose.model('Message', {
  fromUser: {
    type: String,
    required: true,
    minlength: 1
  },
  toUser : {
    type: String,
    required: true,
    minlength: 1
  },
  subject: {
    type: String,
    required: true,
    minlength: 1
  },
  content: {
    type: String,
    required: true,
    minlength: 1
  },
});

module.exports = {Message};
