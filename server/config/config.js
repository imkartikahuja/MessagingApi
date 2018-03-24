var env = process.env.NODE_ENV || 'development';
console.log('env ****', env);

if (env === 'development') {
  var config = require('./config.json');  //automatically converts json to JS object
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
