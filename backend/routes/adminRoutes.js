const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/stats', protect, roleMiddleware(['admin']), getStats);

module.exports = router; 