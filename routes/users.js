var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/user_Controller');

// GET request for signup. 
router.get('/signup', user_controller.user_signup_get);

// POST request for signup. 
router.post('/signup', user_controller.user_signup_post);

// GET request for login. 
router.get('/login', user_controller.user_login_get);

// POST request for login. 
router.post('/login', user_controller.user_login_post);

// GET request for logout. 
router.get('/logout', user_controller.user_logout_get);

module.exports = router;