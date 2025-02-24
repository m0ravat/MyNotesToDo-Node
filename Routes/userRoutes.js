const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();
router.get('/logout', userController.logoutGet);

router.get('/signup', userController.signupGet);
router.post('/signup', userController.signupPost);
router.get('/login', userController.loginGet);
router.post('/login', userController.loginPost);
module.exports = router;