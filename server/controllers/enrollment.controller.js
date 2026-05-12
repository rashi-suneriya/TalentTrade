const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: req.params.id
    });

    course.enrolledCount += 1;
    await course.save();

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id }).populate('course', 'title thumbnail teacher category');
    res.json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/courses/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId, watchTime, completed } = req.body;
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id
    });

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    let progressItem = enrollment.progress.find(p => p.lessonId.toString() === lessonId);
    if (!progressItem) {
      enrollment.progress.push({
        lessonId,
        watchTime,
        completed,
        completedAt: completed ? Date.now() : null
      });
    } else {
      progressItem.watchTime = watchTime || progressItem.watchTime;
      if (completed && !progressItem.completed) {
        progressItem.completed = true;
        progressItem.completedAt = Date.now();
      }
    }

    // Calculate percent complete
    const course = await Course.findById(req.params.id);
    const completedLessons = enrollment.progress.filter(p => p.completed).length;
    enrollment.percentComplete = Math.round((completedLessons / course.totalLessons) * 100);

    if (enrollment.percentComplete === 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = Date.now();
    }

    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
