const express = require('express');
const cardController = require('../Controllers/cardController');
const { requireAuth, validateProject, checkUser } = require('../Middleware/authMiddleware');
const router = express.Router();
router.post('/create', cardController.cardPost);
router.put('/:id', cardController.cardUpdate); 
router.delete('/:id', projectController.cardDelete); 
module.exports = router;