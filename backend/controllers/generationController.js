const User = require('../models/User');
const GeneratedImage = require('../models/GeneratedImage');
const fal = require('@fal-ai/serverless-client');

// Configure Fal.ai
fal.config({
  credentials: process.env.FAL_API_KEY
});

// Image generation controller
exports.generateImage = async (req, res) => {
  try {
    const { prompt, imageSize, loraUrl, numImages, projectId, modelData, styleItems } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required'
      });
    }

    // Get user and check credits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate cost (assuming 1 credit per image)
    const cost = numImages || 1;
    
    // Check if user is admin (bruceoz@gmail.com) or has admin role
    const isAdmin = user.email === 'bruceoz@gmail.com' || user.role === 'admin';
    
    if (!isAdmin && user.credits < cost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits',
        currentCredits: user.credits,
        requiredCredits: cost
      });
    }

    // Check if FAL_API_KEY is configured
    if (!process.env.FAL_API_KEY) {
      console.error('FAL_API_KEY not configured');
      return res.status(500).json({
        success: false,
        message: 'Image generation service not configured'
      });
    }

    console.log('Generating image for user:', userId, {
      prompt: prompt.substring(0, 50) + '...',
      imageSize,
      numImages
    });

    try {
      // Prepare LoRA configuration
      const loraConfig = loraUrl ? [{ path: loraUrl }] : [];
      
      console.log('Calling Fal.ai with LoRA:', loraConfig);
      
      // Try different endpoint based on whether we have LoRA
      let result;
      
      if (loraUrl) {
        // Map custom image sizes to width/height
        const sizeMap = {
          'square': { width: 1024, height: 1024 },
          'square_hd': { width: 1024, height: 1024 },
          'portrait_4_3': { width: 768, height: 1024 },
          'portrait_16_9': { width: 576, height: 1024 },
          'landscape_4_3': { width: 1024, height: 768 },
          'landscape_16_9': { width: 1024, height: 576 }
        };
        
        let dimensions;
        if (imageSize === 'custom' && req.body.customWidth && req.body.customHeight) {
          dimensions = { 
            width: Math.min(2048, Math.max(256, req.body.customWidth)),
            height: Math.min(2048, Math.max(256, req.body.customHeight))
          };
        } else {
          dimensions = sizeMap[imageSize] || sizeMap['square_hd'];
        }
        
        // Use flux-lora endpoint when we have a LoRA
        console.log('Using flux-lora endpoint with LoRA, dimensions:', dimensions, 'num_images:', numImages);
        
        // According to Fal.ai docs, we should pass image_size as an object for custom sizes
        const imageSizeParam = imageSize === 'custom' 
          ? { width: dimensions.width, height: dimensions.height }
          : imageSize;
        
        result = await fal.run("fal-ai/flux-lora", {
          input: {
            prompt: prompt,
            image_size: imageSizeParam,
            num_images: numImages || 1,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            loras: [{
              path: loraUrl,
              scale: 1
            }]
          }
        });
        
        console.log('Generated images count:', result.images?.length);
      } else {
        // Use standard flux/dev endpoint without LoRA
        console.log('Using standard flux/dev endpoint');
        result = await fal.run("fal-ai/flux/dev", {
          input: {
            prompt: prompt,
            image_size: imageSize || "square_hd",
            num_images: numImages || 1,
            enable_safety_checker: true
          }
        });
      }

      console.log('Fal.ai response:', result);

      // Check if images were generated
      if (!result.images || result.images.length === 0) {
        throw new Error('No images generated');
      }

      // Deduct credits (skip for admin users)
      if (!isAdmin) {
        user.credits -= cost;
        await user.save();
        console.log('Image generation successful, credits deducted:', cost);
      } else {
        console.log('Image generation successful for admin user, no credits deducted');
      }

      // Save generated images to database
      const savedImages = [];
      for (const img of result.images) {
        const imageDoc = new GeneratedImage({
          user: userId,
          project: projectId,
          url: img.url,
          prompt: prompt,
          model: modelData || {},
          styleItems: styleItems || [],
          metadata: {
            width: img.width || 1024,
            height: img.height || 1024,
            imageSize: imageSize,
            seed: result.seed,
            contentType: img.content_type || 'image/jpeg'
          },
          tags: []
        });
        
        const saved = await imageDoc.save();
        savedImages.push(saved);
      }

      // Format response
      const formattedImages = savedImages.map(img => ({
        _id: img._id,
        url: img.url,
        width: img.metadata.width,
        height: img.metadata.height,
        content_type: img.metadata.contentType,
        createdAt: img.createdAt
      }));

      res.json({
        success: true,
        images: formattedImages,
        creditsUsed: isAdmin ? 0 : cost,
        remainingCredits: isAdmin ? 999999 : user.credits,
        seed: result.seed,
        has_nsfw_concepts: result.has_nsfw_concepts,
        isAdmin: isAdmin
      });

    } catch (falError) {
      console.error('Fal.ai API error:', falError);
      
      // Don't deduct credits if generation failed
      if (falError.message?.includes('NSFW')) {
        return res.status(400).json({
          success: false,
          message: 'The generated content was flagged as inappropriate. Please modify your prompt.'
        });
      }

      throw falError;
    }

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Handle specific errors
    if (error.message?.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    if (error.message?.includes('invalid')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid generation parameters',
        details: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate image. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get generation status (for streaming/polling if needed)
exports.getGenerationStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // For now, we're using synchronous generation
    res.json({
      success: true,
      status: 'completed',
      requestId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get generation status'
    });
  }
};