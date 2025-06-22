const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  conducteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  depart: String,
  etapes: [String],
  destination: String,
  date: String,
  heure: String,
  prix: Number,
  capacite: Number,
  dimensions: String,
  typeMarchandise: String,
  description: String,
  demandesAssociees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Demande' }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Trajet', trajetSchema);
