
//topic for 

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
        
        title        :   {type: String},
        content      :   {type: String},
        author_id    :   {type: ObjectId},
        category_id  :   {type: ObjectId },
        top          :   {type: Boolean, default: false},
        good         :   {type: Boolean, default: false},
        reply_count  :   {type: Number, default: 0},
        visit_count  :   {type: Number, default: 0},
        create_at    :   {type: Date, default: Date.now},
        update_at    :   {type: Date, default: Date.now},
        last_reply   :   {type: ObjectId, default: Date.now},
        last_reply_at:   {type: Date, default: Date.now},
        ishtml       :   {type: Boolean},
        status       :   {type: Number,default: 1} , //1 normal ;0 : disabled
    
    });


TopicSchema.index({create_at: -1});
TopicSchema.index({top: -1 ,last_reply_at: -1});

TopicSchema.index({last_reply_at: -1});
TopicSchema.index({author_id: 1, create_at: -1});




mongoose.model('Topic',TopicSchema);
