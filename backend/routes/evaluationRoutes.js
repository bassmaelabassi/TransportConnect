const express = require('express');
const router = express.Router();
const {
  createEvaluation,
  getEvaluationsRecues,
  getDemandesAevaluer,
  getAverageRating,
} = require('../controllers/evaluationController');
const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createEvaluation);

router.get('/recues', protect, getEvaluationsRecues);

router.get('/a-evaluer', protect, getDemandesAevaluer);
router.get('/moyenne/:userId', getAverageRating);

module.exports = router; 