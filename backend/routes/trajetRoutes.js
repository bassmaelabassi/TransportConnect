const express = require('express');
const router = express.Router();
const {
  createTrajet,
  getTrajets,
  getMyTrajets,
  deleteTrajet,
} = require('../controllers/trajetController');

const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', protect, roleMiddleware(['conducteur']), createTrajet);
router.get('/', protect, getTrajets);
router.get('/mes-trajets', protect, roleMiddleware(['conducteur']), getMyTrajets);
router.delete('/:id', protect, roleMiddleware(['conducteur', 'admin']), deleteTrajet);

module.exports = router;
