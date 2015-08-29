var express = require('express');
var config = require('./config/config');
var app = express();

var log4js = require('log4js');
log4js.configure('./config/log4js.json');

require('./app/models');

require('./config/express')(app);

require('./config/routes')(app);

var log  = log4js.getLogger('app');

//listen port
app.listen(config.port);
module.exports = app;
