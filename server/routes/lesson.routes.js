const express = require('express');
const router = express.Router();
const {
  addLesson,
  updateLesson,
  addLessonResource,
  deleteLessonResource
} = require('../controllers/lesson.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/courses/:id/lessons', protect, addLesson);
router.put('/courses/:id/lessons/:lid', protect, updateLesson);

router.post('/courses/:courseId/lessons/:lessonId/resources', protect, addLessonResource);
router.delete('/courses/:courseId/lessons/:lessonId/resources/:resourceId', protect, deleteLessonResource);

module.exports = router;
