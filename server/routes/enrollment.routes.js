const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  updateProgress
} = require('../controllers/enrollment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/courses/:id/enroll', protect, enrollInCourse);
router.get('/my', protect, getMyEnrollments);
router.put('/courses/:id/progress', protect, updateProgress);

module.exports = router;
