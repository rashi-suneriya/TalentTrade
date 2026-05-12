const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversations
} = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
