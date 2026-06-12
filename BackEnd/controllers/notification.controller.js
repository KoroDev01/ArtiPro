const Notification = require("../database/models/notification.model");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.json({ message: "Marked as read" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: "All marked as read" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createNotification = async ({ recipient, type, message, link }) => {
  try {
    await Notification.create({ recipient, type, message, link });
  } catch (e) {
  }
};
