const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create new project
router.post('/', projectController.createProject);

// Get all user projects
router.get('/', projectController.getUserProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Update project
router.put('/:id', projectController.updateProject);

// Auto-save project (lightweight update)
router.patch('/:id/autosave', projectController.autoSaveProject);

// Delete project
router.delete('/:id', projectController.deleteProject);

// Duplicate project
router.post('/:id/duplicate', projectController.duplicateProject);

module.exports = router;