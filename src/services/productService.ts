import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://31.220.81.177';

export interface Product {
  _id: string;
  name: string;
  type: 'top' | 'bottom' | 'dress' | 'outerwear';
  category: string;
  imageUrl: string;
  description?: string;
  tags: string[];
  userId: string;
  isActive: boolean;
  usageCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ProductService {
  private getAuthHeaders() {
    const token = localStorage.getItem('drampa_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async uploadProduct(formData: FormData): Promise<Product> {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return (response.data as any).product;
    } catch (error: any) {
      console.error('Upload product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload product');
    }
  }

  async getUserProducts(params?: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: this.getAuthHeaders(),
        params,
      });
      return response.data as any;
    } catch (error: any) {
      console.error('Get products error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return (response.data as any).product;
    } catch (error: any) {
      console.error('Get product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  async updateProduct(id: string, data: FormData | Partial<Product>): Promise<Product> {
    try {
      const isFormData = data instanceof FormData;
      const response = await axios.put(
        `${API_URL}/api/products/${id}`,
        data,
        {
          headers: {
            ...this.getAuthHeaders(),
            ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
          },
        }
      );
      return (response.data as any).product;
    } catch (error: any) {
      console.error('Update product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error: any) {
      console.error('Delete product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  }

  async incrementUsage(id: string): Promise<number> {
    try {
      const response = await axios.post(
        `${API_URL}/api/products/${id}/usage`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );
      return (response.data as any).usageCount;
    } catch (error: any) {
      console.error('Increment usage error:', error);
      throw new Error(error.response?.data?.message || 'Failed to increment usage');
    }
  }

  // Helper method to create FormData from product data
  createProductFormData(productData: {
    name: string;
    type: string;
    category: string;
    description?: string;
    tags?: string[];
    imageFile?: File;
  }): FormData {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('type', productData.type);
    formData.append('category', productData.category);
    
    if (productData.description) {
      formData.append('description', productData.description);
    }
    
    if (productData.tags && productData.tags.length > 0) {
      formData.append('tags', JSON.stringify(productData.tags));
    }
    
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }
    
    return formData;
  }
}

const productService = new ProductService();
export default productService;