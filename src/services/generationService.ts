import api from './api';

export interface GenerationRequest {
  prompt: string;
  imageSize: string;
  numImages: number;
  loraUrl?: string;
  projectId?: string;
  modelData?: {
    id: string;
    name: string;
    loraUrl?: string;
  };
  styleItems?: Array<{
    type: 'background' | 'pose' | 'fashion';
    name: string;
    tag: string;
  }>;
}

export interface GenerationResponse {
  success: boolean;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  creditsUsed: number;
  remainingCredits: number;
  message?: string;
}

class GenerationService {
  async generateImage(params: GenerationRequest): Promise<GenerationResponse> {
    try {
      console.log('Sending generation request:', params);
      const response = await api.post('/generation/generate', params);
      console.log('Generation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Generation error full:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      throw error.response?.data || { success: false, message: error.message };
    }
  }

  async getGenerationStatus(requestId: string) {
    try {
      const response = await api.get(`/generation/status/${requestId}`);
      return response.data;
    } catch (error: any) {
      console.error('Status check error:', error);
      throw error.response?.data || error;
    }
  }
}

export default new GenerationService();