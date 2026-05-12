const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  progress: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    completed: { type: Boolean, default: false },
    watchTime: Number,
    completedAt: Date
  }],
  percentComplete: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  certificateUrl: String,
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
