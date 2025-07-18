const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  nodes: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  edges: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  viewport: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    zoom: { type: Number, default: 1 }
  },
  thumbnail: String,
  lastModified: {
    type: Date,
    default: Date.now
  },
  autoSaveEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
ProjectSchema.index({ user: 1, status: 1, lastModified: -1 });
ProjectSchema.index({ user: 1, createdAt: -1 });

// Update lastModified on save
ProjectSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Method to check if project belongs to user
ProjectSchema.methods.belongsToUser = function(userId) {
  return this.user.toString() === userId.toString();
};

// Static method to get user's projects
ProjectSchema.statics.getUserProjects = async function(userId, options = {}) {
  const { 
    status = null, 
    page = 1, 
    limit = 10, 
    sortBy = 'lastModified',
    sortOrder = -1 
  } = options;

  const query = { user: userId };
  if (status) query.status = status;

  const projects = await this.find(query)
    .sort({ [sortBy]: sortOrder })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-edges') // Keep nodes for preview, exclude edges
    .exec();
    
  // Limit nodes to first 5 for preview performance
  const processedProjects = projects.map(project => {
    const projectObj = project.toObject();
    if (projectObj.nodes && projectObj.nodes.length > 5) {
      projectObj.nodes = projectObj.nodes.slice(0, 5);
    }
    return projectObj;
  });

  const count = await this.countDocuments(query);

  return {
    projects: processedProjects,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalProjects: count
  };
};

module.exports = mongoose.model('Project', ProjectSchema);