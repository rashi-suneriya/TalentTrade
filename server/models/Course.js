const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 2000 },
  thumbnail: { type: String },
  category: { type: String },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  tags: [String],
  language: { type: String, default: "English" },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  curriculum: [{
    sectionTitle: String,
    lessons: [{
      title: String,
      description: String,
      videoUrl: String,
      videoDuration: Number,
      publicId: String,
      notes: String,
      resources: [{
        name: String,
        url: String,
        publicId: String,
        type: { type: String, enum: ["pdf", "doc", "zip", "image", "other"] },
        size: Number,
        uploadedAt: { type: Date, default: Date.now }
      }],
      quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number, // Index of the correct option
        explanation: String
      }],
      liveSession: {
        date: Date,
        duration: Number, // in minutes
        platform: { type: String, enum: ["Zoom", "Google Meet", "Custom"] },
        link: String
      },
      isFree: { type: Boolean, default: false },
      order: Number
    }]
  }],
  totalDuration: Number,
  totalLessons: Number,
  enrolledCount: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    score: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
