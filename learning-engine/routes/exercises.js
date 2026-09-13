const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', exerciseController.createExercise);
router.get('/module/:moduleId', exerciseController.getExercisesByModule);

module.exports = router;