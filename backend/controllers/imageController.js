const GeneratedImage = require('../models/GeneratedImage');

// Get user's generated images
exports.getUserImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      page = 1, 
      limit = 20, 
      projectId, 
      isFavorite,
      sortBy = 'createdAt'
    } = req.query;

    const result = await GeneratedImage.getUserImages(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      projectId,
      isFavorite: isFavorite === 'true' ? true : isFavorite === 'false' ? false : null,
      sortBy
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
      error: error.message
    });
  }
};

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.id;

    const image = await GeneratedImage.findOne({ 
      _id: imageId, 
      user: userId,
      isDeleted: false 
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    image.isFavorite = !image.isFavorite;
    await image.save();

    res.json({
      success: true,
      isFavorite: image.isFavorite
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update favorite status'
    });
  }
};

// Delete image (soft delete)
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.id;

    const image = await GeneratedImage.findOneAndUpdate(
      { _id: imageId, user: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

// Get image details
exports.getImageDetails = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.id;

    const image = await GeneratedImage.findOne({ 
      _id: imageId, 
      user: userId,
      isDeleted: false 
    }).populate('project', 'name');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.json({
      success: true,
      image
    });
  } catch (error) {
    console.error('Get image details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image details'
    });
  }
};