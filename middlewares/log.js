var logger = require('log4js');
var config = require('../config/config');


var logPath = config.rootpath + 'logs/';


log4js.configure({
		
	appenders :[{
		type: "file",
		filename: logPath + 'febody.log',
		maxLogSize: 102400,
		backups: 3,
		category: ['app']
	},{
		type: "file",
		filename: logPath + 'febody.log.wf',
		maxLogSize: 102400,
		backups: 3
		category: ['error']
	
	}],
	levels:{
		'app': 'INFO',
		'error', 'ERROR'
	}
});
