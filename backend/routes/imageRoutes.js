const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getUserImages, 
  toggleFavorite, 
  deleteImage, 
  getImageDetails 
} = require('../controllers/imageController');

// All routes require authentication
router.use(auth);

// Get user's images
router.get('/', getUserImages);

// Get specific image details
router.get('/:imageId', getImageDetails);

// Toggle favorite status
router.patch('/:imageId/favorite', toggleFavorite);

// Delete image (soft delete)
router.delete('/:imageId', deleteImage);

module.exports = router;