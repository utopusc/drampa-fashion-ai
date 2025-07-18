const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateImage, getGenerationStatus } = require('../controllers/generationController');

// Test endpoint to check if generation routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Generation API is working',
    falConfigured: !!process.env.FAL_API_KEY
  });
});

// Protected routes
router.post('/generate', auth, generateImage);
router.get('/status/:requestId', auth, getGenerationStatus);

module.exports = router;