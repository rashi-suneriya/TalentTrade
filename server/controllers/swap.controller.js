const Swap = require('../models/Swap');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { getIO } = require('../socket');

// @desc    Propose a new swap
// @route   POST /api/swaps
// @access  Private
exports.proposeSwap = async (req, res) => {
  try {
    const { receiver: receiverId, skillOffered, skillWanted, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot swap with yourself' });
    }

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const existingSwap = await Swap.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: { $in: ['pending', 'active'] }
    });

    if (existingSwap) {
      return res.status(400).json({ success: false, message: 'A pending/active swap already exists with this user' });
    }

    if (!skillOffered?.title || !skillWanted?.title) {
      return res.status(400).json({ success: false, message: 'Both skills (offered and wanted) must have a title' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const swap = await Swap.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered: {
        title: skillOffered.title,
        level: skillOffered.level,
        category: skillOffered.category
      },
      skillWanted: {
        title: skillWanted.title,
        level: skillWanted.level,
        category: skillWanted.category
      },
      message,
      expiresAt
    });

    // Create Notification
    const notification = await Notification.create({
      user: receiverId,
      type: 'swap_request',
      title: 'New Swap Request',
      body: `${req.user.name} wants to swap skills with you!`,
      link: `/swaps/${swap._id}`
    });

    // Emit socket event
    try {
      const io = getIO();
      io.to(receiverId).emit('notification:new', notification);
      io.to(receiverId).emit('swap:requested', { swap, fromUser: req.user });
    } catch (ioError) {
      console.error('Socket notification failed:', ioError.message);
      // Don't fail the whole request if only socket notification fails
    }

    res.status(201).json({ success: true, swap });
  } catch (error) {
    console.error('Propose Swap Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept swap
// @route   PATCH /api/swaps/:id/accept
// @access  Private (Receiver only)
exports.acceptSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });
    if (swap.receiver.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    swap.status = 'active';
    swap.updatedAt = Date.now();
    await swap.save();

    // Notify Sender
    const notification = await Notification.create({
      user: swap.sender,
      type: 'swap_accepted',
      title: 'Swap Request Accepted!',
      body: `${req.user.name} accepted your swap request.`,
      link: `/swaps/${swap._id}`
    });

    const io = getIO();
    io.to(swap.sender.toString()).emit('notification:new', notification);
    io.to(swap.sender.toString()).emit('swap:accepted', { swap, fromUser: req.user });

    res.json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete swap and award tokens
// @route   PATCH /api/swaps/:id/complete
// @access  Private
exports.completeSwap = async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.status === 'completed') return res.status(400).json({ message: 'Swap already completed' });

    swap.status = 'completed';
    swap.updatedAt = Date.now();

    if (!swap.tokensAwarded) {
      // Award 50 tokens to both
      await User.updateMany(
        { _id: { $in: [swap.sender, swap.receiver] } },
        { $inc: { tokens: 50, totalSwaps: 1 } }
      );
      swap.tokensAwarded = true;
    }

    await swap.save();

    // Notifications
    const io = getIO();
    [swap.sender, swap.receiver].forEach(async (userId) => {
      const notif = await Notification.create({
        user: userId,
        type: 'swap_completed',
        title: 'Swap Completed',
        body: 'You earned 50 SkillTokens!',
        link: `/swaps/${swap._id}`
      });
      io.to(userId.toString()).emit('notification:new', notif);
      io.to(userId.toString()).emit('swap:completed', { swap, tokensEarned: 50 });
    });

    res.json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get swap suggestions (AI Matching)
// @route   GET /api/swaps/suggestions
// @access  Private
exports.getSwapSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;
    const wantedTitles = currentUser.skillsWanted.map(s => s.title);
    const offeredTitles = currentUser.skillsOffered.map(s => s.title);

    // Find users who have what I want AND want what I have
    const suggestedUsers = await User.find({
      _id: { $ne: currentUser._id },
      isActive: true,
      'skillsOffered.title': { $in: wantedTitles },
      'skillsWanted.title': { $in: offeredTitles }
    }).select('name avatar bio skillsOffered skillsWanted averageRating totalSwaps');

    // Calculate compatibility score (simplified)
    const suggestions = suggestedUsers.map(user => {
      const matchingOffered = user.skillsOffered.filter(s => wantedTitles.includes(s.title)).length;
      const matchingWanted = user.skillsWanted.filter(s => offeredTitles.includes(s.title)).length;
      const score = ((matchingOffered + matchingWanted) / (currentUser.skillsOffered.length + currentUser.skillsWanted.length)) * 100;
      
      return {
        user,
        score: Math.round(score),
        matchingSkills: user.skillsOffered.filter(s => wantedTitles.includes(s.title))
      };
    }).sort((a, b) => b.score - a.score || b.user.averageRating - a.user.averageRating);

    res.json({ success: true, suggestions: suggestions.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
