const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  demande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demande',
    required: true
  },
  evaluateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evalue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});
evaluationSchema.index({ demande: 1, evaluateur: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
