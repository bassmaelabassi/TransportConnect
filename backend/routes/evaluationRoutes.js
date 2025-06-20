const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEvaluation,
  getEvaluationsByUser,
  getAverageRating,
  updateEvaluation,
  deleteEvaluation,
  getAllEvaluations,
  getEvaluationsRecues,
  getEvaluationsDonnees,
} = require('../controllers/evaluationController');

const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const evaluationValidation = [
  body('note')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('commentaire')
    .isLength({ min: 10, max: 500 })
    .withMessage('Le commentaire doit contenir entre 10 et 500 caractères'),
];

router.get('/user/:userId', protect, getEvaluationsByUser);
router.get('/average/:userId', protect, getAverageRating);
router.get('/recues', protect, getEvaluationsRecues);
router.get('/donnees', protect, getEvaluationsDonnees);

router.post('/', protect, evaluationValidation, createEvaluation);
router.put('/:evaluationId', protect, evaluationValidation, updateEvaluation);
router.delete('/:evaluationId', protect, deleteEvaluation);

router.get('/', protect, roleMiddleware(['admin']), getAllEvaluations);

module.exports = router; 