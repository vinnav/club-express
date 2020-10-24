#! /usr/bin/env node

console.log('This script populates some user and messages to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require('./models/user')
var Message = require('./models/message')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var messages = []

function userCreate(username, password, first_name, last_name, permission, cb) {
  userdetail = {
    username:username, 
    password:password, 
    first_name:first_name, 
    last_name: last_name, 
    permission:permission }
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New user: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}
// TO DO

function messageCreate(content, timestamp, owner, cb) {
  messagedetail = { 
    content:content,
    timestamp:timestamp,
    owner: owner,
  }    

  var message = new Message(messagedetail);    
  message.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Message: ' + message);
      cb(err, null)
      return
    }
    console.log('New Message: ' + message);
    messages.push(message)
    cb(null, message)
  }  );
}

function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate('user1', 'pass1', 'rob', 'smith', 'basic', callback);
        },
        function(callback) {
          userCreate('user2', 'pass2', 'rob2', 'smith2', 'premium', callback);
        },
        function(callback) {
          userCreate('admin', 'admin', 'admin', 'admin', 'admin', callback);
        }
        ],
        // optional callback
        cb);
}

function createMessages(cb) {
    async.parallel([
        function(callback) {
          messageCreate('This is a sample message', 2020-12-11, users[0], callback)
        }],
        // Optional callback
        cb);
}



async.series([
    createUsers,
    createMessages,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Messages: '+ messages);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
