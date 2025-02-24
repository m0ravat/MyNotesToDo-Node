const express = require('express');
const projectController = require('../Controllers/projectController');

const router = express.Router();
router.get('/', projectController.projectGet);
router.get('/:id', projectController.projectGet);
router.post('/create', projectController.projectPost);
router.put('/:id', projectController.projectUpdate); 
router.delete('/:id', projectController.projectDelete); 
module.exports = router;