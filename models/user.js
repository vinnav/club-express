const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, minlength: 1 },
    last_name: { type: String, required: true, minlength: 1 },
    username: { type: String, required: true, minlength: 1 },
    password: { type: String, required: true, minlength: 1, trim: true },
    permission: {
      type: String,
      enum: ['basic', 'member', 'admin'],
      default: 'basic',
        },
});

// Virtual for author's full name
UserSchema.virtual('fullname').get(function() {
    return this.first_name + ' ' + this.last_name;
  });

// Export model
module.exports = mongoose.model('User', UserSchema);