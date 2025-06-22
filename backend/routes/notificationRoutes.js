const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', authMiddleware, getNotifications);
router.put('/read', authMiddleware, markAsRead);

module.exports = router; 