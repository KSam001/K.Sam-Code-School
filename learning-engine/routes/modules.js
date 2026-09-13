const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', moduleController.createModule);
router.get('/', moduleController.getUserModules);
router.get('/:id', moduleController.getModuleById);
router.delete('/:id', moduleController.deleteModule);

module.exports = router;