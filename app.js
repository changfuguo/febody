var express = require('express');
var config = require('./config/config');
var app = express();

require('./app/models');

require('./config/express')(app);

require('./config/routes')(app);


//listen port

app.listen(config.port);
module.exports = app;
