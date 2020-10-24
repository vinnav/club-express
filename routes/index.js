var express = require('express');
var router = express.Router();
var message_controller = require("../controllers/message_controller")

/* GET home page. */
router.get('/', message_controller.message_showAll);

module.exports = router;
