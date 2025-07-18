import { fal } from '@fal-ai/client';

// Configure Fal AI
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_AI_KEY || '',
});

export interface SDXLOptions {
  prompt: string;
  negative_prompt?: string;
  image_size?: {
    width: number;
    height: number;
  };
  num_inference_steps?: number;
  guidance_scale?: number;
  num_images?: number;
  enable_safety_checker?: boolean;
  seed?: number;
}

export interface ControlNetOptions {
  prompt: string;
  control_image: string;
  control_type: 'pose' | 'depth' | 'edge' | 'normal';
  negative_prompt?: string;
  strength?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
}

export interface InpaintingOptions {
  prompt: string;
  image: string;
  mask: string;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  strength?: number;
}

export interface ImageToImageOptions {
  prompt: string;
  image: string;
  strength?: number;
  negative_prompt?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
}

class FalAIService {
  /**
   * Generate images using SDXL
   */
  async generateSDXL(options: SDXLOptions): Promise<any> {
    try {
      const result = await fal.run('fal-ai/stable-diffusion-xl', {
        input: {
          prompt: options.prompt,
          negative_prompt: options.negative_prompt || '',
          image_size: options.image_size || { width: 1024, height: 1024 },
          num_inference_steps: options.num_inference_steps || 30,
          guidance_scale: options.guidance_scale || 7.5,
          num_images: options.num_images || 1,
          enable_safety_checker: options.enable_safety_checker !== false,
          seed: options.seed,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Fal AI SDXL Error:', error);
      throw new Error('Failed to generate image with SDXL');
    }
  }

  /**
   * Generate images with ControlNet
   */
  async generateControlNet(options: ControlNetOptions): Promise<any> {
    try {
      const result = await fal.run('fal-ai/controlnet-sdxl', {
        input: {
          prompt: options.prompt,
          control_image_url: options.control_image,
          control_type: options.control_type,
          negative_prompt: options.negative_prompt || '',
          controlnet_conditioning_scale: options.strength || 1.0,
          guidance_scale: options.guidance_scale || 7.5,
          num_inference_steps: options.num_inference_steps || 30,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Fal AI ControlNet Error:', error);
      throw new Error('Failed to generate image with ControlNet');
    }
  }

  /**
   * Inpainting - Fill masked areas
   */
  async inpaint(options: InpaintingOptions): Promise<any> {
    try {
      const result = await fal.run('fal-ai/stable-diffusion-xl-inpainting', {
        input: {
          prompt: options.prompt,
          image_url: options.image,
          mask_url: options.mask,
          negative_prompt: options.negative_prompt || '',
          guidance_scale: options.guidance_scale || 7.5,
          num_inference_steps: options.num_inference_steps || 30,
          strength: options.strength || 1.0,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Fal AI Inpainting Error:', error);
      throw new Error('Failed to inpaint image');
    }
  }

  /**
   * Image-to-Image generation
   */
  async imageToImage(options: ImageToImageOptions): Promise<any> {
    try {
      const result = await fal.run('fal-ai/stable-diffusion-xl-image-to-image', {
        input: {
          prompt: options.prompt,
          image_url: options.image,
          strength: options.strength || 0.8,
          negative_prompt: options.negative_prompt || '',
          guidance_scale: options.guidance_scale || 7.5,
          num_inference_steps: options.num_inference_steps || 30,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Fal AI Image-to-Image Error:', error);
      throw new Error('Failed to transform image');
    }
  }

  /**
   * Subscribe to generation updates
   */
  async generateWithUpdates(
    model: string, 
    input: any, 
    onUpdate: (update: any) => void
  ): Promise<any> {
    try {
      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          onUpdate({
            type: 'queue',
            position: (update as any).position || 0,
            status: update.status,
          });
        },
      });
      
      return result;
    } catch (error) {
      console.error('Fal AI Subscribe Error:', error);
      throw new Error('Failed to generate with updates');
    }
  }

  /**
   * Upload local file to Fal storage
   */
  async uploadFile(file: File): Promise<string> {
    try {
      const url = await fal.storage.upload(file);
      return url;
    } catch (error) {
      console.error('Fal AI Upload Error:', error);
      throw new Error('Failed to upload file');
    }
  }
}

// Export singleton instance
export const falAI = new FalAIService();

// Export types
export type { FalAIService };