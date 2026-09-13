const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/review', progressController.recordReview);
router.get('/due', progressController.getDueReviews);

module.exports = router;