const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload image/video
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  let localFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const originalName = req.file.originalname || '';
    const isVideo = (req.file.mimetype && req.file.mimetype.startsWith('video/')) || 
                    ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(originalName.split('.').pop().toLowerCase());

    console.log(`Processing ${isVideo ? 'video' : 'image/file'} upload:`, originalName);

    let result;
    if (isVideo) {
      localFilePath = req.file.path;
      console.log('Uploading video to Cloudinary:', localFilePath);
      
      try {
        // Try regular upload with 'auto' resource type
        result = await cloudinary.uploader.upload(localFilePath, {
          folder: 'skillswap/videos',
          resource_type: 'auto',
          timeout: 120000 
        });
      } catch (err) {
        console.warn('Regular upload failed, trying upload_large:', err.message);
        result = await cloudinary.uploader.upload_large(localFilePath, {
          folder: 'skillswap/videos',
          resource_type: 'auto',
          chunk_size: 6000000, 
        });
      }

      console.log('Cloudinary Upload Result Summary:', {
        public_id: result?.public_id,
        resource_type: result?.resource_type,
        url: result?.secure_url
      });

      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      localFilePath = null;
    } else {
      result = {
        secure_url: req.file.path,
        public_id: req.file.filename,
        duration: req.file.duration || 0
      };
    }

    const finalUrl = result?.secure_url || result?.url;
    if (!finalUrl) {
      console.error('Invalid Cloudinary result object:', result);
      return res.status(500).json({ 
        success: false, 
        message: 'Cloudinary failed to return a valid URL. Please check server logs.',
        debug: result 
      });
    }

    res.json({
      success: true,
      url: finalUrl,
      publicId: result.public_id,
      duration: result.duration || 0
    });
  } catch (error) {
    console.error('Upload Error:', error);
    // Cleanup local file on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      try { fs.unlinkSync(localFilePath); } catch (e) { console.error('Cleanup Error:', e); }
    }
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
