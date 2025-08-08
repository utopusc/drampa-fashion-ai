const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for memory storage (we'll upload to CDN)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
}).single('image');

// Upload middleware
exports.uploadMiddleware = upload;

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, type, category, description, tags } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!name || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and category are required'
      });
    }

    // Handle image upload
    let imageUrl = '/api/placeholder/400/600';
    let imagePublicId = null;
    
    if (req.file) {
      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `product-${uniqueSuffix}${path.extname(req.file.originalname)}`;
      const uploadPath = path.join(__dirname, '../uploads/products', filename);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      
      // Write file
      await fs.writeFile(uploadPath, req.file.buffer);
      
      // Set the image URL
      imageUrl = `/uploads/products/${filename}`;
      imagePublicId = filename;
    }

    // Parse tags if sent as JSON string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    // Create product
    const product = new Product({
      userId,
      name,
      type,
      category,
      description,
      tags: parsedTags,
      imageUrl,
      imagePublicId,
      metadata: req.file ? {
        width: 0, // TODO: Get actual dimensions
        height: 0,
        format: req.file.mimetype,
        size: req.file.size
      } : undefined
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
};

// Get user's products
exports.getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, search, page = 1, limit = 20 } = req.query;
    
    // Build query
    const query = { userId, isActive: true };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [search.toLowerCase()] } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get products with pagination
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const product = await Product.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;
    
    // Find product
    const product = await Product.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['name', 'type', 'category', 'description', 'tags'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        product[field] = updates[field];
      }
    });
    
    // Handle image update if provided
    if (req.file) {
      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `product-${uniqueSuffix}${path.extname(req.file.originalname)}`;
      const uploadPath = path.join(__dirname, '../uploads/products', filename);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      
      // Write file
      await fs.writeFile(uploadPath, req.file.buffer);
      
      // Update the image URL
      product.imageUrl = `/uploads/products/${filename}`;
      product.imagePublicId = filename;
    }
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const product = await Product.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Soft delete
    product.isActive = false;
    await product.save();
    
    // TODO: Delete image from CDN if using one
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Increment product usage (called when used in editor)
exports.incrementUsage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const product = await Product.findOne({
      _id: id,
      userId,
      isActive: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    await product.incrementUsage();
    
    res.json({
      success: true,
      message: 'Usage incremented',
      usageCount: product.usageCount
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment usage'
    });
  }
};