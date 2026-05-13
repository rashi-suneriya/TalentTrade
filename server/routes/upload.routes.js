const express = require('express');
const router = express.Router();
const { uploadVideo, uploadImage, uploadLessonFile, uploadChatFile } = require('../middleware/upload.middleware');
const { uploadFile, deleteLessonFile } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadChatFile: uploadChatFileController, uploadLessonFile: uploadLessonFileController } = require('../controllers/upload.controller');

router.post('/video', protect, (req, res, next) => {
  uploadVideo(req, res, (err) => {
    if (err) {
      console.error('Video Upload Middleware Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadFile);

router.post('/image', protect, (req, res, next) => {
  uploadImage(req, res, (err) => {
    if (err) {
      console.error('Image Upload Middleware Error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadFile);

router.post('/lesson-file', protect, uploadLessonFile, uploadLessonFileController);
router.post('/chat-file', protect, uploadChatFile, uploadChatFileController);
router.delete('/lesson-file/:publicId', protect, deleteLessonFile);

module.exports = router;
