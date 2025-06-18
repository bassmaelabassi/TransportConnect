const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['conducteur', 'expediteur', 'admin'], default: 'expediteur' },
  isVerified: { type: Boolean, default: false },
  badgeVerifie: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
