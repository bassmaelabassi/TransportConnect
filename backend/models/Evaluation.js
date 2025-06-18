const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
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
    required: true,
    minlength: 10,
    maxlength: 500
  }
}, {
  timestamps: true
});

evaluationSchema.index({ evaluateur: 1, evalue: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
