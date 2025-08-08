const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['top', 'bottom', 'dress', 'outerwear'],
    index: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required']
  },
  imagePublicId: {
    type: String, // For cloudinary or other CDN deletion
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    width: Number,
    height: Number,
    format: String,
    size: Number // in bytes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ userId: 1, type: 1 });
productSchema.index({ userId: 1, createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted date
productSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to increment usage
productSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  this.lastUsedAt = new Date();
  return this.save();
};

// Static method to get user's products by type
productSchema.statics.getUserProductsByType = async function(userId, type) {
  return this.find({ userId, type, isActive: true })
    .sort({ createdAt: -1 })
    .lean();
};

// Static method for searching products
productSchema.statics.searchUserProducts = async function(userId, query) {
  const searchQuery = {
    userId,
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [query.toLowerCase()] } }
    ]
  };
  
  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .lean();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;