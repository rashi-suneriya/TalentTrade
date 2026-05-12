const express = require('express');
const router = express.Router();
const {
  askAI,
  getChatHistory
} = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/ask', protect, askAI);
router.get('/history/:lessonId', protect, getChatHistory);

module.exports = router;
