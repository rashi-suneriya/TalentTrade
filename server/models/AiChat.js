const mongoose = require('mongoose');

const aiChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lessonId: mongoose.Schema.Types.ObjectId,
  messages: [{
    role: { type: String, enum: ["user", "assistant"] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  queryCount: { type: Number, default: 0 },
  lastQueryDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiChat', aiChatSchema);
