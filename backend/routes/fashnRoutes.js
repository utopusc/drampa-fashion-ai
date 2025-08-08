const express = require('express');
const router = express.Router();

// Get FASHN API key
router.get('/save-fashn-key', (req, res) => {
  const apiKey = process.env.FASHN_API_KEY || 'fa-whrqHxdK3cKN-bNe7HfPi8eYpJ3PaULanzj5H';
  res.json({ apiKey });
});

module.exports = router;