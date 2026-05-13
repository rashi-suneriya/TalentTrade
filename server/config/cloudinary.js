const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 600000
});

console.log('Cloudinary Config Check:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 5) + '...' : 'undefined',
  has_secret: !!process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let resource_type = 'image';
    if (file.mimetype.startsWith('video')) {
      resource_type = 'video';
    }
    
    return {
      folder: 'skillswap',
      resource_type: resource_type,
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi', 'webm']
    };
  }
});

module.exports = { cloudinary, storage };
