const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.get('/create', userController.user_create_get);
router.post('/', userController.user_create_post);
router.get('/:id', userController.user_details);
router.delete('/:id', userController.user_delete);

module.exports = router;