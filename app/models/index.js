/**
* index for all models
* author : changfuguo@qq.com
* date   : 2015-01-17
**/

var mongoose = require('mongoose');
var config = require('../../config/config');
var fs = require('fs');
var log = require('../../components/log');
var err_log = log.log('error');
var trc_log = log.log('trace');

/**
* connect to mongodb
*/
var db = null;
var connect = function(){
        
        var options = {server: {socketOptions: {keepAlive: 1} }};
        db = mongoose.connect(config.db, options);
};


//connect error handler

mongoose.connection.on('error',function(err){

    err_log.error('db-error:mongoose connection error:' + err); 
});

//reconnect when colosed
//max count 
var MAX_RECONNECT_COUNTER = 10 ;
var reconnect_count = 0;
mongoose.connection.on('disconnected', function(){
    
    connect();
    if(reconnect_count > MAX_RECONNECT_COUNTER){
        err_log.error('db-reconnect:mongoose connected up to maxcount'); 
        process.exit(1);
        reconnect_count = 0;
    } 

    reconnect_count++;
});


//on connected 

mongoose.connection.on('connected', function(){
    trc_log.info('db-connected:');
});



// load models except index
fs.readdirSync(__dirname).forEach(function(file){
    if(~file.indexOf('.js') && file.substr(-3) == '.js' && file !== 'index.js'){
        require(__dirname + '/' + file);    
    }
});

//start connect to db
connect();

