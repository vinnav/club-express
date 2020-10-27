var Message = require('../models/message');
var async = require('async');
const { body,validationResult } = require("express-validator");


// GET request to show all messages. 
exports.messageList = async (req, res, next) => {
    try {
      return Object.values(await Message.find().populate('owner')).reverse();
    } catch (error) {
      next(err);
    }
  };

  
// GET New Message Form
exports.newMessageGet = (req, res) =>
req.user
  ? res.render('new-message', { title: 'Create New Message' })
  : res.redirect('/log-in');

// POST New Message Form
exports.newMessagePost = [
body('content')
  .isLength({ min: 2 })
  .withMessage('Message must be at least 2 characters long')
  .trim()
  .escape(),

async (req, res, next) => {
  const errors = validationResult(req);
  // Check if user signed in
  if (!req.user) res.redirect('/sign-up');
  // Render again if errors
  if (!errors.isEmpty()) {
    const message = new Message({
      content: req.body.content,
    });
    res.render('new-message', { message, errors: errors.array() });
  }
  try {
    const message = new Message({
      content: req.body.content,
      timestamp: Date.now(),
      owner: req.user._id,
    });
    await message.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
},
];


// Delete message
exports.deleteMessage = async (req, res, next) => {
if (req.user.permission === 'admin') {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}
};
