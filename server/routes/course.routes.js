const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  publishCourse
} = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');
const { teacher } = require('../middleware/admin.middleware');

router.get('/teacher/my-courses', protect, getMyCourses);
router.get('/', getCourses);
router.post('/', protect, teacher, createCourse);
router.get('/:id', getCourse);
router.put('/:id', protect, updateCourse);
router.post('/:id/publish', protect, publishCourse);

module.exports = router;
