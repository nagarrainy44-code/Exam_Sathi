const express = require('express');
const router = express.Router();
const { getProgress, toggleTopic, markComplete } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProgress);
router.post('/toggle', protect, toggleTopic);
router.post('/mark', protect, markComplete);

module.exports = router;
