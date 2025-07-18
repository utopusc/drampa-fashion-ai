const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Get user credits
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('credits');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
    });
  }
});

// Use credits (for when generating images)
router.post('/use-credits', authMiddleware, async (req, res) => {
  try {
    const { amount = 1 } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.credits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits',
        data: {
          required: amount,
          available: user.credits,
        },
      });
    }

    user.credits -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Credits used successfully',
      data: {
        creditsUsed: amount,
        remainingCredits: user.credits,
      },
    });
  } catch (error) {
    console.error('Use credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
    });
  }
});

// Add credits (for admin or payment processing)
router.post('/add-credits', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit amount',
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.credits += amount;
    await user.save();

    res.json({
      success: true,
      message: 'Credits added successfully',
      data: {
        creditsAdded: amount,
        totalCredits: user.credits,
      },
    });
  } catch (error) {
    console.error('Add credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
    });
  }
});

module.exports = router;