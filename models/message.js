var mongoose = require('mongoose');
const { DateTime} = require("luxon");

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        content: {type: String, required: true},
        timestamp: {type: Date, default: Date.now},
        owner: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    }
);

// Virtual for author's full name
MessageSchema
.virtual('due_formatted')
.get(function(){
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});


// Virtual for author's URL
MessageSchema
.virtual('url')
.get(function () {
    return '/index/message/' + this.id;
});

// Export model
module.exports = mongoose.model('Message', MessageSchema);