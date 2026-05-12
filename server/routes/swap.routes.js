const express = require('express');
const router = express.Router();
const {
  proposeSwap,
  acceptSwap,
  completeSwap,
  getSwapSuggestions
} = require('../controllers/swap.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/suggestions', protect, getSwapSuggestions);
router.post('/', protect, proposeSwap);
router.patch('/:id/accept', protect, acceptSwap);
router.patch('/:id/complete', protect, completeSwap);

module.exports = router;
