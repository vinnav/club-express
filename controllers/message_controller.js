var Message = require('../models/message');
var async = require('async');
const { body,validationResult } = require("express-validator");


// GET request for signup. 
exports.message_showAll = function(req, res, next) {
    Message.find()
        .populate('owner')
        .exec(function(err, message_list){
            if(err){return next(err);}
            //Successful, so render
            res.render('index', {title: 'Club express', message_list: message_list})
        })
};