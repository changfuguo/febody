/**
* unlimited category
* date:2015-06-06
* author : changfuguo
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var NavigatorSchema = new Schema({
        name         :   {type: String}, //show name
		tip          :   {type: String}, //tip content
        url          :   {type: String}, //url name and so on
		type		 :   {type: Number}, //1:single page 2:category page  3:outside page
        parent_id    :   {type: ObjectId,default:"000000000000000000000000"},
        create_at    :   {type: Date , default: Date.now},
        update_at    :   {type: Date , default: Date.now},
        order        :   {type: Number , default: 0},
        status       :   {type: Number , default:1}  //1 normal ;0:disabled
    });

NavigatorSchema.index({create_at: -1});


mongoose.model('Navigator',NavigatorSchema);
