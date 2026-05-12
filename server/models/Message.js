const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, maxlength: 1000 },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  attachment: {
    url: String,
    name: String,
    type: { type: String, enum: ["image", "file"] },
    size: Number,
    publicId: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
