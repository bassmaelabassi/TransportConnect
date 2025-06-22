const express = require('express');
const router = express.Router();
const { getStats, getRecentAnnonces, getRecentUsers, updateUserStatus, deleteAnnonce, updateAnnonce } = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/stats', protect, roleMiddleware(['admin']), getStats);
router.get('/recent-annonces', protect, roleMiddleware(['admin']), getRecentAnnonces);
router.get('/recent-users', protect, roleMiddleware(['admin']), getRecentUsers);
router.patch('/user/:id', protect, roleMiddleware(['admin']), updateUserStatus);
router.delete('/annonce/:id', protect, roleMiddleware(['admin']), deleteAnnonce);
router.patch('/annonce/:id', protect, roleMiddleware(['admin']), updateAnnonce);

module.exports = router; 