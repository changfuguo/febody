/**
* unlimited category
* author : changfuguo
*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var CategorySchema = new Schema({
    
        name         :   {type: String}, //show name
        nick         :   {type: String}, //url name and so on 
        scope        :   {type: String},
        parent_id    :   {type: ObjectId},
        ancestors_id :   [Schema.Types.ObjectId],
    
        create_at    :   {type: Date , default: Date.now},
        update_at    :   {type: Date , default: Date.now},
        order        :   {type: Number , default: 0},
        status       :   {type: Number , default:1} , //1 normal ;0:disabled

        attr         :   Schema.Types.Mixed
    
    });




CategorySchema.index({create_at: -1});


mongoose.model('Category',CategorySchema);
