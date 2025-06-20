const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);                                                                                                                             
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, telephone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      telephone,
      password: hashedPassword,
      role: role || 'expediteur'
    });

    try {
      await sendEmail(email, 'Bienvenue sur la plateforme', 'Votre compte a été créé avec succès.');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
    }
    res.status(201).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Register error:', err);
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Erreur serveur: ${err.message}`
      : 'Erreur serveur.';
    res.status(500).json({ message: errorMessage });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe invalide.' });

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err);
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Erreur serveur: ${err.message}`
      : 'Erreur serveur.';
    res.status(500).json({ message: errorMessage });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
