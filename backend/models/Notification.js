const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String, 
  },
  type: {
    type: String,
    enum: ['demande', 'acceptation', 'refus', 'evaluation', 'general'],
    default: 'general'
  },
  relatedDemande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demande'
  },
  actions: [{
    label: String,
    action: String,
    url: String
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema); 