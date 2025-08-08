import axios from 'axios';

const FASHN_API_URL = 'https://api.fashn.ai/v1';

export interface FashnGenerationParams {
  modelImage: string; // URL or base64
  garmentImage: string; // URL or base64
  category?: 'auto' | 'tops' | 'bottoms' | 'one-pieces';
  mode?: 'performance' | 'balanced' | 'quality';
  garmentPhotoType?: 'auto' | 'flat-lay' | 'model';
  numSamples?: number;
  outputFormat?: 'png' | 'jpeg';
  returnBase64?: boolean;
  seed?: number;
  segmentationFree?: boolean;
  moderationLevel?: 'conservative' | 'permissive' | 'none';
}

export interface FashnPrediction {
  id: string;
  status: 'starting' | 'in_queue' | 'processing' | 'completed' | 'failed';
  output?: string[];
  error?: {
    name: string;
    message: string;
  };
}

export interface FashnCredits {
  credits: {
    total: number;
    subscription: number;
    on_demand: number;
  };
}

class FashnService {
  private apiKey: string | null = null;

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    if (!this.apiKey) {
      throw new Error('FASHN API key not set. Please configure your API key in settings.');
    }
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Run a virtual try-on prediction
  async runPrediction(params: FashnGenerationParams): Promise<string> {
    try {
      const response = await axios.post(
        `${FASHN_API_URL}/run`,
        {
          model_name: 'tryon-v1.6',
          inputs: {
            model_image: params.modelImage,
            garment_image: params.garmentImage,
            category: params.category || 'auto',
            mode: params.mode || 'balanced',
            garment_photo_type: params.garmentPhotoType || 'auto',
            num_samples: params.numSamples || 1,
            output_format: params.outputFormat || 'png',
            return_base64: params.returnBase64 || false,
            seed: params.seed || 42,
            segmentation_free: params.segmentationFree !== false,
            moderation_level: params.moderationLevel || 'permissive',
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      const data = response.data as any;
      if (!data.id) {
        throw new Error('No prediction ID returned from FASHN API');
      }

      return data.id;
    } catch (error: any) {
      console.error('FASHN run prediction error:', error.response?.data || error);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your FASHN API key.');
      }
      if (error.response?.status === 429) {
        if (error.response.data?.error?.includes('OutOfCredits')) {
          throw new Error('Out of credits. Please purchase more credits.');
        }
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(error.response?.data?.error || 'Failed to start prediction');
    }
  }

  // Get prediction status
  async getPredictionStatus(predictionId: string): Promise<FashnPrediction> {
    try {
      const response = await axios.get(
        `${FASHN_API_URL}/status/${predictionId}`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data as FashnPrediction;
    } catch (error: any) {
      console.error('FASHN get status error:', error.response?.data || error);
      if (error.response?.status === 404) {
        throw new Error('Prediction not found or expired');
      }
      throw new Error(error.response?.data?.error || 'Failed to get prediction status');
    }
  }

  // Poll for prediction result
  async waitForPrediction(
    predictionId: string, 
    onProgress?: (status: string) => void,
    maxAttempts: number = 40,
    interval: number = 3000
  ): Promise<string[]> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const prediction = await this.getPredictionStatus(predictionId);
      
      if (onProgress) {
        onProgress(prediction.status);
      }

      if (prediction.status === 'completed') {
        if (!prediction.output || prediction.output.length === 0) {
          throw new Error('No output images generated');
        }
        return prediction.output;
      }

      if (prediction.status === 'failed') {
        const errorMessage = prediction.error?.message || 'Generation failed';
        throw new Error(`FASHN API Error: ${errorMessage}`);
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Prediction timeout - took too long to complete');
  }

  // Get credits balance
  async getCredits(): Promise<FashnCredits> {
    try {
      const response = await axios.get(
        `${FASHN_API_URL}/credits`,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data as FashnCredits;
    } catch (error: any) {
      console.error('FASHN get credits error:', error.response?.data || error);
      throw new Error(error.response?.data?.error || 'Failed to get credits balance');
    }
  }

  // Helper to check if API key is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Helper to detect garment type from product metadata
  detectGarmentCategory(productType: string): 'tops' | 'bottoms' | 'one-pieces' | 'auto' {
    switch (productType) {
      case 'top':
        return 'tops';
      case 'bottom':
        return 'bottoms';
      case 'dress':
        return 'one-pieces';
      case 'outerwear':
        return 'tops'; // Outerwear is considered tops
      default:
        return 'auto';
    }
  }

  // Complete virtual try-on flow
  async generateVirtualTryOn(
    modelImageUrl: string,
    garmentImageUrl: string,
    productType: string,
    options?: Partial<FashnGenerationParams>,
    onProgress?: (status: string, progress: number) => void
  ): Promise<string[]> {
    try {
      // Start prediction
      if (onProgress) onProgress('starting', 0);
      
      const predictionId = await this.runPrediction({
        modelImage: modelImageUrl,
        garmentImage: garmentImageUrl,
        category: this.detectGarmentCategory(productType),
        ...options,
      });

      if (onProgress) onProgress('processing', 25);

      // Wait for result
      const output = await this.waitForPrediction(
        predictionId,
        (status) => {
          let progress = 25;
          switch (status) {
            case 'in_queue':
              progress = 30;
              break;
            case 'processing':
              progress = 60;
              break;
            case 'completed':
              progress = 100;
              break;
          }
          if (onProgress) onProgress(status, progress);
        }
      );

      return output;
    } catch (error: any) {
      console.error('Virtual try-on generation error:', error);
      throw error;
    }
  }
}

const fashnService = new FashnService();

// Try to load API key from environment variable (for server-side)
if (process.env.FASHN_API_KEY) {
  fashnService.setApiKey(process.env.FASHN_API_KEY);
}

export default fashnService;