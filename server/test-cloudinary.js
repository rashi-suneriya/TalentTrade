require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary credentials...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret (first 5 chars):', process.env.CLOUDINARY_API_SECRET?.substring(0, 5) + '...');

cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ SUCCESS! Cloudinary credentials are VALID!');
    console.log('Response:', result);
  })
  .catch(err => {
    console.log('\n❌ FAILED! Cloudinary credentials are INVALID!');
    console.log('Error:', err.message);
    console.log('\nPlease go to https://cloudinary.com/console and copy your exact API Secret.');
  });
