const express = require('express');
const router = express.Router();
const { uploadVideo, uploadImage, uploadLessonFile, uploadChatFile } = require('../middleware/upload.middleware');
const { uploadFile, deleteLessonFile } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadChatFile: uploadChatFileController, uploadLessonFile: uploadLessonFileController } = require('../controllers/upload.controller');

router.post('/video', protect, uploadVideo, uploadFile);
router.post('/image', protect, uploadImage, uploadFile);

router.post('/lesson-file', protect, uploadLessonFile, uploadLessonFileController);
router.post('/chat-file', protect, uploadChatFile, uploadChatFileController);
router.delete('/lesson-file/:publicId', protect, deleteLessonFile);

module.exports = router;
