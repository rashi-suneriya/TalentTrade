const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: "" },
  bio: { type: String, maxlength: 300 },
  role: { type: String, enum: ["learner", "teacher", "admin"], default: "learner" },
  isVerified: { type: Boolean, default: false },
  verifyToken: String,
  verifyTokenExp: Date,
  resetToken: String,
  resetTokenExp: Date,
  refreshToken: String,
  isTeacher: { type: Boolean, default: false },
  teacherProfile: {
    displayName: String,
    headline: String,
    bio: String,
    expertise: [String],
    socialLinks: {
      youtube: String,
      twitter: String,
      linkedin: String,
      website: String
    }
  },
  skillsOffered: [{
    title: String,
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    category: String
  }],
  skillsWanted: [{
    title: String,
    category: String
  }],
  tokens: { type: Number, default: 100 },
  totalSwaps: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  socialLinks: {
    github: String,
    linkedin: String,
    website: String
  },
  isActive: { type: Boolean, default: true },
  lastSeen: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
