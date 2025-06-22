const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
      
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur du serveur");
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    
    res.json({ message: 'Notifications marquées comme lues' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur du serveur");
  }
};

module.exports = {
  getNotifications,
  markAsRead,
}; 