const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExp,
      isVerified: process.env.NODE_ENV === 'development' // Auto-verify in development
    });

    if (process.env.NODE_ENV === 'production' || (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your@gmail.com')) {
      try {
        const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
        const html = `
          <h1>Verify your SkillSwap account</h1>
          <p>Hi ${name},</p>
          <p>Please click the link below to verify your email:</p>
          <a href="${verifyUrl}">Verify Email</a>
        `;

        await sendEmail({
          email: user.email,
          subject: 'Verify your SkillSwap account',
          html
        });
      } catch (emailError) {
        console.error('Email could not be sent:', emailError.message);
        // In development, we don't want to block registration if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: user.isVerified 
        ? 'Registration successful! You can now log in.' 
        : 'Registration successful. Please check your email to verify your account.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        tokens: user.tokens,
        bio: user.bio,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        socialLinks: user.socialLinks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExp: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExp = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Become a teacher
// @route   POST /api/auth/become-teacher
// @access  Private
exports.becomeTeacher = async (req, res) => {
  const { displayName, headline, bio, expertise, socialLinks } = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    if (user.isTeacher || user.role === 'teacher') {
      return res.status(400).json({ success: false, message: 'You are already a teacher' });
    }

    user.role = 'teacher';
    user.isTeacher = true;
    user.teacherProfile = {
      displayName,
      headline,
      bio,
      expertise: expertise || [],
      socialLinks: socialLinks || {}
    };

    await user.save();

    // Send welcome email
    if (process.env.NODE_ENV === 'production' || (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your@gmail.com')) {
      try {
        const html = `
          <h1>Welcome to SkillSwap Teaching!</h1>
          <p>Hi ${user.name},</p>
          <p>You are now a registered teacher on SkillSwap. You can start creating courses and sharing your knowledge.</p>
          <a href="${process.env.CLIENT_URL}/teach/dashboard">Go to Teacher Dashboard</a>
        `;

        await sendEmail({
          email: user.email,
          subject: 'Welcome to SkillSwap Teaching!',
          html
        });
      } catch (emailError) {
        console.error('Teacher welcome email could not be sent:', emailError.message);
      }
    }

    // Refresh token with new role
    const accessToken = generateAccessToken(user);

    res.json({ 
      success: true, 
      message: 'Successfully upgraded to teacher account',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isTeacher: user.isTeacher,
        teacherProfile: user.teacherProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
