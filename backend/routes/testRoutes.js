const express = require('express');
const router = express.Router();

// Test endpoint to verify server is responding
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Test CORS
router.post('/test-cors', (req, res) => {
  res.json({
    success: true,
    body: req.body,
    headers: req.headers.origin || 'No origin header'
  });
});

module.exports = router;