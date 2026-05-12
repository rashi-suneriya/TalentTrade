const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillOffered: {
    title: { type: String, required: true },
    level: String,
    category: String
  },
  skillWanted: {
    title: { type: String, required: true },
    level: String,
    category: String
  },
  message: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "declined", "active", "completed", "cancelled"],
    default: "pending"
  },
  sessions: [{
    date: Date,
    notes: String,
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    duration: Number,
    attachments: [{
      name: String,
      url: String,
      publicId: String,
      size: Number
    }]
  }],
  senderRating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  receiverRating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    ratedAt: Date
  },
  tokensAwarded: { type: Boolean, default: false },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Swap', swapSchema);
