const express = require("express");
const router = express.Router()
const userController = require('../controller/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/verify/:token', userController.verifyToken);

module.exports = router