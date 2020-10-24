var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        first_name: {type: String, maxlength: 20},
        last_name: {type: String, maxlength: 30},
        permission: {
            type: String, 
            enum: ['basic', 'premium', 'admin'], 
            default: 'basic'
        },
    }
);

// Virtual for author's full name
UserSchema
.virtual('name')
.get(function (){

    var fullname = '';
    if (this.first_name && this.last_name){
        fullname = this.last_name + ', ' + this.first_name;
    }
    if (!this.first_name || !this.last_name){
        fullname = '';
    }

    return fullname;
});

// Virtual for author's URL
UserSchema
.virtual('url')
.get(function () {
    return '/index/user/' + this.id;
});

// Export model
module.exports = mongoose.model('User', UserSchema);