const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, createNotification } = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.post('/', protect, admin, createNotification);

module.exports = router;
