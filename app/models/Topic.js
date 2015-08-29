
//topic for 

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
        
        title        :   {type: String},
        content      :   {type: String},
        author_id    :   {type: ObjectId},
        category_id  :   {type: ObjectId ,default:'000000000000000000000000'}, // 000表示无分类的单页
        top          :   {type: Boolean, default: false},
        good         :   {type: Boolean, default: false},
        reply_count  :   {type: Number, default: 0},
        visit_count  :   {type: Number, default: 0},
        create_at    :   {type: Number, default: Date.now()},
        update_at    :   {type: Number, default: Date.now()},
        last_visit_at:   {type: Number, default: Date.now()},
        last_reply_at   :{type: Number,default:Date.now()},
		tags		 :   [{type:String}],
        status       :   {type: Number,default: 1} , //-1:delete ;0:caogao ;1:fabu
    
    });


TopicSchema.index({create_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});
mongoose.model('Topic',TopicSchema);
