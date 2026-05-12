const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "swap_request", "swap_accepted", "swap_declined",
      "swap_completed", "swap_rated", "message_received",
      "course_enrolled", "review_received", "token_awarded"
    ]
  },
  title: String,
  body: String,
  link: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
