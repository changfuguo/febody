var log4js = require('log4js');
log4js.configure({
    
    appenders:[
        {
            category:'console',
            type    :'console'
        },{
            category: "console",
            type:"file",
            filename:'console.log',
            maxLogSize : 300 ,
            backups :false
            
        },{
            type:'dateFile',
            filename :'debug',
            pattern:'_yyyy-MM-dd.log',
            maxLogSize:'102',
            alwaysIncludePattern: true,
            backups :5,
            category:'normal'
        },{
            type:'file',
            filename :'node-error',
            maxLogSize :200,
            category:'node-error',
            backups : 5
            
        }
    ]    
})


var conLogger =  log4js.getLogger('console');

for(var i = 0; i < 1000;i++){
    console.log('aaa' + i)
}

var normal = log4js.getLogger('normal');



for( var i = 0 ; i < 2000 ;i++){
    
    //normal.error('%d is start :',i);
    //normal.info('debug normal info');
}

var nodeerror = log4js.getLogger('node-error');
for( var i = 0 ; i < 2000 ;i++){
   // nodeerror.error('here is a start error ,ok  pleas suer it is rigt ' + i)    
}
