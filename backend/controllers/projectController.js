const Project = require('../models/Project');
const mongoose = require('mongoose');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, nodes = [], edges = [], viewport = {} } = req.body;

    const project = new Project({
      user: req.user.id,
      name: name || 'Untitled Project',
      description,
      nodes,
      edges,
      viewport,
      status: 'draft'
    });

    await project.save();

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Get all user projects
exports.getUserProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'lastModified' } = req.query;

    const result = await Project.getUserProjects(req.user.id, {
      status,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user owns this project
    if (!project.belongsToUser(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, nodes, edges, viewport, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.belongsToUser(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (nodes !== undefined) project.nodes = nodes;
    if (edges !== undefined) project.edges = edges;
    if (viewport !== undefined) project.viewport = viewport;
    if (status !== undefined && ['draft', 'published', 'archived'].includes(status)) {
      project.status = status;
    }

    await project.save();

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// Auto-save project (optimized for frequent updates)
exports.autoSaveProject = async (req, res) => {
  try {
    const { nodes, edges, viewport } = req.body;
    const projectId = req.params.id;
    
    console.log('Auto-save request received:', {
      projectId,
      userId: req.user.id,
      nodesCount: nodes?.length || 0,
      edgesCount: edges?.length || 0
    });

    // Use findOneAndUpdate for better performance
    const project = await Project.findOneAndUpdate(
      { 
        _id: projectId,
        user: req.user.id // Ensure user owns the project
      },
      {
        $set: {
          nodes,
          edges,
          viewport,
          lastModified: Date.now()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      console.log('Auto-save failed: Project not found or access denied');
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    console.log('Auto-save successful for project:', projectId);
    res.json({
      success: true,
      lastModified: project.lastModified
    });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({
      success: false,
      message: 'Auto-save failed',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.belongsToUser(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

// Duplicate project
exports.duplicateProject = async (req, res) => {
  try {
    const sourceProject = await Project.findById(req.params.id);

    if (!sourceProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!sourceProject.belongsToUser(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create a copy
    const projectData = sourceProject.toObject();
    delete projectData._id;
    delete projectData.createdAt;
    delete projectData.updatedAt;
    
    const newProject = new Project({
      ...projectData,
      name: `${projectData.name} (Copy)`,
      status: 'draft',
      user: req.user.id
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      project: newProject
    });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate project',
      error: error.message
    });
  }
};