import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://31.220.81.177';

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('drampa_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post<{token: string; user: any}>(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem('drampa_token', response.data.token);
        localStorage.setItem('drampa_user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  }

  async register(email: string, password: string, name: string) {
    try {
      const response = await axios.post<{token: string; user: any}>(`${API_URL}/api/auth/register`, {
        email,
        password,
        name,
      });
      
      if (response.data.token) {
        localStorage.setItem('drampa_token', response.data.token);
        localStorage.setItem('drampa_user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  }

  async logout() {
    localStorage.removeItem('drampa_token');
    localStorage.removeItem('drampa_user');
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
  }) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async updateProfileImage(formData: FormData) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/profile/image`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update profile image error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile image');
    }
  }

  async updatePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/password`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }

  async updatePreferences(preferences: any) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/preferences`,
        { preferences },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Update preferences error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  }

  async getCredits() {
    try {
      const response = await axios.get(`${API_URL}/api/users/credits`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error: any) {
      console.error('Get credits error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch credits');
    }
  }

  async addCredits(amount: number) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/credits/add`,
        { amount },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Add credits error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add credits');
    }
  }
}

export default new UserService();