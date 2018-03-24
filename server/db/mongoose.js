var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to Mongo instance.')
}, (err) => {
  console.log('Error connecting to Mongo instance: ', err);
});

module.export = { mongoose };
