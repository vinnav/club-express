const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_Controller');
const message_controller = require("../controllers/message_controller")


/* GET home page. */
router.get('/', async function(req, res, next) {
    res.render('index', {
        title: 'Club express',
        user: req.user,
        messages: await message_controller.messageList(),
    });
});
//=======USER ROUTES=================

// GET Sign-Up Form
router.get('/sign-up', user_controller.userSignUpGet);

// POST Sign-Up Form
router.post('/sign-up', user_controller.userSignUpPost);

// GET Log-In Form
router.get('/log-in', user_controller.userLogInGet);

// POST Log-In Form
router.post('/log-in', user_controller.userLogInPost);

// Log-Out
router.get('/log-out', user_controller.userLogOut);

// GET Join Club Form
router.get('/join-club', user_controller.userJoinClubGet);

// POST Join Club Form
router.post('/join-club', user_controller.userJoinClubPost);

//=========MESSAGE ROUTES=============

// GET New Message Form
router.get('/new-message', message_controller.newMessageGet);

// POST New Message Form
router.post('/new-message', message_controller.newMessagePost);

// Delete Message
router.post('/delete/:id', message_controller.deleteMessage);

module.exports = router;
