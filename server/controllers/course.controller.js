const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher/Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category, level, tags, language, price, isFree, curriculum } = req.body;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      level,
      tags,
      language,
      price,
      isFree,
      curriculum,
      teacher: req.user._id
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get teacher's own courses
// @route   GET /api/courses/teacher/my-courses
// @access  Private (Teacher)
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .select('title thumbnail category isPublished enrolledCount createdAt')
      .sort('-createdAt');
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  const { category, level, search } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  try {
    const courses = await Course.find(filter)
      .populate('teacher', 'name avatar')
      .sort('-publishedAt');
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name avatar bio');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Owner/Admin)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    console.log('Incoming Curriculum Sample:', JSON.stringify(req.body.curriculum?.[0]?.lessons?.[0], null, 2));

    // Manually update fields to ensure Mongoose detects changes in nested arrays
    if (req.body.curriculum) {
      course.curriculum = req.body.curriculum;
    }
    
    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'curriculum') {
        course[key] = req.body[key];
      }
    });

    const updatedCourse = await course.save();
    console.log('Course saved successfully. First lesson videoUrl:', updatedCourse.curriculum?.[0]?.lessons?.[0]?.videoUrl);

    res.json({ success: true, course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish course
// @route   POST /api/courses/:id/publish
// @access  Private (Owner)
exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacher.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    // Validate required fields before publishing
    const missingFields = [];
    if (!course.description) missingFields.push('description');
    if (!course.thumbnail) missingFields.push('thumbnail');
    if (!course.category) missingFields.push('category');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}. Please fill them before publishing.` 
      });
    }

    course.isPublished = true;
    course.publishedAt = Date.now();
    await course.save();

    res.json({ success: true, message: 'Course published' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
