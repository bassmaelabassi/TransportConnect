const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  updateUserById,
  deleteUser,
  setVerifiedBadge,
  suspendUser,
  activateUser,
  getMe,
} = require('../controllers/userController');

const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', protect, roleMiddleware(['admin']), getAllUsers);
router.put('/me', protect, updateUser);
router.get('/me', protect, getMe);
router.put('/:id', protect, roleMiddleware(['admin']), updateUserById);
router.delete('/:id', protect, roleMiddleware(['admin']), deleteUser);
router.put('/verify/:id', protect, roleMiddleware(['admin']), setVerifiedBadge);
router.put('/suspend/:id', protect, roleMiddleware(['admin']), suspendUser);
router.put('/activate/:id', protect, roleMiddleware(['admin']), activateUser);

module.exports = router;
