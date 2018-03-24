const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Message} = require('./models/message');
var {authenticate} = require('./middleware/authenticate');

var app = express();
app.use(bodyParser.json());

//for logging request
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  next();
});

app.post('/login', async (req,res) => {
  try {
    const credentials = _.pick(req.body,['username'],['password']);
    const user = await User.findByCredentials(credentials.username,credentials.password);
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/register', async (req,res) => {
  try {
    var credentials = _.pick(req.body,['username'],['password'],['firstname'],['lastname']);
    var user = new User(credentials);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/sendmessage', authenticate, async (req,res) => {
  try {
    var body = _.pick(req.body,['toUser'],['subject'],['content']);
    body.fromUser = req.user.username;
    var message = new Message(body);
    await message.save();
    res.send(message);
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(3000,() => {
  console.log('Started on port 3000');
});
