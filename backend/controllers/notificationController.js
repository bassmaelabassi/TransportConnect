const Notification = require('../models/Notification');
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