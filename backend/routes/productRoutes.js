const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Product routes
router.post('/', productController.uploadMiddleware, productController.createProduct);
router.get('/', productController.getUserProducts);
router.get('/:id', productController.getProduct);
// Update can be either JSON or multipart (with image)
router.put('/:id', (req, res, next) => {
  // Check if content-type is multipart/form-data
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    productController.uploadMiddleware(req, res, next);
  } else {
    next();
  }
}, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/usage', productController.incrementUsage);

module.exports = router;