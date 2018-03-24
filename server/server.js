const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');

var app = express();
app.use(bodyParser.json());

//for logging request
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  next();
});


app.listen(3000,() => {
  console.log('Started on port 3000');
});
