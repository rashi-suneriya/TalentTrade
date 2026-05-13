const multer = require('multer');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Image Storage (Thumbnails, Avatars)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap/images',
    resource_type: 'image',
    format: async (req, file) => {
      const ext = file.mimetype.split('/')[1];
      if (ext === 'jpeg') return 'jpg';
      return ext;
    }
  }
});

// Video Storage (Local first for stability)
const videoDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

// Lesson Resources Storage (Raw files like PDF, ZIP)
const lessonFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap/resources',
    resource_type: 'raw',
  }
});

// Chat Storage
const chatFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap/chat',
    resource_type: 'auto',
  }
});

const uploadVideo = multer({
  storage: videoDiskStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
}).single('file');

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('file');

const uploadLessonFile = multer({
  storage: lessonFileStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).single('file');

const uploadChatFile = multer({
  storage: chatFileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

module.exports = {
  uploadVideo,
  uploadImage,
  uploadLessonFile,
  uploadChatFile
};
