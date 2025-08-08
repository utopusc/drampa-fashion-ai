import api from './api';

export interface GeneratedImageData {
  _id: string;
  url: string;
  prompt: string;
  model: {
    id: string;
    name: string;
    loraUrl?: string;
  };
  styleItems: Array<{
    type: 'background' | 'pose' | 'fashion';
    name: string;
    tag: string;
  }>;
  metadata: {
    width: number;
    height: number;
    imageSize: string;
    seed?: number;
    contentType: string;
  };
  project?: {
    _id: string;
    name: string;
  };
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImagesResponse {
  success: boolean;
  images: GeneratedImageData[];
  totalPages: number;
  currentPage: number;
  totalImages: number;
}

class ImageService {
  async getUserImages(params?: {
    page?: number;
    limit?: number;
    projectId?: string;
    isFavorite?: boolean;
    sortBy?: string;
  }): Promise<ImagesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.projectId) queryParams.append('projectId', params.projectId);
      if (params?.isFavorite !== undefined) queryParams.append('isFavorite', params.isFavorite.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const response = await api.get(`/images?${queryParams.toString()}`);
      return response.data as ImagesResponse;
    } catch (error: any) {
      console.error('Get images error:', error);
      throw error.response?.data || error;
    }
  }

  async getImageDetails(imageId: string): Promise<{ success: boolean; image: GeneratedImageData }> {
    try {
      const response = await api.get(`/images/${imageId}`);
      return response.data as any;
    } catch (error: any) {
      console.error('Get image details error:', error);
      throw error.response?.data || error;
    }
  }

  async toggleFavorite(imageId: string): Promise<{ success: boolean; isFavorite: boolean }> {
    try {
      const response = await api.patch(`/images/${imageId}/favorite`);
      return response.data as any;
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      throw error.response?.data || error;
    }
  }

  async deleteImage(imageId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/images/${imageId}`);
      return response.data as any;
    } catch (error: any) {
      console.error('Delete image error:', error);
      throw error.response?.data || error;
    }
  }
}

export default new ImageService();