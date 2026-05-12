const multer = require('multer');
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

// Video Storage
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'skillswap/videos',
    resource_type: 'video',
    format: 'mp4',          // Always deliver as MP4 so the URL has an extension players can detect
    transformation: [{ quality: 'auto' }]
  })
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
  storage: videoStorage,
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
