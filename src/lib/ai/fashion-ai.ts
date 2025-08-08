import axios from 'axios';

// Fashion AI API Configuration
const FASHION_AI_BASE_URL = process.env.NEXT_PUBLIC_FASHION_AI_URL || 'https://api.fashion-ai.com';
const FASHION_AI_API_KEY = process.env.NEXT_PUBLIC_FASHION_AI_KEY || '';

export interface VirtualTryOnOptions {
  modelImage: string; // Base model image URL
  garmentImage: string; // Garment/product image URL
  category?: 'upper' | 'lower' | 'dress' | 'full';
  fitPreference?: 'tight' | 'regular' | 'loose';
}

export interface PoseTransferOptions {
  sourceImage: string;
  targetPose: string;
  preserveFace?: boolean;
}

export interface BackgroundRemovalOptions {
  image: string;
  outputFormat?: 'png' | 'webp';
  quality?: number;
}

class FashionAIService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = FASHION_AI_API_KEY;
    this.baseURL = FASHION_AI_BASE_URL;
  }

  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Fashion AI API Error:', error);
      throw new Error('Failed to process request with Fashion AI');
    }
  }

  /**
   * Virtual Try-On: Apply garments to models
   */
  async virtualTryOn(options: VirtualTryOnOptions): Promise<string> {
    const response = await this.makeRequest('/v1/virtual-tryon', {
      model_image: options.modelImage,
      garment_image: options.garmentImage,
      category: options.category || 'auto',
      fit_preference: options.fitPreference || 'regular',
    });
    
    return (response as any).output_url;
  }

  /**
   * Pose Transfer: Change model pose while preserving identity
   */
  async poseTransfer(options: PoseTransferOptions): Promise<string> {
    const response = await this.makeRequest('/v1/pose-transfer', {
      source_image: options.sourceImage,
      target_pose: options.targetPose,
      preserve_face: options.preserveFace !== false,
    });
    
    return (response as any).output_url;
  }

  /**
   * Background Removal: Remove or replace backgrounds
   */
  async removeBackground(options: BackgroundRemovalOptions): Promise<string> {
    const response = await this.makeRequest('/v1/background-removal', {
      image: options.image,
      output_format: options.outputFormat || 'png',
      quality: options.quality || 95,
    });
    
    return (response as any).output_url;
  }

  /**
   * Batch Processing: Process multiple images at once
   */
  async batchProcess(jobs: Array<{type: string, options: any}>): Promise<string[]> {
    const response = await this.makeRequest('/v1/batch', {
      jobs: jobs.map(job => ({
        job_type: job.type,
        parameters: job.options,
      })),
    });
    
    return (response as any).output_urls;
  }

  /**
   * Get Processing Status
   */
  async getStatus(jobId: string): Promise<{status: string, progress: number, result?: string}> {
    const response = await axios.get(`${this.baseURL}/v1/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    
    return response.data as {status: string, progress: number, result?: string};
  }
}

// Export singleton instance
export const fashionAI = new FashionAIService();

// Export types
export type { FashionAIService };