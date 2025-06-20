const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authControllers');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post(
  '/register',
  [
    body('nom').notEmpty().withMessage('Nom requis'),
    body('prenom').notEmpty().withMessage('Prénom requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('telephone').notEmpty().withMessage('Téléphone requis'),
    body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  ],
  register
);

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
