const { cloudinary } = require('../config/cloudinary');

// @desc    Upload image/video
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      duration: req.file.duration || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload lesson resource (PDF, ZIP, etc)
// @route   POST /api/upload/lesson-file
// @access  Private
exports.uploadLessonFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype.split('/')[1]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload chat attachment
// @route   POST /api/upload/chat-file
// @access  Private
exports.uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const type = req.file.mimetype.startsWith('image/') ? 'image' : 'file';

    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      name: req.file.originalname,
      size: req.file.size,
      type
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lesson resource
// @route   DELETE /api/upload/lesson-file/:publicId
// @access  Private
exports.deleteLessonFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
