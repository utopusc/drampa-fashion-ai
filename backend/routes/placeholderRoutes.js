const express = require('express');
const router = express.Router();
const sharp = require('sharp');

// Generate placeholder image
router.get('/placeholder/:width/:height', async (req, res) => {
  try {
    const width = parseInt(req.params.width) || 400;
    const height = parseInt(req.params.height) || 600;
    
    // Create a simple placeholder image
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f0f0f0"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="20" fill="#999" text-anchor="middle" dy=".3em">
          ${width} × ${height}
        </text>
      </svg>
    `;
    
    // Convert SVG to PNG
    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(buffer);
  } catch (error) {
    console.error('Placeholder generation error:', error);
    res.status(500).send('Error generating placeholder');
  }
});

module.exports = router;