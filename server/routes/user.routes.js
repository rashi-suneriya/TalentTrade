const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getUsers
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getUsers);
router.get('/:id', getUserProfile);
router.put('/:id', protect, updateProfile);

module.exports = router;
