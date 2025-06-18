const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trajet: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet', required: true },
  dimensions: String,
  poids: String,
  typeColis: String,
  statut: { type: String, enum: ['en_attente', 'acceptee', 'refusee', 'livree'], default: 'en_attente' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Demande', demandeSchema);
