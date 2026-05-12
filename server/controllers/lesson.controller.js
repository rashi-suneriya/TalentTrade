const Course = require('../models/Course');
const { cloudinary } = require('../config/cloudinary');

// @desc    Add lesson to course
// @route   POST /api/lessons/courses/:id/lessons
// @access  Private (Owner)
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const { sectionTitle, lesson } = req.body;

    let section = course.curriculum.find(s => s.sectionTitle === sectionTitle);
    if (!section) {
      course.curriculum.push({ sectionTitle, lessons: [lesson] });
    } else {
      section.lessons.push(lesson);
    }

    course.totalLessons = (course.totalLessons || 0) + 1;
    course.totalDuration = (course.totalDuration || 0) + (lesson.videoDuration || 0);

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/courses/:id/lessons/:lid
// @access  Private (Owner)
exports.updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const { lid } = req.params;
    let found = false;

    course.curriculum.forEach(section => {
      const lessonIndex = section.lessons.findIndex(l => l._id.toString() === lid);
      if (lessonIndex !== -1) {
        section.lessons[lessonIndex] = { ...section.lessons[lessonIndex].toObject(), ...req.body };
        found = true;
      }
    });

    if (!found) return res.status(404).json({ message: 'Lesson not found' });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add resource to lesson
// @route   POST /api/lessons/courses/:courseId/lessons/:lessonId/resources
// @access  Private (Owner)
exports.addLessonResource = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    let found = false;
    course.curriculum.forEach(section => {
      const lesson = section.lessons.find(l => l._id.toString() === lessonId);
      if (lesson) {
        lesson.resources.push(req.body);
        found = true;
      }
    });

    if (!found) return res.status(404).json({ message: 'Lesson not found' });

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resource from lesson
// @route   DELETE /api/lessons/courses/:courseId/lessons/:lessonId/resources/:resourceId
// @access  Private (Owner)
exports.deleteLessonResource = async (req, res) => {
  try {
    const { courseId, lessonId, resourceId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    let found = false;
    let publicId = '';

    course.curriculum.forEach(section => {
      const lesson = section.lessons.find(l => l._id.toString() === lessonId);
      if (lesson) {
        const resourceIndex = lesson.resources.findIndex(r => r._id.toString() === resourceId);
        if (resourceIndex !== -1) {
          publicId = lesson.resources[resourceIndex].publicId;
          lesson.resources.splice(resourceIndex, 1);
          found = true;
        }
      }
    });

    if (!found) return res.status(404).json({ message: 'Resource not found' });

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
