const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -verifyToken -resetToken');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if it's the own user or admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const { name, bio, skillsOffered, skillsWanted, socialLinks, avatar } = req.body;

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;
    user.socialLinks = socialLinks || user.socialLinks;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        tokens: updatedUser.tokens,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        bio: updatedUser.bio,
        socialLinks: updatedUser.socialLinks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
  const { query, skill, category } = req.query;
  const filter = { isActive: true };

  if (query) {
    filter.name = { $regex: query, $options: 'i' };
  }

  if (skill) {
    filter['skillsOffered.title'] = { $regex: skill, $options: 'i' };
  }

  if (category) {
    filter['skillsOffered.category'] = category;
  }

  try {
    const users = await User.find(filter).select('name avatar bio role skillsOffered averageRating totalSwaps');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
