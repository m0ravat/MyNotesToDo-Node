const express = require('express');
const projectController = require('../Controllers/projectController');
const { requireAuth, validateProject, checkUser, laog, checkProject } = require('../Middleware/authMiddleware');
const cardRouter = require ('./cardRoutes');
const router = express.Router();
router.get('/', projectController.projectGet);
router.get('/:id',validateProject, checkProject, projectController.projectGetDetails);
router.post('/create', requireAuth, projectController.projectPost);
router.put('/:id', projectController.projectUpdate); 
router.delete('/:id', laog, projectController.projectDelete); 
router.post("/:id/addUser", checkProject, projectController.projectAddUser);

router.use('/:id/', cardRouter);
module.exports = router;