const mongoose = require('mongoose');

const GeneratedImageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  model: {
    id: String,
    name: String,
    loraUrl: String
  },
  styleItems: [{
    type: {
      type: String,
      enum: ['background', 'pose', 'fashion']
    },
    name: String,
    tag: String
  }],
  metadata: {
    width: Number,
    height: Number,
    imageSize: String,
    seed: Number,
    contentType: String
  },
  tags: [String],
  isFavorite: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
GeneratedImageSchema.index({ user: 1, createdAt: -1 });
GeneratedImageSchema.index({ user: 1, isFavorite: 1, createdAt: -1 });
GeneratedImageSchema.index({ user: 1, project: 1, createdAt: -1 });

// Virtual for age
GeneratedImageSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Static method to get user's images
GeneratedImageSchema.statics.getUserImages = async function(userId, options = {}) {
  const { 
    page = 1, 
    limit = 20, 
    projectId = null,
    isFavorite = null,
    sortBy = 'createdAt',
    sortOrder = -1 
  } = options;

  const query = { 
    user: userId,
    isDeleted: false 
  };
  
  if (projectId) query.project = projectId;
  if (isFavorite !== null) query.isFavorite = isFavorite;

  const images = await this.find(query)
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('project', 'name')
    .exec();

  const count = await this.countDocuments(query);

  return {
    images,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalImages: count
  };
};

module.exports = mongoose.model('GeneratedImage', GeneratedImageSchema);