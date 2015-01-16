/**
*   user model for all
*/

var mongoose = require('mongoose');
var Schema   = mongoose.Schema ;


var UserSchema = new Schema({
        name :{ type : String},
        loginname:{type : String},
        pass :{type : String},
        email:{type:String},
        signature :{type : String},
        profile_image_url :{type:String},

        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: Date.now }, 
   
        status :{type:String} , // 1 :normal ;0:disabled
        last_login_time :{type:Date , default : Date.now},
        accessToken :{type:String},
        
        lastLogin :{type:Date,Default:Date.now}
    
    });


UserSchema.index({loginname:1},{unique:true});
UserSchema.index({email:1},{unique:true});
UserSchema.index({accessToken:1});

mongoose.model('User',UserSchema);
