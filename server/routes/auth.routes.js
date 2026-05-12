const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  becomeTeacher
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.get('/verify/:token', verifyEmail);
router.post('/become-teacher', protect, becomeTeacher);

// Placeholder for forgot/reset password
router.post('/forgot-password', (req, res) => res.json({ message: 'Forgot password' }));
router.post('/reset/:token', (req, res) => res.json({ message: 'Reset password' }));

router.get('/me', protect, (req, res) => {
  const user = req.user.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.password;
  res.json({ success: true, user });
});

module.exports = router;
