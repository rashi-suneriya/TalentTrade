const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getUsers,
  getPublicProfile
} = require('../controllers/user.controller');
const { getConversations } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getUsers);
router.get('/me/conversations', protect, getConversations);
router.get('/:id', getUserProfile);
router.get('/:id/public', getPublicProfile);
router.put('/:id', protect, updateProfile);

module.exports = router;
